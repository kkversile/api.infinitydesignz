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

  // ✅ Validate user exists
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  // ✅ Validate address exists and belongs to user
  const address = await this.prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) {
    throw new BadRequestException('Address not found or unauthorized');
  }

  // ✅ Validate coupon (if provided)
  if (couponId) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) {
      throw new BadRequestException(`Invalid coupon ID: ${couponId}`);
    }
  }

  // ✅ Validate each product and (optional) variant
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

  // ✅ Create the order
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


  async getOrderDetails(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payment: true,
        address: true,
        coupon: true,
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
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
      totalAmount: order.totalAmount,
      shipping: order.shippingFee,
      gst: order.gst,
    };
  }
}
