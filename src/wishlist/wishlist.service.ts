import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: number, dto: AddToWishlistDto) {
    try {
      // ✅ Check if user exists
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('❌ User not found');

      // ✅ Check if product exists
      const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
      if (!product) throw new NotFoundException('❌ Product not found');

      // ✅ Optional: check variant if variantId is provided
      if (dto.variantId) {
        const variant = await this.prisma.variant.findUnique({ where: { id: dto.variantId } });
        if (!variant) throw new NotFoundException('❌ Variant not found');
      }

      const item = await this.prisma.wishlist.upsert({
        where: {
          userId_productId_variantId: {
            userId,
            productId: dto.productId,
            variantId: dto.variantId ?? 0,
          },
        },
        update: {
          productId: dto.productId,
          variantId: dto.variantId ?? 0,
        },
        create: {
          userId,
          productId: dto.productId,
          variantId: dto.variantId ?? 0,
        },
      });

      return {
        message: '✅ Added to wishlist successfully.',
        data: item,
      };
    } catch (error) {
      throw new BadRequestException(`❌ Failed to add to wishlist: \n${error.message}`);
    }
  }

  async getUserWishlist(userId: number) {
    const list = await this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });

    return list;
  }

  async remove(userId: number, productId: number) {
    const result = await this.prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('❌ No wishlist item found to remove.');
    }

    return { message: '🗑️ Removed from wishlist successfully.' };
  }

  async moveToCart(userId: number, productId: number) {
    const item = await this.prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!item) throw new NotFoundException('❌ Wishlist item not found.');

    await this.remove(userId, productId);

    // TODO: Replace with actual cart service logic
    return { message: '🛒 Moved to cart successfully.' };
  }
}
