// src/buynow/buynow.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PRODUCT_IMAGE_PATH } from '../config/constants';
import { CreateBuyNowDto } from './dto/create-buy-now.dto';
import { UpdateBuyNowDto } from './dto/update-buy-now.dto';

// ETA + fee helpers (same ones used by Cart)
import {
  startCountingFrom,
  addBusinessDays,
  fmtShort,
  PLATFORM_FEE,
  DELIVERY_COMBINE_MODE,
  PER_ADDITIONAL_PAID_ITEM_FEE,
  FREE_SHIPPING_THRESHOLD,
  MAX_DELIVERY_CAP,
  COD_FEE,
} from '../config/constants';

const formatImageUrl = (fileName: string | null | undefined) =>
  fileName ? `${PRODUCT_IMAGE_PATH}${fileName}` : null;

/** Internal shape for delivery calculation (no schema change) */
type DeliveryRow = {
  qty: number;
  deliveryCharges: number | null; // from ProductDetails.deliveryCharges
};

/** Same delivery calculator as Cart (free threshold, caps, modes, COD) */
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
    if (c === null) continue; // ignore "no delivery math" items
    if (c <= 0) continue;     // free items add ₹0

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

@Injectable()
export class BuyNowService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mirrors Cart response shape:
   * {
   *   items: [...],
   *   priceSummary: {
   *     totalMRP, discountOnMRP, couponDiscount, totalAfterDiscount,
   *     platformFee, shippingFee, shippingFormula, finalPayable
   *   }
   * }
   */
  async getBuyNow(userId: number) {
    const rawItem = await this.prisma.buyNowItem.findUnique({
      where: { userId },
      include: {
        product: {
          include: {
            brand: true,
            color: true,
            size: true,
            images: { where: { isMain: true } }, // [{ url, alt }]
          },
        },
        variant: {
          include: {
            color: true,
            size: true,
            images: { where: { isMain: true } }, // [{ url, alt }]
          },
        },
      },
    });

    // Empty payload (cart-like)
    if (!rawItem) {
      const platformFee = PLATFORM_FEE;
      // No item → no delivery rows; still return shape
      const shippingFee = 0;
      return {
        items: [],
        priceSummary: {
          totalMRP: 0,
          discountOnMRP: 0,
          couponDiscount: 0,
          totalAfterDiscount: 0,
          platformFee,
          shippingFee,
          shippingFormula: 'No items → Delivery = 0',
          finalPayable: platformFee + shippingFee,
        },
      };
    }

    const useVariant = rawItem.variant !== null;

    const mainImage = useVariant
      ? rawItem.variant?.images?.[0]?.url ||
        rawItem.product?.images?.[0]?.url ||
        null
      : rawItem.product?.images?.[0]?.url || null;

    const imageAlt = useVariant
      ? rawItem.variant?.images?.[0]?.alt ||
        rawItem.product?.images?.[0]?.alt ||
        ''
      : rawItem.product?.images?.[0]?.alt || '';

    const formattedImageUrl = formatImageUrl(mainImage);

    const price = useVariant
      ? rawItem.variant?.sellingPrice ?? rawItem.product?.sellingPrice
      : rawItem.product?.sellingPrice;

    const mrp = useVariant
      ? rawItem.variant?.mrp ?? rawItem.product?.mrp
      : rawItem.product?.mrp;

    // --- ETA: read SLA from productDetails (no schema change)
    const pd = await this.prisma.productDetails.findUnique({
      where: { productId: rawItem.productId },
      select: { sla: true, deliveryCharges: true },
    });

    let estimatedDateISO: string | null = null;
    let estimatedDateText: string | null = null;

    if (typeof pd?.sla === 'number' && pd.sla >= 0) {
      const now = new Date();
      const start = startCountingFrom(now);
      const eta = addBusinessDays(start, pd.sla);
      estimatedDateISO = eta.toISOString();
      estimatedDateText = fmtShort(eta);
    }

    const productData = {
      title: rawItem.product?.title,
      brand: rawItem.product?.brand?.name,
      price,
      mrp,
      estimatedDeliveryDate: estimatedDateISO,  // machine-friendly
      estimatedDateText: estimatedDateText,     // UI-ready: "Tue, 13 Aug"
      color: useVariant
        ? rawItem.variant?.color?.label
        : rawItem.product?.color?.label,
      size: useVariant
        ? rawItem.variant?.size?.title
        : rawItem.product?.size?.title,
      imageUrl: formattedImageUrl,
      imageAlt,
    };

    // Build items array (expose deliveryCharge at item-level like Cart)
    const items = [
      {
        id: rawItem.id, // buyNowItem id
        productId: rawItem.productId,
        variantId: rawItem.variantId,
        quantity: rawItem.quantity,
        [useVariant ? 'variant' : 'product']: productData,
        deliveryCharge: pd?.deliveryCharges ?? null,
        _deliveryCharges: pd?.deliveryCharges ?? null, // internal for fee calc
      },
    ];

    // --- Price summary (coupon + platform + SHIPPING LIKE CART) ---
    const totalMRP = (mrp || 0) * rawItem.quantity;
    const totalSellingPrice = (price || 0) * rawItem.quantity;

    // Applied coupon (if any, not tied to an order)
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

    // Delivery rows: 1 item in BuyNow
    const deliveryRows: DeliveryRow[] = [
      {
        qty: rawItem.quantity,
        deliveryCharges: items[0]._deliveryCharges,
      },
    ];

    const subtotalAfterCoupon = Math.max(0, totalSellingPrice - couponDiscount);

    const { fee: shippingFee, formula: shippingFormula } =
      calculateDeliveryNoSchemaChange(deliveryRows, subtotalAfterCoupon, {
        combineMode: DELIVERY_COMBINE_MODE,
        perAdditionalPaidItemFee: PER_ADDITIONAL_PAID_ITEM_FEE,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        maxCap: MAX_DELIVERY_CAP,
        // set from session/choice if needed:
        isCOD: false,
        codFee: COD_FEE,
      });

    // Strip internals before return
    const publicItems = items.map(({ _deliveryCharges, ...rest }) => rest);

    return {
      items: publicItems,
      priceSummary: {
        totalMRP,
        discountOnMRP: totalMRP - totalSellingPrice,
        couponDiscount,
        totalAfterDiscount: subtotalAfterCoupon,
        platformFee,
        shippingFee,
        shippingFormula,
        finalPayable: subtotalAfterCoupon + platformFee + shippingFee,
      },
    };
  }

  /**
   * Set/replace the Buy Now item for the user.
   * Mirrors Cart "add" behavior and returns the same response shape.
   */
  async setBuyNow(userId: number, dto: CreateBuyNowDto) {
    // Validate variant belongs to product
    if (dto.variantId) {
      const productWithVariant = await this.prisma.product.findFirst({
        where: { id: dto.productId, variants: { some: { id: dto.variantId } } },
        select: { id: true },
      });
      if (!productWithVariant) {
        throw new BadRequestException(
          'Variant does not belong to the provided product',
        );
      }
    }

    await this.prisma.buyNowItem.upsert({
      where: { userId },
      create: {
        userId,
        productId: dto.productId,
        variantId: dto.variantId ?? null,
        quantity: dto.quantity ?? 1,
      },
      update: {
        productId: dto.productId,
        variantId: dto.variantId ?? null,
        quantity: dto.quantity ?? 1,
      },
    });

    return {
      message: 'Added to cart successfully.',
      data: await this.getBuyNow(userId),
    };
  }

  /**
   * Update quantity of Buy Now item; response mirrors Cart.
   */
  async updateBuyNow(userId: number, dto: UpdateBuyNowDto) {
    const existing = await this.prisma.buyNowItem.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException('Cart item not found or unauthorized');
    }

    await this.prisma.buyNowItem.update({
      where: { userId },
      data: {
        quantity:
          typeof dto.quantity === 'number' ? dto.quantity : existing.quantity,
      },
    });

    return {
      message: 'Cart updated successfully.',
      data: await this.getBuyNow(userId),
    };
  }

  /** Alias to satisfy controllers calling updateQuantity. */
  async updateQuantity(userId: number, dto: UpdateBuyNowDto) {
    return this.updateBuyNow(userId, dto);
  }

  /**
   * Clear Buy Now item; returns the same cart-like payload.
   */
  async clear(userId: number) {
    const existing = await this.prisma.buyNowItem.findUnique({ where: { userId } });
    if (existing) {
      await this.prisma.buyNowItem.delete({ where: { userId } });
    }
    return {
      message: 'Removed from cart successfully.',
      data: await this.getBuyNow(userId),
    };
  }
}
