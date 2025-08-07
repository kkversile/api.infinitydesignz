import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

async placeOrder(dto: CreateOrderDto, userId: number) {
  const {
    addressId,
    couponId,
    items,
    subtotal,
    shippingFee,
    gst,
    totalAmount,
    note,
  } = dto;

  //  Validate user exists
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  //  Validate address exists and belongs to user
  const address = await this.prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) {
    throw new BadRequestException('Address not found or unauthorized');
  }

  //  Validate coupon (if provided)
  if (couponId) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) {
      throw new BadRequestException(`Invalid coupon ID: ${couponId}`);
    }
  }

  //  Validate each product and (optional) variant
  for (const item of items) {
    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      throw new BadRequestException(`Product ID ${item.productId} not found`);
    }

    if (item.variantId !== undefined && item.variantId !== null) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: item.variantId },
      });
      if (!variant) {
        throw new BadRequestException(`Variant ID ${item.variantId} not found`);
      }
    }
  }

  //  Create the order
  const order = await this.prisma.order.create({
    data: {
      user: { connect: { id: userId } },
      address: { connect: { id: addressId } },
      paymentMethod: 'COD',
      coupon: couponId ? { connect: { id: couponId } } : undefined,
      subtotal,
      shippingFee,
      gst,
      totalAmount,
      note,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
      },
      payment: {
        create: {
          method: 'COD',
          status: 'PENDING',
        },
      },
    },
    include: {
      items: true,
      payment: true,
    },
  });

  return order;
}


 async listOrdersDetails(userId: number) {
  const orders = await this.prisma.order.findMany({
    where: { userId },
    select: { id: true }, // only fetch IDs for detailed processing
    orderBy: { createdAt: "desc" },
  });

  const detailedOrders = await Promise.all(
    orders.map((order) => this.getOrderDetails(order.id))
  );

  return detailedOrders;
}


  async listOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

 async generateInvoice(orderId: number) {
  const order = await this.getOrderDetails(orderId);
  return {
    invoiceNumber: `INV-${order.id}`,
    date: order.createdAt,
    items: order.items,
    totalAmount: order.priceSummary.finalPayable,
    shipping: order.priceSummary.shippingFee,
    gst: order.priceSummary.totalAfterDiscount * 0.18, // or fetch real GST if available
  };
}

  async getOrderDetails(orderId: number) {
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              brand: { select: { name: true } },
              images: { where: { isMain: true }, select: { url: true, alt: true } },
              color: { select: { label: true } },
              size: { select: { title: true } },
            },
          },
          variant: {
            include: {
              images: { where: { isMain: true }, select: { url: true, alt: true } },
              color: { select: { label: true } },
              size: { select: { title: true } },
            },
          },
        },
      },
      payment: true,
      address: true,
      coupon: true,
    },
  });

  if (!order) throw new NotFoundException("Order not found");

  let totalMRP = 0;
  let totalSellingPrice = 0;

  const items = order.items.map((item) => {
    const useVariant = item.variant !== null;

    const price = item.price;
    const mrp = useVariant
      ? item.variant?.mrp ?? item.product?.mrp
      : item.product?.mrp;

    totalMRP += (mrp || 0) * item.quantity;
    totalSellingPrice += price * item.quantity;

    const mainImage = useVariant
      ? item.variant?.images?.[0]?.url || item.product?.images?.[0]?.url || null
      : item.product?.images?.[0]?.url || null;

    const imageAlt = useVariant
      ? item.variant?.images?.[0]?.alt || item.product?.images?.[0]?.alt || ''
      : item.product?.images?.[0]?.alt || '';

    const productData = {
      title: item.product?.title,
      brand: item.product?.brand?.name,
      price,
      mrp,
      color: useVariant
        ? item.variant?.color?.label
        : item.product?.color?.label,
      size: useVariant
        ? item.variant?.size?.title
        : item.product?.size?.title,
      imageUrl: mainImage,
      imageAlt,
    };

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      total: item.total,
      [useVariant ? "variant" : "product"]: productData,
    };
  });

  // 💸 Coupon discount logic
  const coupon = order.coupon;
  let couponDiscount = 0;
  if (coupon) {
    couponDiscount =
      coupon.priceType === 'PERCENTAGE'
        ? (coupon.value / 100) * totalSellingPrice
        : Math.min(coupon.value, totalSellingPrice);
  }

  const platformFee = 20;
  const shippingFee = order.shippingFee;

  return {
    id: order.id,
    createdAt: order.createdAt,
    address: order.address,
    payment: order.payment,
    coupon: coupon
      ? {
          code: coupon.code,
          discount: couponDiscount,
        }
      : null,
    items,
    priceSummary: {
      totalMRP,
      discountOnMRP: totalMRP - totalSellingPrice,
      couponDiscount,
      totalAfterDiscount: totalSellingPrice - couponDiscount,
      platformFee,
      shippingFee,
      finalPayable:
        totalSellingPrice - couponDiscount + platformFee + shippingFee,
    },
  };
}

}
