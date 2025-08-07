import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  /** Create coupon with duplicate code protection */
  async create(data: CreateCouponDto) {
    try {
      const coupon = await this.prisma.coupon.create({ data });
      return {
        message: 'Coupon created successfully',
        data: coupon,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Coupon code already exists');
      }
      throw error;
    }
  }

  /** List all coupons */
  findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Find one coupon by ID */
  async findOne(id: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  /** Update coupon with error handling */
  async update(id: number, data: UpdateCouponDto) {
    try {
      const updated = await this.prisma.coupon.update({
        where: { id },
        data,
      });

      return {
        message: 'Coupon updated successfully',
        data: updated,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Coupon not found');
      }
      throw error;
    }
  }

  /** Delete coupon with existence check */
  async remove(id: number) {
    const exists = await this.prisma.coupon.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException('Coupon not found');
    }

    await this.prisma.coupon.delete({ where: { id } });

    return {
      message: 'Coupon deleted successfully',
    };
  }
async applyCouponToCart(userId: number, code: string) {
  const coupon = await this.prisma.coupon.findFirst({
    where: { code, status: true },
  });

  if (!coupon) {
    throw new NotFoundException('Invalid or inactive coupon');
  }

  //  Reset existing coupon for this user
  await this.prisma.appliedCoupon.deleteMany({ where: { userId } });

  //  Save new coupon
  await this.prisma.appliedCoupon.create({
    data: {
      userId,
      couponId: coupon.id,
    },
  });

  //  Get category name if LIST_SUBMENU
  let listSubCategoryName = '';
  if (coupon.type === 'LIST_SUBMENU' && coupon.listSubMenuId) {
    const listSubCategory = await this.prisma.category.findUnique({
      where: { id: coupon.listSubMenuId },
    });
    listSubCategoryName = listSubCategory?.title ?? '';
  }

  const rawCart = await this.prisma.cartItem.findMany({ where: { userId } });
  const cartItems = [];

  for (const item of rawCart) {
    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        brand: true,
        category: true,
        images: { where: { isMain: true }, select: { url: true, alt: true } },
      },
    });

    if (!product) continue;

    const variant = item.variantId
      ? await this.prisma.variant.findUnique({
          where: { id: item.variantId },
          include: {
            images: { where: { isMain: true }, select: { url: true, alt: true } },
            size: true,
            color: true,
          },
        })
      : null;

    cartItems.push({ ...item, product, variant });
  }

  if (!cartItems.length) {
    throw new BadRequestException('Cart is empty or items are invalid');
  }

  let totalMRP = 0;
  let totalSellingPrice = 0;
  let eligibleAmount = 0;

  const items = cartItems.map((item) => {
    const useVariant = item.variant !== null;

    const price = useVariant
      ? item.variant?.sellingPrice ?? item.product?.sellingPrice
      : item.product?.sellingPrice;

    const mrp = useVariant
      ? item.variant?.mrp ?? item.product?.mrp
      : item.product?.mrp;

    totalMRP += (mrp || 0) * item.quantity;
    totalSellingPrice += (price || 0) * item.quantity;

    const isBrandMatch =
      coupon.type === 'BRAND' &&
      coupon.brandId &&
      item.product?.brand?.id === coupon.brandId;

    const isListSubMatch =
      coupon.type === 'LIST_SUBMENU' &&
      coupon.listSubMenuId &&
      item.product?.categoryId === coupon.listSubMenuId;

    if (isBrandMatch || isListSubMatch) {
      eligibleAmount += price * item.quantity;
    }

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price,
      mrp,
      title: item.product?.title,
    };
  });

  if (
    coupon.minOrderAmount &&
    totalSellingPrice < coupon.minOrderAmount
  ) {
    throw new BadRequestException(
      `Minimum order value ₹${coupon.minOrderAmount} required for this coupon`
    );
  }

  //  Error if no product matched for LIST_SUBMENU coupon
  if (
    eligibleAmount === 0 &&
    coupon.type === 'LIST_SUBMENU'
  ) {
    throw new BadRequestException(
      `This coupon works only for ‘${listSubCategoryName}’ category products.`
    );
  }

  if (eligibleAmount === 0) eligibleAmount = totalSellingPrice;

  let couponDiscount = 0;
  if (coupon.priceType === 'PERCENTAGE') {
    couponDiscount = (coupon.value / 100) * eligibleAmount;
  } else {
    couponDiscount = Math.min(coupon.value, eligibleAmount);
  }

  const platformFee = 20;
  const shippingFee = 80;

  return {
    items,
    coupon: {
      code: coupon.code,
      discount: couponDiscount,
    },
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
