import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMainProductPromotionDto } from './dto/create-main-product-promotion.dto';
import { UpdateMainProductPromotionDto } from './dto/update-main-product-promotion.dto';
import { MAIN_PRODUCT_PROMOTION_IMAGE_PATH, MAIN_CATEGORY_PROMOTION_IMAGE_PATH } from '../config/constants';


const img = (base: string, fileName: string | null) =>
  fileName ? `${base}${fileName}` : null;

// ---------- helpers (same style as main-category-promotion.service) ----------
const formatImageUrl = (fileName: string | null) =>
  fileName ? `${MAIN_PRODUCT_PROMOTION_IMAGE_PATH}${fileName}` : null;

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
export class MainProductPromotionService {
  constructor(private readonly prisma: PrismaService) {}

  // Controller passes (dto, file.filename)
  async create(dto: CreateMainProductPromotionDto, imageFileName: string) {
    await this.verifyForeignKeys({
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      mainCategoryPromotionId: dto.mainCategoryPromotionId,
    });

    try {
      const created = await this.prisma.mainProductPromotion.create({
        data: {
          title: `${dto.title}`.trim(),
          priority: toInt(dto.priority, 0),

          mainCategoryPromotionId: dto.mainCategoryPromotionId,
          imageUrl: imageFileName, // store only file name

          categoryId: dto.categoryId,
          brandId: dto.brandId ?? null,
          seller: dto.seller ?? null,

          minPrice: dto.minPrice ?? null,
          maxPrice: dto.maxPrice ?? null,
          offerPercentFrom: dto.offerPercentFrom ?? null,
          offerPercentTo: dto.offerPercentTo ?? null,

          seoTitle: dto.seoTitle ?? null,
          seoDescription: dto.seoDescription ?? null,
          seoKeywords: dto.seoKeywords ?? null,

          status: toBool(dto.status, true),
        },
        include: { brand: true, category: true, mainCategoryPromotion: true },
      });

      // return with formatted URL
      return {
        message: 'Product promotion created successfully.',
        data: {
          ...created,
          imageUrl: formatImageUrl(created.imageUrl),
          priority: toInt(created.priority),
          status: Boolean(created.status),
        },
      };
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw new BadRequestException('Invalid foreign key(s). Check mainCategoryPromotionId / categoryId / brandId.');
      }
      throw new BadRequestException(`Failed to create Product Promotion: ${e.message}`);
    }
  }

  async findAll(params: { page?: number | string; limit?: number | string; status?: 'all' | 'active' | 'inactive'; q?: string }) {
    const page = Math.max(1, Number(params.page ?? 1));
    const take = Math.min(100, Math.max(1, Number(params.limit ?? 20)));
    const skip = (page - 1) * take;

    const where: any = {};
    if (params.status === 'active') where.status = true;
    if (params.status === 'inactive') where.status = false;

    if (params.q?.trim()) {
      const q = params.q.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { seller: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mainProductPromotion.findMany({
        where,
        orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
        include: { brand: true, category: true, mainCategoryPromotion: true },
        skip,
        take,
      }),
      this.prisma.mainProductPromotion.count({ where }),
    ]);

    return {
      page,
      limit: take,
      total,
      items: items.map(it => ({
        ...it,
        imageUrl: formatImageUrl(it.imageUrl),
        priority: toInt(it.priority),
        status: Boolean(it.status),
      })),
    };
  }

  async findOne(id: number) {
    const row = await this.prisma.mainProductPromotion.findUnique({
      where: { id },
      include: { brand: true, category: true, mainCategoryPromotion: true },
    });
    if (!row) throw new NotFoundException('Promotion not found');
    return {
      ...row,
      imageUrl: formatImageUrl(row.imageUrl),
      priority: toInt(row.priority),
      status: Boolean(row.status),
    };
  }

  // Controller merges filename into dto on multipart PATCH (image optional)
  async update(id: number, dto: UpdateMainProductPromotionDto) {
    await this.ensureExists(id);
    await this.verifyForeignKeys(
      {
        categoryId: dto.categoryId,
        brandId: dto.brandId,
        mainCategoryPromotionId: dto.mainCategoryPromotionId,
      },
      true,
    );

    try {
      const updated = await this.prisma.mainProductPromotion.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: `${dto.title}`.trim() } : {}),
          ...(dto.priority !== undefined ? { priority: toInt(dto.priority) } : {}),

          ...(dto.mainCategoryPromotionId !== undefined ? { mainCategoryPromotionId: dto.mainCategoryPromotionId } : {}),
          // store filename if provided
          ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),

          ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
          ...(dto.brandId !== undefined ? { brandId: dto.brandId ?? null } : {}),
          ...(dto.seller !== undefined ? { seller: dto.seller ?? null } : {}),

          ...(dto.minPrice !== undefined ? { minPrice: dto.minPrice } : {}),
          ...(dto.maxPrice !== undefined ? { maxPrice: dto.maxPrice } : {}),
          ...(dto.offerPercentFrom !== undefined ? { offerPercentFrom: dto.offerPercentFrom } : {}),
          ...(dto.offerPercentTo !== undefined ? { offerPercentTo: dto.offerPercentTo } : {}),

          ...(dto.seoTitle !== undefined ? { seoTitle: dto.seoTitle } : {}),
          ...(dto.seoDescription !== undefined ? { seoDescription: dto.seoDescription } : {}),
          ...(dto.seoKeywords !== undefined ? { seoKeywords: dto.seoKeywords } : {}),

          ...(dto.status !== undefined ? { status: toBool(dto.status) } : {}),
        },
        include: { brand: true, category: true, mainCategoryPromotion: true },
      });

      return {
        message: 'Product promotion updated successfully.',
        data: {
          ...updated,
          imageUrl: formatImageUrl(updated.imageUrl),
          priority: toInt(updated.priority),
          status: Boolean(updated.status),
        },
      };
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw new BadRequestException('Invalid foreign key(s). Check mainCategoryPromotionId / categoryId / brandId.');
      }
      throw new BadRequestException(`Failed to update Product Promotion: ${e.message}`);
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);
    const updated = await this.prisma.mainProductPromotion.update({
      where: { id },
      data: { status: false },
    });
    return {
      message: 'Product promotion disabled.',
      data: { ...updated, imageUrl: formatImageUrl(updated.imageUrl) },
    };
  }

  async hardDelete(id: number) {
    await this.ensureExists(id);
    return this.prisma.mainProductPromotion.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.mainProductPromotion.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Promotion not found');
  }

  private async verifyForeignKeys(
    dto: { categoryId?: number; brandId?: number; mainCategoryPromotionId?: number },
    partial = false,
  ) {
    const missing: string[] = [];

    if (!partial || dto.categoryId !== undefined) {
      if (dto.categoryId != null) {
        const hit = await this.prisma.category.findUnique({
          where: { id: Number(dto.categoryId) },
          select: { id: true },
        });
        if (!hit) missing.push('categoryId');
      }
    }

    if (!partial || dto.brandId !== undefined) {
      if (dto.brandId != null) {
        const hit = await this.prisma.brand.findUnique({
          where: { id: Number(dto.brandId) },
          select: { id: true },
        });
        if (!hit) missing.push('brandId');
      }
    }

    if (!partial || dto.mainCategoryPromotionId !== undefined) {
      if (dto.mainCategoryPromotionId != null) {
        const hit = await this.prisma.mainCategoryPromotion.findUnique({
          where: { id: Number(dto.mainCategoryPromotionId) },
          select: { id: true },
        });
        if (!hit) missing.push('mainCategoryPromotionId');
      }
    }

    if (missing.length) {
      throw new BadRequestException(`Invalid foreign keys: ${missing.join(', ')}`);
    }
  }

  // Add at top with your other imports

/**
 * Aggregated list for frontend:
 * - Active Home Category Promotions (priority ASC)
 * - Each with Active Product Promotions (priority ASC)
 * - Optionally include a small product list per promotion
 */
/**
 * Aggregated list for frontend:
 * - Active MainCategoryPromotions (priority ASC)
 * - Each with:
 *    - promotions: Active MainProductPromotions (priority ASC)
 *    - productPromotionList: Products linked to THIS category promotion (via ProductMainCategoryPromotion)
 */
/**
 * Aggregated list for frontend:
 * - Active MainCategoryPromotions (priority ASC)
 * - Each item contains:
 *    - promotions: active MainProductPromotions (priority ASC)
 *    - productPromotionList (peer): products linked to THIS category promotion
 *      with FULL product details (same include as searchProducts)
 */
async getAllPromotionsAggregate(
  opts: { includeProducts?: boolean; productsLimit?: number } = {},
) {
  const includeProducts = opts.includeProducts ?? true;     // default include
  const hardLimit = Math.max(1, Math.min(opts.productsLimit ?? 10, 50));

  const categories = await this.prisma.mainCategoryPromotion.findMany({
    where: { status: true },
    orderBy: { priority: 'asc' },
    select: {
      id: true,
      title: true,
      displayCount: true,
      priority: true,
      imageUrl: true,
      showTitle:true,
      mainProductPromotions: {
        where: { status: true },
        orderBy: { priority: 'asc' },
        select: {
          id: true,
          title: true,
          priority: true,
          imageUrl: true,
          categoryId: true,
          brandId: true,
          seller: true,
          minPrice: true,
          maxPrice: true,
          offerPercentFrom: true,
          offerPercentTo: true,
          seoTitle: true,
          seoDescription: true,
          seoKeywords: true,
        },
      },
    },
  });

  const items = await Promise.all(
    categories.map(async (c) => {
      // Format promo image URLs
      const promotions = c.mainProductPromotions.map((p) => ({
        ...p,
        imageUrl: img(MAIN_PRODUCT_PROMOTION_IMAGE_PATH, p.imageUrl),
      }));

      // CATEGORY-LEVEL product list (peer of promotions) — FULL product details
      let productPromotionList:
        | Array<any>
        | undefined = undefined;

      if (includeProducts) {
        // read links from the join table to be exact
        const links = await this.prisma.productMainCategoryPromotion.findMany({
          where: { mainCategoryPromotionId: c.id },
          orderBy: { createdAt: 'desc' },
          select: { productId: true },
        });

        const productIds = Array.from(new Set(links.map((l) => l.productId)));
        const take =
          c.displayCount && c.displayCount > 0
            ? Math.min(c.displayCount, hardLimit)
            : hardLimit;

        productPromotionList = productIds.length
          ? await this.prisma.product.findMany({
              where: { id: { in: productIds }, status: true },
              orderBy: { createdAt: 'desc' },
              take,
              include: {
                brand: true,
                category: { include: { parent: { include: { parent: true } } } },
                variants: { include: { size: true, color: true } },
                images: true,
                filters: true,
                features: true,
              },
            })
          : [];
      }

      return {
        id: c.id,
        title: c.title,
        displayCount: c.displayCount,
        showTitle: c.showTitle === null ? true : Boolean(c.showTitle),
        priority: c.priority,
        imageUrl: img(MAIN_CATEGORY_PROMOTION_IMAGE_PATH, c.imageUrl),
        promotions,
        productPromotionList, // ← full product rows (same include as searchProducts)
      };
    }),
  );

  return { items };
}



}
