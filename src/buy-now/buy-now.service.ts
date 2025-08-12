import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBuyNowDto } from "./dto/create-buy-now.dto";
import { UpdateBuyNowDto } from "./dto/update-buy-now.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class BuyNowService {
  constructor(private readonly prisma: PrismaService) {}

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
                  title: (item.product as any).title ?? null,
                  mrp: (item.product as any).mrp ?? null,
                  sellingPrice: (item.product as any).sellingPrice ?? null,
                }
              : null,
            variant: item.variant
              ? {
                id: item.variant.id,
                sku: (item.variant as any).sku ?? null,
                mrp: (item.variant as any).mrp ?? null,
                sellingPrice: (item.variant as any).sellingPrice ?? null,
              }
              : null,
          }
        : null,
    };
  }

  /**
   * Validate product exists; if variantId provided, validate variant exists & belongs to product.
   * Throws 404/400 with clear messages before hitting DB FKs.
   */
  private async validateProductAndVariant(productId: number, variantId?: number | null) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) throw new NotFoundException("Product not found");

    if (variantId) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: variantId },
        select: { id: true, productId: true },
      });
      if (!variant) throw new NotFoundException("Variant not found");
      if (variant.productId !== productId) {
        throw new BadRequestException("Variant does not belong to the given product");
      }
    }
  }

  /**
   * Set/replace Buy Now item (single per user).
   */
  async setBuyNow(userId: number, dto: CreateBuyNowDto) {
    await this.validateProductAndVariant(dto.productId, dto.variantId ?? null);

    try {
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
        include: { product: true, variant: true },
      });

      return { message: "Buy Now item set", item };
    } catch (err: any) {
      // Translate FK errors to readable messages
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
        // P2003 = Foreign key constraint failed
        throw new BadRequestException("Invalid productId/variantId (foreign key constraint failed)");
      }
      throw err;
    }
  }

  async updateQuantity(userId: number, dto: UpdateBuyNowDto) {
    const existing = await this.prisma.buyNowItem.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException("No Buy Now item found");

    const item = await this.prisma.buyNowItem.update({
      where: { userId },
      data: { quantity: dto.quantity },
      include: { product: true, variant: true },
    });

    return { message: "Quantity updated", item };
  }

  async clear(userId: number) {
    try {
      await this.prisma.buyNowItem.delete({ where: { userId } });
    } catch (_) {}
    return { message: "Buy Now item cleared" };
  }
}
