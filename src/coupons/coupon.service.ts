// src/coupons/coupon.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Prisma } from '@prisma/client';

import {
  PLATFORM_FEE,
  DELIVERY_COMBINE_MODE,
  PER_ADDITIONAL_PAID_ITEM_FEE,
  FREE_SHIPPING_THRESHOLD,
  MAX_DELIVERY_CAP,
  COD_FEE,
  startCountingFrom,
  addBusinessDays,
  fmtShort,
} from '../config/constants';

type NormalizedItem = {
  id?: number;
  productId: number;
  variantId?: number | null;
  quantity: number;
  product: {
    id: number;
    title: string;
    mrp: number | null;
    sellingPrice: number | null;
    brand?: { id: number } | null;
    categoryId: number;
  };
  variant?: {
    id: number;
    mrp: number | null;
    sellingPrice: number | null;
    size?: any;
    color?: any;
    images?: any[];
    productId: number;
  } | null;

  // ⬇️ For delivery + ETA
  _deliveryCharges?: number | null;
  _sla?: number | null;
};

/** Delivery fee calculator (same logic as CartService) */
type DeliveryRow = { qty: number; deliveryCharges: number | null };
function calculateDeliveryNoSchemaChange(
  rows: DeliveryRow[],
  cartSubtotalAfterCoupon: number,
  opts?: {
    combineMode?: 'SUM' | 'MAX_PLUS_ADDON';
    perAdditionalPaidItemFee?: number;
    freeShippingThreshold?: number;
    maxCap?: number;
    isCOD?: boolean;
    codFee?: number;
  }
): { fee: number; formula: string } {
  const combineMode = opts?.combineMode ?? DELIVERY_COMBINE_MODE;
  const addon = opts?.perAdditionalPaidItemFee ?? PER_ADDITIONAL_PAID_ITEM_FEE;
  const threshold = opts?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD;
  const maxCap = opts?.maxCap ?? MAX_DELIVERY_CAP;
  const codFee = (opts?.isCOD && opts?.codFee) ? opts.codFee : 0;

  const paidCharges: number[] = [];
  const breakdown: string[] = [];

  for (const r of rows) {
    const c = r.deliveryCharges;
    if (c === null) continue;
    if (c <= 0) continue;
    if (r.qty > 1) breakdown.push(`${c} × ${r.qty}`);
    else breakdown.push(`${c}`);
    for (let i = 0; i < r.qty; i++) paidCharges.push(c);
  }

  let base = 0;
  let formula = '';
  if (paidCharges.length === 0) {
    base = 0;
    formula = 'No paid delivery items → Delivery = 0';
  } else if (combineMode === 'SUM') {
    base = paidCharges.reduce((a, b) => a + b, 0);
    formula = `SUM: ${breakdown.join(' + ')} = ${base}`;
  } else {
    paidCharges.sort((a, b) => b - a);
    const max = paidCharges[0];
    const remaining = paidCharges.length - 1;
    base = max + remaining * addon;
    formula = `MAX_PLUS_ADDON: max=${max} + (${remaining} × ${addon}) = ${base}`;
  }

  if (threshold && cartSubtotalAfterCoupon >= threshold) {
    formula += ` → free (subtotal ≥ ${threshold})`;
    base = 0;
  }
  if (typeof maxCap === 'number' && base > maxCap) {
    formula += ` → capped at ${maxCap}`;
    base = maxCap;
  }
  if (codFee > 0) {
    base += codFee;
    formula += ` + COD ${codFee} = ${base}`;
  }

  const fee = Math.max(0, Math.round(base));
  return { fee, formula };
}

function toDateOrNull(d: unknown): Date | null {
  if (d == null) return null;
  if (d instanceof Date && !isNaN(d.getTime())) return d;
  const t = new Date(d as any);
  return isNaN(t.getTime()) ? null : t;
}

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  /** Create coupon with duplicate code protection */
  async create(data: CreateCouponDto) {
    try {
      const coupon = await this.prisma.coupon.create({
        data: {
          code: data.code,
          type: data.type,
          priceType: data.priceType,
          value: data.value,
          minOrderAmount: data.minOrderAmount ?? 0,

          fromDate: toDateOrNull(data.fromDate),
          toDate: toDateOrNull(data.toDate),

          status: data.status ?? true,
          menuId: data.menuId ?? null,
          subMenuId: data.subMenuId ?? null,
          listSubMenuId: data.listSubMenuId ?? null,
          brandId: data.brandId ?? null,
          sellerId: data.sellerId ?? null,
          priceRangeId: data.priceRangeId ?? null,
          url: data.url ?? null,
        },
      });
      return { message: 'Coupon created successfully', data: coupon };
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
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /** Find one coupon by ID */
  async findOne(id: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  /** Update coupon with error handling */
  async update(id: number, data: UpdateCouponDto) {
    try {
      const updated = await this.prisma.coupon.update({
        where: { id },
        data: {
          ...(data.code !== undefined && { code: data.code }),
          ...(data.type !== undefined && { type: data.type }),
          ...(data.priceType !== undefined && { priceType: data.priceType }),
          ...(data.value !== undefined && { value: data.value }),
          ...(data.minOrderAmount !== undefined && { minOrderAmount: data.minOrderAmount }),
          ...(data.fromDate !== undefined && { fromDate: toDateOrNull(data.fromDate) }),
          ...(data.toDate !== undefined && { toDate: toDateOrNull(data.toDate) }),
          ...(data.status !== undefined && { status: !!data.status }),
          ...(data.menuId !== undefined && { menuId: data.menuId }),
          ...(data.subMenuId !== undefined && { subMenuId: data.subMenuId }),
          ...(data.listSubMenuId !== undefined && { listSubMenuId: data.listSubMenuId }),
          ...(data.brandId !== undefined && { brandId: data.brandId }),
          ...(data.sellerId !== undefined && { sellerId: data.sellerId }),
          ...(data.priceRangeId !== undefined && { priceRangeId: data.priceRangeId }),
          ...(data.url !== undefined && { url: data.url }),
        },
      });
      return { message: 'Coupon updated successfully', data: updated };
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
    const exists = await this.prisma.coupon.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Coupon not found');
    await this.prisma.coupon.delete({ where: { id } });
    return { message: 'Coupon deleted successfully' };
  }

  /** Active coupon by code (date window respected) */
  private async getActiveCouponByCode(code: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code, status: true },
    });
    if (!coupon) throw new NotFoundException('Invalid or inactive coupon');

    const now = new Date();
    if (coupon.fromDate && now < coupon.fromDate) {
      throw new BadRequestException('Coupon is not active yet');
    }
    if (coupon.toDate && now > coupon.toDate) {
      throw new BadRequestException('Coupon has expired');
    }
    return coupon;
  }

  // ───────────────────────────
  // APPLY TO CART
  // ───────────────────────────
  async applyCouponToCart(userId: number, code: string) {
    const coupon = await this.getActiveCouponByCode(code);

    await this.prisma.appliedCoupon.deleteMany({ where: { userId } });
    await this.prisma.appliedCoupon.create({
      data: { userId, couponId: coupon.id },
    });

    const items = await this.loadCartItemsNormalized(userId);
    if (!items.length) {
      throw new BadRequestException('Cart is empty or items are invalid');
    }

    const listSubCategoryName = await this.getListSubCategoryName(coupon);
    return this.computeCouponPricing(coupon, items, listSubCategoryName);
  }

  // ───────────────────────────
  // APPLY TO BUY-NOW ITEM
  // ───────────────────────────
  async applyCouponForItem(userId: number, code: string) {
    const coupon = await this.getActiveCouponByCode(code);

    await this.prisma.appliedCoupon.deleteMany({ where: { userId } });
    await this.prisma.appliedCoupon.create({
      data: { userId, couponId: coupon.id },
    });

    const items = await this.loadBuyNowNormalized(userId);
    const listSubCategoryName = await this.getListSubCategoryName(coupon);
    return this.computeCouponPricing(coupon, items, listSubCategoryName);
  }

  // ───────────────────────────
  // CLEAR COUPON: CART
  // ───────────────────────────
  async clearCouponCart(userId: number) {
    await this.prisma.appliedCoupon.deleteMany({ where: { userId } });

    const items = await this.loadCartItemsNormalized(userId);
    if (!items.length) {
      throw new BadRequestException('Cart is empty or items are invalid');
    }

    return this.computeNoCouponPricing(items);
  }

  // ───────────────────────────
  // CLEAR COUPON: BUY-NOW
  // ───────────────────────────
  async clearCouponBuyNow(userId: number) {
    await this.prisma.appliedCoupon.deleteMany({ where: { userId } });

    const items = await this.loadBuyNowNormalized(userId);
    return this.computeNoCouponPricing(items);
  }

  // ───────────────────────────
  // HELPERS
  // ───────────────────────────

  /** Normalize full cart to pricing items (with deliveryCharges + sla) */
  private async loadCartItemsNormalized(userId: number): Promise<NormalizedItem[]> {
    const raw = await this.prisma.cartItem.findMany({ where: { userId } });
    const items: NormalizedItem[] = [];

    for (const item of raw) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          brand: true,
          category: true,
          images: { where: { isMain: true }, select: { url: true, alt: true } },
          productDetails: { select: { deliveryCharges: true, sla: true } },
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

      items.push({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        product: {
          id: product.id,
          title: product.title,
          mrp: product.mrp,
          sellingPrice: product.sellingPrice,
          brand: product.brand ? { id: product.brand.id } : null,
          categoryId: product.categoryId,
        },
        variant: variant
          ? {
              id: variant.id,
              mrp: variant.mrp,
              sellingPrice: variant.sellingPrice,
              size: variant.size,
              color: variant.color,
              images: variant.images,
              productId: variant.productId,
            }
          : null,
        _deliveryCharges: product.productDetails?.deliveryCharges ?? null,
        _sla: product.productDetails?.sla ?? null,
      });
    }

    return items;
  }

  /** Normalize current Buy Now item (with deliveryCharges + sla) */
  private async loadBuyNowNormalized(userId: number): Promise<NormalizedItem[]> {
    const buyNow = await this.prisma.buyNowItem.findUnique({ where: { userId } });
    if (!buyNow) throw new BadRequestException('No Buy Now item found');

    const product = await this.prisma.product.findUnique({
      where: { id: buyNow.productId },
      include: {
        brand: true,
        category: true,
        images: { where: { isMain: true }, select: { url: true, alt: true } },
        productDetails: { select: { deliveryCharges: true, sla: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const variant = buyNow.variantId
      ? await this.prisma.variant.findUnique({
          where: { id: buyNow.variantId },
          include: {
            images: { where: { isMain: true }, select: { url: true, alt: true } },
            size: true,
            color: true,
          },
        })
      : null;

    return [
      {
        productId: buyNow.productId,
        variantId: buyNow.variantId ?? null,
        quantity: buyNow.quantity,
        product: {
          id: product.id,
          title: product.title,
          mrp: product.mrp,
          sellingPrice: product.sellingPrice,
          brand: product.brand ? { id: product.brand.id } : null,
          categoryId: product.categoryId,
        },
        variant: variant
          ? {
              id: variant.id,
              mrp: variant.mrp,
              sellingPrice: variant.sellingPrice,
              size: variant.size,
              color: variant.color,
              images: variant.images,
              productId: variant.productId,
            }
          : null,
        _deliveryCharges: product.productDetails?.deliveryCharges ?? null,
        _sla: product.productDetails?.sla ?? null,
      },
    ];
  }

  /** Resolve category name for LIST_SUBMENU message, otherwise '' */
  private async getListSubCategoryName(coupon: any): Promise<string> {
    if (coupon?.type === 'LIST_SUBMENU' && coupon.listSubMenuId) {
      const list = await this.prisma.category.findUnique({
        where: { id: coupon.listSubMenuId },
      });
      return list?.title ?? '';
    }
    return '';
  }

  // ───────────────────────────
  // Pricing builders
  // ───────────────────────────

  /** No-coupon pricing (adds ETA + shipping fee like CartService) */
  private computeNoCouponPricing(items: NormalizedItem[]) {
    let totalMRP = 0;
    let totalSellingPrice = 0;

    const responseItems = items.map((it) => {
      const useVariant = !!it.variant;

      const unitPrice = useVariant
        ? it.variant?.sellingPrice ?? it.product?.sellingPrice ?? 0
        : it.product?.sellingPrice ?? 0;

      const unitMrp = useVariant
        ? it.variant?.mrp ?? it.product?.mrp ?? 0
        : it.product?.mrp ?? 0;

      totalMRP += unitMrp * it.quantity;
      totalSellingPrice += unitPrice * it.quantity;

      // ETA like CartService
      const slaDays = typeof it._sla === 'number' ? it._sla : null;
      let estimatedDeliveryDate: string | null = null;
      let estimatedDateText: string | null = null;
      if (slaDays !== null && slaDays >= 0) {
        const start = startCountingFrom(new Date());
        const eta = addBusinessDays(start, slaDays);
        estimatedDeliveryDate = eta.toISOString();
        estimatedDateText = fmtShort(eta);
      }

      return {
        id: it.id,
        productId: it.productId,
        variantId: it.variantId ?? null,
        quantity: it.quantity,
        price: unitPrice,
        mrp: unitMrp,
        title: it.product?.title,
        estimatedDeliveryDate,
        estimatedDateText,
      };
    });

    const couponDiscount = 0;
    const platformFee = PLATFORM_FEE;

    // shipping fee like CartService
    const deliveryRows: DeliveryRow[] = items.map((it) => ({
      qty: it.quantity,
      deliveryCharges: it._deliveryCharges ?? null,
    }));
    const cartSubtotalAfterCoupon = Math.max(0, totalSellingPrice - couponDiscount);
    const { fee: shippingFee, formula: shippingFormula } =
      calculateDeliveryNoSchemaChange(deliveryRows, cartSubtotalAfterCoupon, {
        combineMode: DELIVERY_COMBINE_MODE,
        perAdditionalPaidItemFee: PER_ADDITIONAL_PAID_ITEM_FEE,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        maxCap: MAX_DELIVERY_CAP,
        isCOD: false,
        codFee: COD_FEE,
      });

    return {
      items: responseItems,
      coupon: null,
      priceSummary: {
        totalMRP,
        discountOnMRP: totalMRP - totalSellingPrice,
        couponDiscount,
        totalAfterDiscount: cartSubtotalAfterCoupon,
        platformFee,
        shippingFee,
        shippingFormula,
        finalPayable: cartSubtotalAfterCoupon + platformFee + shippingFee,
      },
    };
  }

  /** Coupon pricing (adds ETA + shipping fee like CartService) */
  private computeCouponPricing(
    coupon: any,
    items: NormalizedItem[],
    listSubCategoryName: string
  ) {
    let totalMRP = 0;
    let totalSellingPrice = 0;
    let eligibleAmount = 0;

    const responseItems = items.map((it) => {
      const useVariant = !!it.variant;

      const unitPrice = useVariant
        ? it.variant?.sellingPrice ?? it.product?.sellingPrice ?? 0
        : it.product?.sellingPrice ?? 0;

      const unitMrp = useVariant
        ? it.variant?.mrp ?? it.product?.mrp ?? 0
        : it.product?.mrp ?? 0;

      totalMRP += unitMrp * it.quantity;
      totalSellingPrice += unitPrice * it.quantity;

      const isBrandMatch =
        coupon.type === 'BRAND' &&
        coupon.brandId &&
        it.product?.brand?.id === coupon.brandId;

      const isListSubMatch =
        coupon.type === 'LIST_SUBMENU' &&
        coupon.listSubMenuId &&
        it.product?.categoryId === coupon.listSubMenuId;

      if (isBrandMatch || isListSubMatch) {
        eligibleAmount += unitPrice * it.quantity;
      }

      // ETA like CartService
      const slaDays = typeof it._sla === 'number' ? it._sla : null;
      let estimatedDeliveryDate: string | null = null;
      let estimatedDateText: string | null = null;
      if (slaDays !== null && slaDays >= 0) {
        const start = startCountingFrom(new Date());
        const eta = addBusinessDays(start, slaDays);
        estimatedDeliveryDate = eta.toISOString();
        estimatedDateText = fmtShort(eta);
      }

      return {
        id: it.id,
        productId: it.productId,
        variantId: it.variantId ?? null,
        quantity: it.quantity,
        price: unitPrice,
        mrp: unitMrp,
        title: it.product?.title,
        estimatedDeliveryDate,
        estimatedDateText,
      };
    });

    if (coupon.minOrderAmount && totalSellingPrice < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Minimum order value ₹${coupon.minOrderAmount} required for this coupon`
      );
    }

    if (eligibleAmount === 0 && coupon.type === 'LIST_SUBMENU') {
      const name = listSubCategoryName || 'this';
      throw new BadRequestException(
        `This coupon works only for ‘${name}’ category products.`
      );
    }

    if (eligibleAmount === 0) {
      eligibleAmount = totalSellingPrice;
    }

    // Discount
    let couponDiscount = 0;
    if (coupon.priceType === 'PERCENTAGE') {
      couponDiscount = (coupon.value / 100) * eligibleAmount;
    } else {
      couponDiscount = Math.min(coupon.value, eligibleAmount);
    }

    const platformFee = PLATFORM_FEE;

    // shipping fee like CartService (based on subtotal AFTER coupon)
    const deliveryRows: DeliveryRow[] = items.map((it) => ({
      qty: it.quantity,
      deliveryCharges: it._deliveryCharges ?? null,
    }));
    const cartSubtotalAfterCoupon = Math.max(0, totalSellingPrice - couponDiscount);
    const { fee: shippingFee, formula: shippingFormula } =
      calculateDeliveryNoSchemaChange(deliveryRows, cartSubtotalAfterCoupon, {
        combineMode: DELIVERY_COMBINE_MODE,
        perAdditionalPaidItemFee: PER_ADDITIONAL_PAID_ITEM_FEE,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        maxCap: MAX_DELIVERY_CAP,
        isCOD: false,
        codFee: COD_FEE,
      });

    return {
      items: responseItems,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: couponDiscount,
      },
      priceSummary: {
        totalMRP,
        discountOnMRP: totalMRP - totalSellingPrice,
        couponDiscount,
        totalAfterDiscount: cartSubtotalAfterCoupon,
        platformFee,
        shippingFee,
        shippingFormula,
        finalPayable: cartSubtotalAfterCoupon + platformFee + shippingFee,
      },
    };
  }
}
