export const CATEGORY_IMAGE_PATH = '/uploads/categories/';
export const PRODUCT_IMAGE_PATH = '/uploads/products/';
export const SLIDER_RIGHT_IMAGE_PATH = '/uploads/slider-right/';
export const SLIDERS_IMAGE_PATH = '/uploads/sliders/';
export const MAIN_CATEGORY_PROMOTION_IMAGE_PATH = '/uploads/category_promotions/';
export const MAIN_PRODUCT_PROMOTION_IMAGE_PATH = '/uploads/main-product-promotions/';

/* =========================
   DELIVERY POLICY (no schema change)
   =========================
   We only use ProductDetails.deliveryCharges:
   - null  => IGNORE from delivery math
   - 0     => FREE (ships, but adds ₹0)
   - >0    => PAID

   Combine mode: MAX_PLUS_ADDON (good for bulky furniture)
   You can change these constants anytime without touching UI/DB.
*/
export const DELIVERY_COMBINE_MODE: 'SUM' | 'MAX_PLUS_ADDON' = 'SUM';
// small add-on for each extra PAID item beyond the max one:
export const PER_ADDITIONAL_PAID_ITEM_FEE = 149;
// free shipping if subtotal AFTER coupon >= threshold (₹)
export const FREE_SHIPPING_THRESHOLD = 25000;
// never charge more than this (₹)
export const MAX_DELIVERY_CAP = 2499;
// optional: COD add-on (₹). You can wire isCOD later in getUserCart if needed.
export const COD_FEE = 0;

export const PLATFORM_FEE = 30;


// (keep your existing exports above as-is)

export const CUTOFF_HOUR_LOCAL = 14; // 2pm local -> after this, start counting from next business day
export const SKIP_WEEKENDS = true;
export const HOLIDAYS: string[] = []; // ISO 'YYYY-MM-DD'

// === Reusable ETA helpers (single source of truth) ===
export function isHoliday(d: Date): boolean {
  const iso = d.toISOString().slice(0, 10);
  return HOLIDAYS.includes(iso);
}

export function isWeekend(d: Date): boolean {
  const wd = d.getDay(); // 0 Sun .. 6 Sat
  return wd === 0 || wd === 6;
}

export function nextBusinessDay(d: Date): Date {
  const x = new Date(d);
  do {
    x.setDate(x.getDate() + 1);
  } while ((SKIP_WEEKENDS && isWeekend(x)) || isHoliday(x));
  return x;
}

export function addBusinessDays(start: Date, days: number): Date {
  let cur = new Date(start);
  let remaining = days;
  while (remaining > 0) {
    cur = nextBusinessDay(cur);
    remaining--;
  }
  return cur;
}

export function startCountingFrom(now: Date): Date {
  const afterCutoff = now.getHours() >= CUTOFF_HOUR_LOCAL;
  if (afterCutoff || (SKIP_WEEKENDS && isWeekend(now)) || isHoliday(now)) {
    return nextBusinessDay(now);
  }
  return now;
}

export function fmtShort(d: Date, locale?: string): string {
  return d.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }); // e.g. "Tue, 13 Aug"
}


