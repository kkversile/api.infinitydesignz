import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBuyNowDto } from "./dto/create-buy-now.dto";
import { UpdateBuyNowDto } from "./dto/update-buy-now.dto";

/**
 * Service for Buy Now (single-item, no sync)
 * NOTE: This expects a Prisma model named `BuyNowItem` (example schema is provided in docs string below).
 */
@Injectable()
export class BuyNowService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the user's single Buy Now item (with basic product info if available).
   */
  async getBuyNow(userId: number) {
    const item = await this.prisma.buyNowItem.findUnique({
      where: { userId },
      include: {
        product: true,
        variant: true,
      },
    });

    return {
      item: item
        ? {
            id: item.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            product: item.product
              ? {
                  id: item.product.id,
                  name: (item.product as any).name ?? (item.product as any).title ?? null,
                  price: (item.product as any).price ?? null,
                }
              : null,
            variant: item.variant
              ? {
                  id: item.variant.id,
                  sku: (item.variant as any).sku ?? null,
                  price: (item.variant as any).price ?? null,
                }
              : null,
          }
        : null,
    };
  }

  /**
   * Set/replace Buy Now item (enforces single item per user).
   */
  async setBuyNow(userId: number, dto: CreateBuyNowDto) {
    // Replace (upsert) the single item
    const item = await this.prisma.buyNowItem.upsert({
      where: { userId },
      create: {
        userId,
        productId: dto.productId,
        variantId: dto.variantId ?? null,
        quantity: dto.quantity,
      },
      update: {
        productId: dto.productId,
        variantId: dto.variantId ?? null,
        quantity: dto.quantity,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return {
      message: "Buy Now item set",
      item,
    };
  }

  /**
   * Update only the quantity of the Buy Now item.
   */
  async updateQuantity(userId: number, dto: UpdateBuyNowDto) {
    const existing = await this.prisma.buyNowItem.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException("No Buy Now item found");

    const item = await this.prisma.buyNowItem.update({
      where: { userId },
      data: { quantity: dto.quantity },
      include: { product: true, variant: true },
    });

    return {
      message: "Quantity updated",
      item,
    };
  }

  /**
   * Clear the Buy Now item for user.
   */
  async clear(userId: number) {
    // deleteIfExists pattern
    try {
      await this.prisma.buyNowItem.delete({ where: { userId } });
    } catch (_) {
      // ignore if not exist
    }
    return { message: "Buy Now item cleared" };
  }
}
