
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

const formatImageUrl = (fileName: string | null) =>
  fileName ? `${PRODUCT_IMAGE_PATH}${fileName}` : null;

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

    let variantId: number | null = null;

    if (dto.variantId && dto.variantId > 0) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: dto.variantId },
      });
      if (!variant) throw new NotFoundException(`Variant ID ${dto.variantId} not found.`);
      variantId = dto.variantId;
    }

    const existing = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId: dto.productId,
        variantId,
      },
    });

    let item;
    if (existing) {
      item = await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + dto.quantity,
        },
      });
    } else {

      
      item = await this.prisma.cartItem.create({
        data: {
          userId,
          productId: dto.productId,
          variantId,
          quantity: dto.quantity,
        },
      });
    }

    return {
      message: '✅ Added to cart successfully.',
      data: item,
    };
  }

  async getUserCart(userId: number) {
    const list = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              select: { url: true, alt: true },
            },
            brand: { select: { name: true } },
            color: { select: { label: true } },
            size: { select: { title: true } },
          },
        },
        variant: {
          include: {
            images: {
              where: { isMain: true },
              select: { url: true, alt: true },
            },
            size: { select: { title: true } },
            color: { select: { label: true } },
          },
        },
      },
    });

    return list.map((item) => {
      const useVariant = item.variantId !== null;

      const mainImage = useVariant
        ? item.variant?.images?.[0]?.url || item.product?.images?.[0]?.url || null
        : item.product?.images?.[0]?.url || null;

      const imageAlt = useVariant
        ? item.variant?.images?.[0]?.alt || item.product?.images?.[0]?.alt || ''
        : item.product?.images?.[0]?.alt || '';

      const formattedImageUrl = formatImageUrl(mainImage);

      const response: any = {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      };

      if (useVariant) {
        response.variant = {
          title: item.product?.title,
          brand: item.product?.brand?.name,
          price: item.variant?.sellingPrice || item.product?.sellingPrice,
          mrp: item.variant?.mrp || item.product?.mrp,
          color: item.variant?.color?.label || null,
          size: item.variant?.size?.title || null,
          imageUrl: formattedImageUrl,
          imageAlt,
        };
      } else {
        response.product = {
          title: item.product?.title,
          brand: item.product?.brand?.name,
          price: item.product?.sellingPrice,
          mrp: item.product?.mrp,
          color: item.product?.color?.label || null,
          size: item.product?.size?.title || null,
          imageUrl: formattedImageUrl,
          imageAlt,
        };
      }

      return response;
    });
  }

  async removeFromCart(userId: number, cartId: number) {
    const cart = await this.prisma.cartItem.findUnique({
      where: { id: cartId },
    });

    if (!cart || cart.userId !== userId) {
      throw new NotFoundException('❌ Cart item not found or unauthorized');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartId },
    });

    return { message: '✅ Removed from cart successfully.' };
  }

  async updateCart(userId: number, dto: UpdateCartDto) {
    const cart = await this.prisma.cartItem.findFirst({
      where: {
        userId,
       id: dto.cartId,
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.update({
      where: { id: cart.id },
      data: {
        quantity: dto.quantity,
      },
    });
  }

  async syncGuestCart(userId: number, dto: SyncCartDto) {
  await this.prisma.cartItem.deleteMany({ where: { userId } });

  const data = await Promise.all(
    dto.items.map(async (item) => {
      let productId = item.productId;

      if (item.variantId) {
        const variant = await this.prisma.variant.findUnique({
          where: { id: item.variantId },
          select: { productId: true },
        });

        if (!variant) {
          throw new NotFoundException(`Invalid variant ID: ${item.variantId} in sync data`);
        }

        productId = variant.productId;
      }

      return {
        userId,
        productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
      };
    }),
  );

  return this.prisma.cartItem.createMany({ data });
}

}
