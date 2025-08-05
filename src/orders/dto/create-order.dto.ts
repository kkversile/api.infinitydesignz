export class CreateOrderDto {
  addressId: number;
  deliveryOptionId: number; // ✅ Replaces deliveryType enum
  couponId?: number;
  subtotal: number;
  shippingFee: number;
  gst: number;
  totalAmount: number;
  note?: string;
  items: {
    productId: number;
    variantId?: number;
    quantity: number;
    price: number;
    total: number;
  }[];
}
