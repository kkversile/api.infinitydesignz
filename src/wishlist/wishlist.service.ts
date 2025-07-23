import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: number, dto: AddToWishlistDto) {
    return this.prisma.wishlist.upsert({
      where: {
        userId_productId_variantId: {
          userId,
          productId: dto.productId,
          variantId: dto.variantId ?? 0,
        },
      },
      update: {
        quantity: dto.quantity ?? 1,
        size: dto.size,
      },
      create: {
        userId,
        productId: dto.productId,
        variantId: dto.variantId ?? 0,
        quantity: dto.quantity ?? 1,
        size: dto.size,
      },
    });
  }

  async getUserWishlist(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async remove(userId: number, productId: number) {
    return this.prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }

  async moveToCart(userId: number, productId: number) {
    const item = await this.prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');

    await this.remove(userId, productId);
    return { message: 'Moved to cart successfully (simulate)' };
  }
}
