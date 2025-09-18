import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMainCategoryPromotionDto } from './dto/create-main-category-promotion.dto';
import { UpdateMainCategoryPromotionDto } from './dto/update-main-category-promotion.dto';
import { MAIN_CATEGORY_PROMOTION_IMAGE_PATH } from '../config/constants';
import { Prisma } from '@prisma/client';

// helpers (camelCase)
const formatImageUrl = (fileName: string | null) =>
  fileName ? `${MAIN_CATEGORY_PROMOTION_IMAGE_PATH}${fileName}` : null;

const toInt = (v: unknown, fallback = 0) => {
  if (v === null || v === undefined || v === '') return fallback;
  const n = typeof v === 'string' ? Number(v) : (v as number);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

const toBool = (v: unknown, fallback = false) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string')
    return v === 'true' || v === '1' || v.toLowerCase() === 'yes';
  if (typeof v === 'number') return v === 1;
  return fallback;
};

@Injectable()
export class MainCategoryPromotionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const items = await this.prisma.mainCategoryPromotion.findMany({
      orderBy: { priority: 'asc' },
    });
    return items.map((it) => ({
      ...it,
      imageUrl: formatImageUrl(it.imageUrl as string | null),
      displayCount: toInt(it.displayCount),
      priority: toInt(it.priority),
      status: Boolean(it.status),
      // ✅ ensure showTitle is present and defaults to true if missing
      showTitle: toBool((it as any).showTitle, true),
    }));
  }

  async create(
    data: CreateMainCategoryPromotionDto & { imageUrl: string | null }
  ) {
    try {
      if (!data.title || `${data.title}`.trim() === '') {
        throw new BadRequestException('Title is required.');
      }

      const created = await this.prisma.mainCategoryPromotion.create({
        data: {
          title: `${data.title}`.trim(),
          imageUrl: data.imageUrl ?? null, // store file name only
          displayCount: toInt((data as any).displayCount, 0),
          priority: toInt((data as any).priority, 0),
          status: toBool((data as any).status, false),
          // ✅ default true unless explicitly provided
          showTitle: toBool((data as any).showTitle, true),
        },
      });

      return {
        message: 'Home Category Promotion created successfully.',
        data: {
          ...created,
          imageUrl: formatImageUrl(created.imageUrl),
          // ensure showTitle is boolean in response
          showTitle: toBool((created as any).showTitle, true),
        },
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to create Home Category Promotion: ${error.message}`
      );
    }
  }

  async update(
    id: number,
    data: UpdateMainCategoryPromotionDto & { imageUrl?: string | null }
  ) {
    try {
      const existing = await this.prisma.mainCategoryPromotion.findUnique({
        where: { id },
      });
      if (!existing) throw new NotFoundException('Promotion not found.');

      const updated = await this.prisma.mainCategoryPromotion.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: `${data.title}`.trim() }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.displayCount !== undefined && {
            displayCount: toInt(data.displayCount, existing.displayCount ?? 0),
          }),
          ...(data.priority !== undefined && {
            priority: toInt(data.priority, existing.priority ?? 0),
          }),
          ...(data.status !== undefined && {
            status: toBool(data.status, existing.status ?? false),
          }),
          // ✅ only update if provided; default to current or true if absent in DB
          ...(data.showTitle !== undefined && {
            showTitle: toBool(
              (data as any).showTitle,
              (existing as any).showTitle ?? true
            ),
          }),
        },
      });

      return {
        message: 'Home Category Promotion updated successfully.',
        data: {
          ...updated,
          imageUrl: formatImageUrl(updated.imageUrl),
          showTitle: toBool((updated as any).showTitle, true),
        },
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to update Home Category Promotion: ${error.message}`
      );
    }
  }

  /** Remove MainCategoryPromotion: detach dependents, then delete (transactional) */
async remove(id: number) {
  const exists = await this.prisma.mainCategoryPromotion.findUnique({ where: { id } });
  if (!exists) throw new NotFoundException('Promotion not found.');

  try {
    await this.prisma.$transaction(async (tx) => {
      // Delete product join rows first
      await tx.productMainCategoryPromotion.deleteMany({
        where: { mainCategoryPromotionId: id },
      });

      // Delete product promotions under this main promotion
      await tx.mainProductPromotion.deleteMany({
        where: { mainCategoryPromotionId: id },
      });

      // Finally delete the promotion
      await tx.mainCategoryPromotion.delete({ where: { id } });
    });

    return { message: 'Home Category Promotion deleted successfully.' };
  } catch (e: any) {
    throw new BadRequestException(
      `Failed to delete Home Category Promotion: ${e.message}`,
    );
  }
}

}
