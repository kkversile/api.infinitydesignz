import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { PRODUCT_IMAGE_PATH } from '../config/constants';
import {PLATFORM_FEE,DELIVERY_COMBINE_MODE,PER_ADDITIONAL_PAID_ITEM_FEE,FREE_SHIPPING_THRESHOLD,MAX_DELIVERY_CAP,COD_FEE} from '../config/constants';

import {
  // ...your existing imports
  CUTOFF_HOUR_LOCAL, SKIP_WEEKENDS, HOLIDAYS, // optional, if you want
 isHoliday, isWeekend,nextBusinessDay,startCountingFrom, addBusinessDays, fmtShort,
} from '../config/constants';
const formatImageUrl = (fileName: string | null) =>
  fileName ? `${PRODUCT_IMAGE_PATH}${fileName}` : null;


/** Internal shape for delivery calculation (no new schema) */
type DeliveryRow = {
  qty: number;
  deliveryCharges: number | null; // from ProductDetails.deliveryCharges
};

/** Calculate delivery using only ProductDetails.deliveryCharges. */
/** Calculate delivery using only ProductDetails.deliveryCharges.
 *  Returns both numeric fee and a human-readable formula string.
 */
function calculateDeliveryNoSchemaChange(
  rows: DeliveryRow[],
  cartSubtotalAfterCoupon: number,
  opts?: { combineMode?: 'SUM' | 'MAX_PLUS_ADDON'; perAdditionalPaidItemFee?: number; freeShippingThreshold?: number; maxCap?: number; isCOD?: boolean; codFee?: number }
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

    if (r.qty > 1) {
      breakdown.push(`${c} × ${r.qty}`);
    } else {
      breakdown.push(`${c}`);
    }

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



@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Optional variant check
    let variantId: number | null = null;
    if (dto.variantId && dto.variantId > 0) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: dto.variantId },
      });
      if (!variant) throw new NotFoundException(`Variant ID ${dto.variantId} not found.`);
      variantId = dto.variantId;
    }

    // 🔍 Look for existing match (with or without variant)
    const existing = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId: dto.productId,
        variantId: variantId ?? null,
      },
    });

    let item;
    if (existing) {
      // 🔁 Update quantity if match found
      item = await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + dto.quantity,
        },
      });
    } else {
      // ➕ Create new cart item
      item = await this.prisma.cartItem.create({
        data: {
          userId,
          productId: dto.productId,
          variantId: variantId,
          quantity: dto.quantity,
        },
      });
    }

    return {
      message: ' Added to cart successfully.',
      data: await this.getUserCart(userId),
    };
  }

  async getUserCart(userId: number) {
    const allCartItems = await this.prisma.cartItem.findMany({
      where: { userId },
    });

    const filteredCartItems: any[] = [];

    for (const item of allCartItems) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          images: { where: { isMain: true }, select: { url: true, alt: true } },
          brand: { select: { name: true } },
          color: { select: { label: true } },
          size: { select: { title: true } },
        },
      });

      if (!product) continue; // skip deleted products

      const variant = item.variantId
        ? await this.prisma.variant.findUnique({
            where: { id: item.variantId },
            include: {
              images: { where: { isMain: true }, select: { url: true, alt: true } },
              size: { select: { title: true } },
              color: { select: { label: true } },
            },
          })
        : null;

      // 🔎 Fetch ProductDetails ONLY for deliveryCharges (no schema change)
      const details = await this.prisma.productDetails.findUnique({
        where: { productId: item.productId },
        select: { deliveryCharges: true, sla: true },
      });

      filteredCartItems.push({ ...item, product, variant, details });
    }

    let totalMRP = 0;
    let totalSellingPrice = 0;

const items = filteredCartItems.map((item) => {
  const useVariant = item.variant !== null;

  const mainImage = useVariant
    ? item.variant?.images?.[0]?.url || item.product?.images?.[0]?.url || null
    : item.product?.images?.[0]?.url || null;

  const imageAlt = useVariant
    ? item.variant?.images?.[0]?.alt || item.product?.images?.[0]?.alt || ''
    : item.product?.images?.[0]?.alt || '';

  const formattedImageUrl = formatImageUrl(mainImage);

  const price = useVariant
    ? item.variant?.sellingPrice ?? item.product?.sellingPrice
    : item.product?.sellingPrice;

  const mrp = useVariant
    ? item.variant?.mrp ?? item.product?.mrp
    : item.product?.mrp;

  totalMRP += (mrp || 0) * item.quantity;
  totalSellingPrice += (price || 0) * item.quantity;
  // --- Delivery ETA ---
  const now = new Date();
  const slaDays = item.product?.product_details?.sla ?? item.details?.sla ?? null; // try both if available
  // If you only fetched deliveryCharges, also select 'sla' in the productDetails query above:
  // select: { deliveryCharges: true, sla: true }

  let estimatedDateISO: string | null = null;
  let estimatedDateText: string | null = null;

  if (typeof slaDays === 'number' && slaDays >= 0) {
    const start = startCountingFrom(now);
    const eta = addBusinessDays(start, slaDays);
    estimatedDateISO = eta.toISOString();
    estimatedDateText = `${fmtShort(eta)}`;
  }

  const productData = {
    title: item.product?.title,
    brand: item.product?.brand?.name,
    price,
    mrp,
    estimatedDeliveryDate: estimatedDateISO,      // machine-friendly
    estimatedDateText: estimatedDateText,     // UI-ready: "Tue, 13 Aug"
    color: useVariant
      ? item.variant?.color?.label
      : item.product?.color?.label,
    size: useVariant
      ? item.variant?.size?.title
      : item.product?.size?.title,
    imageUrl: formattedImageUrl,
    imageAlt,
  };

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    [useVariant ? 'variant' : 'product']: productData,
    
    deliveryCharge: item.details?.deliveryCharges ?? null,  // 👈 expose item-level delivery charge
    _deliveryCharges: item.details?.deliveryCharges ?? null, // keep internal for fee calculation
  };
});


    // ✅ Fetch applied coupon (if not yet used in order)
    const appliedCoupon = await this.prisma.appliedCoupon.findFirst({
      where: { userId, orderId: null },
      include: { coupon: true },
    });

    let couponDiscount = 0;

    if (appliedCoupon?.coupon?.status) {
      const coupon = appliedCoupon.coupon;
      const now = new Date();
      const isValidDate =
        (!coupon.fromDate || coupon.fromDate <= now) &&
        (!coupon.toDate || coupon.toDate >= now);

      const meetsMinOrder = totalSellingPrice >= coupon.minOrderAmount;

      if (isValidDate && meetsMinOrder) {
        const eligibleAmount = totalSellingPrice;

        couponDiscount =
          coupon.priceType === 'PERCENTAGE'
            ? (coupon.value / 100) * eligibleAmount
            : Math.min(coupon.value, eligibleAmount);
      }
    }

    const platformFee = PLATFORM_FEE;

    // =========================
    // NEW: DELIVERY FEE (computed; no schema change)
    // =========================
    const deliveryRows: DeliveryRow[] = items.map(it => ({
      qty: it.quantity,
      deliveryCharges: it._deliveryCharges, // null => ignore, 0 => free, >0 => paid
    }));

    const cartSubtotalAfterCoupon = Math.max(0, totalSellingPrice - couponDiscount);

const { fee: shippingFee, formula: shippingFormula } = calculateDeliveryNoSchemaChange(
  deliveryRows,
  cartSubtotalAfterCoupon,
  {
    combineMode: DELIVERY_COMBINE_MODE,
    perAdditionalPaidItemFee: PER_ADDITIONAL_PAID_ITEM_FEE,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    maxCap: MAX_DELIVERY_CAP,
    // Wire isCOD here if you add it to the request/session:
    isCOD: false,
    codFee: COD_FEE,
  }
);

    return {
      items: items.map(({ _deliveryCharges, ...rest }) => rest), // don’t leak internals
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

  async removeFromCart(userId: number, cartId: number) {
    const cart = await this.prisma.cartItem.findUnique({
      where: { id: cartId },
    });

    if (!cart || cart.userId !== userId) {
      throw new NotFoundException('Cart item not found or unauthorized');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartId },
    });

    return {
      message: 'Removed from cart successfully.',
      data: await this.getUserCart(userId),
    };
  }

  async updateCart(userId: number, cartId:number,dto: UpdateCartDto) {
    const cart = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        id: cartId,
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.update({
      where: { id: cart.id },
      data: {
        quantity: dto.quantity,
      },
    });

    return {
      message: ' Cart updated successfully.',
      data: await this.getUserCart(userId),
    };
  }

  async syncGuestCart(userId: number, dto: SyncCartDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    for (const guestItem of dto.items) {
      let productId = guestItem.productId;

      //  Check if variant exists and get real productId
      if (guestItem.variantId) {
        const variant = await this.prisma.variant.findUnique({
          where: { id: guestItem.variantId },
          select: { productId: true },
        });

        if (!variant) {
          throw new NotFoundException(`Invalid variant ID: ${guestItem.variantId}`);
        }

        productId = variant.productId;
      }

      // 🔍 Check for existing item in user's cart (product + variant match)
      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          userId,
          productId,
          variantId: guestItem.variantId ?? null,
        },
      });

      if (existingItem) {
        // 🔁 Update quantity
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + guestItem.quantity,
          },
        });
      } else {
        // ➕ Add new cart item
        await this.prisma.cartItem.create({
          data: {
            userId,
            productId,
            variantId: guestItem.variantId ?? null,
            quantity: guestItem.quantity,
          },
        });
      }
    }

    return {
      message: ' Guest cart synced successfully with merge.',
      data: await this.getUserCart(userId),
    };
  }

  // NEW: clear items and any pending applied coupon for this user
  async clearCart(userId: number) {
    await this.prisma.$transaction([
      this.prisma.cartItem.deleteMany({ where: { userId } }),
      this.prisma.appliedCoupon.deleteMany({ where: { userId, orderId: null } }),
    ]);

    return {
      message: 'Cart cleared successfully',
      data: await this.getUserCart(userId),
    };
  }
}
