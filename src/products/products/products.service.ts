import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
    ConflictException,          // ← add this

} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateProductsDto, UpdateProductsDto } from "./dto";
import { QueryProductsDto } from './query-products.dto';
import { Prisma } from '@prisma/client';
import {
  // ...your existing imports
  CUTOFF_HOUR_LOCAL, SKIP_WEEKENDS, HOLIDAYS, // optional, if you want
 isHoliday, isWeekend,nextBusinessDay,startCountingFrom, addBusinessDays, fmtShort,
} from '../../config/constants';
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateProductsDto) {
    const {
      sku,
      title,
      description,
      brandId,
      categoryId,
      colorId,
      sizeId,
      stock,
      mrp,
      sellingPrice,
      searchKeywords,
      status = true,
      productDetails,
      variants = [],
    } = dto;

    if (!sku || !String(sku).trim()) {
  throw new BadRequestException("SKU is required.");
}
const existingBySku = await this.prisma.product.findUnique({
  where: { sku: String(sku).trim() },
});
if (existingBySku) {
  throw new BadRequestException(`Product with SKU '${sku}' already exists.`);
}
    // unique SKU check
    if (await this.prisma.product.findUnique({ where: { sku } })) {
      throw new BadRequestException(`Product with SKU '${sku}' already exists.`);
    }

    // validate provided FKs (if present)
    const checks = [
      { id: brandId, label: "Brand", model: this.prisma.brand },
      { id: categoryId, label: "Category", model: this.prisma.category },
      { id: sizeId, label: "Size", model: this.prisma.sizeUOM },
      { id: colorId, label: "Color", model: this.prisma.color },
    ];
    for (const { id, label, model } of checks) {
      if (id && Number(id) > 0) {
        const exists = await (model as any).findUnique({
          where: { id: Number(id) },
        });
        if (!exists) {
          throw new BadRequestException(`${label} with ID '${id}' does not exist.`);
        }
      }
    }

    try {
      // create product
      const created = await this.prisma.product.create({
        data: {
          sku,
          title,
          description,
          searchKeywords,
          status,
          stock,
          mrp,
          sellingPrice,

          ...(brandId && Number(brandId) > 0 && {
            brand: { connect: { id: Number(brandId) } },
          }),
          ...(categoryId && Number(categoryId) > 0 && {
            category: { connect: { id: Number(categoryId) } },
          }),
          ...(sizeId && Number(sizeId) > 0 && {
            size: { connect: { id: Number(sizeId) } },
          }),
          ...(colorId && Number(colorId) > 0 && {
            color: { connect: { id: Number(colorId) } },
          }),

          productDetails: productDetails
            ? {
                create: {
                  model: productDetails.model,
                  weight: productDetails.weight,
                  sla: productDetails.sla,
                  deliveryCharges: productDetails.deliveryCharges,
                },
              }
            : undefined,

          variants: variants.length
            ? {
                create: variants.map((v) => ({
                  sku: v.sku,
                  stock: v.stock,
                  mrp: v.mrp,
                  sellingPrice: v.sellingPrice,
                  ...(v.sizeId && Number(v.sizeId) > 0 && {
                    size: { connect: { id: Number(v.sizeId) } },
                  }),
                  ...(v.colorId && Number(v.colorId) > 0 && {
                    color: { connect: { id: Number(v.colorId) } },
                  }),
                })),
              }
            : undefined,
        },
      });

      // NEW: link MainCategoryPromotions (if provided)
      const { mainCategoryPromotionIds } = dto as any;
      if (Array.isArray(mainCategoryPromotionIds) && mainCategoryPromotionIds.length) {
        await this.prisma.productMainCategoryPromotion.createMany({
          data: mainCategoryPromotionIds.map((mcpId: number) => ({
            productId: created.id,
            mainCategoryPromotionId: Number(mcpId),
          })),
          skipDuplicates: true,
        });
      }

      return { message: "Product created successfully", data: created };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Error creating product");
    }
  }

  // LIST (unfiltered)
  async findAll() {
    const products = await this.prisma.product.findMany({
      orderBy: { id: "desc" },
      include: {
        category: {
          include: {
            parent: { include: { parent: true } },
            featureType: { include: { featureSets: { include: { featureLists: true } } } },
            filterType: { include: { filterSets: { include: { filterLists: true } } } },
          },
        },
        brand: true,
        color: true,
        size: true,
        productDetails: true,
        variants: { include: { size: true, color: true } },
        images: true,
        filters: true,
        features: true,

        // NEW: include linked promotions
        mainCategoryPromotions: {
          include: {
            mainCategoryPromotion: { select: { id: true, title: true } },
          },
        },
      },
    });

    return products.map((product) => {
      const category = product.category;
      const parent = category?.parent;
      const grandparent = parent?.parent;

      const productImages = product.images.filter((img) => img.variantId === null);
      const mainProductImage = productImages.find((img) => img.isMain);
      const additionalProductImages = productImages.filter((img) => !img.isMain);

      const variantImagesMap: Record<number, { main: any | null; additional: any[] }> = {};
      for (const v of product.variants) {
        const imgs = product.images.filter((img) => img.variantId === v.id);
        variantImagesMap[v.id] = {
          main: imgs.find((img) => img.isMain) || null,
          additional: imgs.filter((img) => !img.isMain),
        };
      }

      // NEW: flatten promotions
      const promotions = product.mainCategoryPromotions.map((j) => j.mainCategoryPromotion);
      const promotionIds = promotions.map((p) => p.id);

      return {
        ...product,
        mainCategoryTitle: grandparent?.title || null,
        mainCategoryId: grandparent?.id || null,
        subCategoryTitle: parent?.title || null,
        subCategoryId: parent?.id || null,
        listSubCategoryTitle: category?.title || null,
        listSubCategoryId: category?.id || null,
        images: {
          main: mainProductImage || null,
          additional: additionalProductImages,
          variants: variantImagesMap,
        },
        promotions,    // [{id,title}]
        promotionIds,  // [1,2,3]
      };
    });
  }

  // READ ONE
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            parent: { include: { parent: true } },
            featureType: { include: { featureSets: { include: { featureLists: true } } } },
            filterType: { include: { filterSets: { include: { filterLists: true } } } },
          },
        },
        brand: true,
        color: true,
        size: true,
        productDetails: true,
        variants: { include: { size: true, color: true } },
        images: true,
        filters: true,
        features: true,

        // NEW: include linked promotions
        mainCategoryPromotions: {
          include: {
            mainCategoryPromotion: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!product) throw new NotFoundException(`Product with ID ${id} not found.`);

    const category = product.category;
    const parent = category?.parent;
    const grandparent = parent?.parent;

    const productImages = product.images.filter((img) => img.variantId === null);
    const mainProductImage = productImages.find((img) => img.isMain);
    const additionalProductImages = productImages.filter((img) => !img.isMain);

    const variantImagesMap: Record<number, { main: any | null; additional: any[] }> = {};
    for (const v of product.variants) {
      const imgs = product.images.filter((img) => img.variantId === v.id);
      variantImagesMap[v.id] = {
        main: imgs.find((img) => img.isMain) || null,
        additional: imgs.filter((img) => !img.isMain),
      };
    }

    // NEW: flatten promotions
    const promotions = product.mainCategoryPromotions.map((j) => j.mainCategoryPromotion);
    const promotionIds = promotions.map((p) => p.id);

    return {
      ...product,
      mainCategoryTitle: grandparent?.title || null,
      mainCategoryId: grandparent?.id || null,
      subCategoryTitle: parent?.title || null,
      subCategoryId: parent?.id || null,
      listSubCategoryTitle: category?.title || null,
      listSubCategoryId: category?.id || null,
      images: {
        main: mainProductImage || null,
        additional: additionalProductImages,
        variants: variantImagesMap,
      },
      promotions,
      promotionIds,
    };
  }

  // ID LIST
  async findIdsOnly() {
    return this.prisma.product.findMany({ select: { id: true, title: true } });
  }

  async exists(id: number) {
    const p = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });
    return !!p;
  }

  // UPDATE
  // UPDATE
async update(id: number, dto: UpdateProductsDto) {
  const existing = await this.prisma.product.findUnique({ where: { id } });
  if (!existing) throw new NotFoundException(`Product ${id} not found`);

  const {
    sku,
    title,
    description,
    brandId,
    categoryId,
    colorId,
    sizeId,
    stock,
    mrp,
    sellingPrice,
    searchKeywords,
    status,
    productDetails,
    variants = [],
  } = dto;

  if (sku) {
    const dup = await this.prisma.product.findFirst({
      where: { sku, NOT: { id } },
    });
    if (dup) throw new BadRequestException(`Another product with SKU '${sku}' exists.`);
  }

  // validate provided FKs (if present)
  const checks = [
    { id: brandId, label: "Brand", model: this.prisma.brand },
    { id: categoryId, label: "Category", model: this.prisma.category },
    { id: sizeId, label: "Size", model: this.prisma.sizeUOM },
    { id: colorId, label: "Color", model: this.prisma.color },
  ];
  for (const { id: fkId, label, model } of checks) {
    if (fkId && Number(fkId) > 0) {
      const existsFk = await (model as any).findUnique({
        where: { id: Number(fkId) },
      });
      if (!existsFk) {
        throw new BadRequestException(`${label} with ID '${fkId}' does not exist.`);
      }
    }
  }

  // 1) Update product's own fields (NO nested variants here)
  await this.prisma.product.update({
    where: { id },
    data: {
      sku,
      title,
      description,
      searchKeywords,
      status,
      stock,
      mrp,
      sellingPrice,

      ...(brandId && Number(brandId) > 0 && {
        brand: { connect: { id: Number(brandId) } },
      }),
      ...(categoryId && Number(categoryId) > 0 && {
        category: { connect: { id: Number(categoryId) } },
      }),
      ...(sizeId && Number(sizeId) > 0 && {
        size: { connect: { id: Number(sizeId) } },
      }),
      ...(colorId && Number(colorId) > 0 && {
        color: { connect: { id: Number(colorId) } },
      }),

      productDetails: productDetails
        ? {
            upsert: {
              create: {
                model: productDetails.model,
                weight: productDetails.weight,
                sla: productDetails.sla,
                deliveryCharges: productDetails.deliveryCharges,
              },
              update: {
                model: productDetails.model,
                weight: productDetails.weight,
                sla: productDetails.sla,
                deliveryCharges: productDetails.deliveryCharges,
              },
            },
          }
        : undefined,
    },
  });

  // 2) Promotions (unchanged)
  const { mainCategoryPromotionIds } = dto as any;
  if (Array.isArray(mainCategoryPromotionIds)) {
    await this.prisma.productMainCategoryPromotion.deleteMany({
      where: { productId: id },
    });
    if (mainCategoryPromotionIds.length) {
      await this.prisma.productMainCategoryPromotion.createMany({
        data: mainCategoryPromotionIds.map((mcpId: number) => ({
          productId: id,
          mainCategoryPromotionId: Number(mcpId),
        })),
        skipDuplicates: true,
      });
    }
  }

  // 3) Variants sync (update in place; create new; delete only missing)
  await this.prisma.$transaction(async (tx) => {
    const existingVariants = await tx.variant.findMany({
      where: { productId: id },
      select: { id: true },
    });
    const existingIds = existingVariants.map((v) => v.id);

    const incomingWithId = (variants || []).filter((v: any) => v.id);
    const incomingIds = incomingWithId.map((v: any) => Number(v.id));
    const incomingWithoutId = (variants || []).filter((v: any) => !v.id);
console.log('incomingWithoutId',incomingWithoutId);
console.log('incomingWithId',incomingWithId);
    // A) UPDATE in place for all items that have an id (even if SKU changed)
    for (const v of incomingWithId) {
      await tx.variant.update({
        where: { id: Number(v.id) },
        data: {
          sku: v.sku,
          stock: v.stock,
          mrp: v.mrp,
          sellingPrice: v.sellingPrice,
          ...(v.sizeId && Number(v.sizeId) > 0
            ? { size: { connect: { id: Number(v.sizeId) } } }
            : {}),
          ...(v.colorId && Number(v.colorId) > 0
            ? { color: { connect: { id: Number(v.colorId) } } }
            : {}),
        },
      });
    }

    // B) CREATE any brand-new variants (no id)
    for (const v of incomingWithoutId) {
      await tx.variant.create({
        data: {
          product: { connect: { id } },
          sku: v.sku,
          stock: v.stock,
          mrp: v.mrp,
          sellingPrice: v.sellingPrice,
          ...(v.sizeId && Number(v.sizeId) > 0
            ? { size: { connect: { id: Number(v.sizeId) } } }
            : {}),
          ...(v.colorId && Number(v.colorId) > 0
            ? { color: { connect: { id: Number(v.colorId) } } }
            : {}),
        },
      });
    }

    // C) DELETE only those existing ids that are NOT present in the payload
    const toDelete = existingIds.filter((oldId) => !incomingIds.includes(oldId));
    console.log(toDelete);
    if (toDelete.length) {
      // If you also want to remove their images, do it here before deleteMany.
      // Otherwise, with FK = SET NULL, their images will become variantId = NULL.
      await tx.variant.deleteMany({ where: { id: { in: toDelete } } });
    }
  });

  // 4) Return fresh shape (same as GET)
  const fresh = await this.findOne(id);
  return { message: "Product updated successfully", data: fresh };
}


// === REPLACE ENTIRE METHOD ===============================
async remove(id: number) {
  // Ensure product exists first
  const exists = await this.prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) throw new NotFoundException("Product not found");

  try {
    await this.prisma.$transaction(async (tx) => {
      // 1) Gather variant ids for deep deletes
      const variants = await tx.variant.findMany({
        where: { productId: id },
        select: { id: true },
      });
      const variantIds = variants.map(v => v.id);

      // 2) Deepest children first — things that reference VARIANTS
      if (variantIds.length) {
        await tx.image.deleteMany({ where: { variantId: { in: variantIds } } });
        // (If you ever add variant-level feature/filter tables, delete them here too)
      }

      // 3) Children that reference PRODUCT directly
      await tx.productFeature.deleteMany({ where: { productId: id } });
      await tx.productFilter.deleteMany({ where: { productId: id } });

      // One-to-one details row
      await tx.productDetails.deleteMany({ where: { productId: id } });

      // Images that point directly to the product (non-variant images)
      await tx.image.deleteMany({ where: { productId: id } });

      // Promotion join rows
      await tx.productMainCategoryPromotion.deleteMany({ where: { productId: id } });

      // Session-like references
      await tx.buyNowItem.deleteMany({ where: { productId: id } });

      // Cart & Wishlist
      await tx.cartItem.deleteMany({ where: { productId: id } });
      await tx.wishlist.deleteMany({ where: { productId: id } });

      // 4) Remove variants (their children are gone)
      await tx.variant.deleteMany({ where: { productId: id } });

      // 5) Finally delete the product
      // Note: OrderItem.productId is nullable with onDelete:SetNull in your schema,
      // so historical orders won't block this.
      await tx.product.delete({ where: { id } });
    });

    return { message: "Product and related data deleted successfully" };
  } catch (e: any) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003') {
    // Use Promise.all (not $transaction) to avoid PrismaPromise typing issues
    const [orderItemsCnt, pmcpCnt, buyNowCnt] = await Promise.all([
      this.prisma.orderItem.count({ where: { productId: id } }),
      this.prisma.productMainCategoryPromotion.count({ where: { productId: id } }),
      this.prisma.buyNowItem.count({ where: { productId: id } }),
    ]);

    throw new ConflictException({
      message: `Foreign key constraint blocked deleting Product ${id}.`,
      likelyBlockers: {
        orderItems_should_be_SetNull_already: orderItemsCnt,
        productMainCategoryPromotion_links: pmcpCnt,
        buyNowItems: buyNowCnt,
      },
      nextSteps:
        "Ensure product-linked rows are removed, or set onDelete: Cascade for purely-dependent tables.",
    });
  }
  throw new InternalServerErrorException(e?.message ?? "Delete failed");
}

}
// === END REPLACEMENT =====================================


// ====== FILTERED SEARCH (images shaped like findOne) — with APP-SIDE RELEVANCE ======
async searchProducts(q: QueryProductsDto) {
  // --- helpers (local) ---
  const toCsvArray = (val: any): string[] => {
    if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  };
  const toCsvNumberArray = (val: any): number[] =>
    toCsvArray(val).map((s) => Number(s)).filter((n) => Number.isFinite(n));
  const toInt = (v: any): number | undefined => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const toFloat = (v: any): number | undefined => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const pct = (mrp: number, sp: number): number => {
    if (!Number.isFinite(mrp) || mrp <= 0) return 0;
    const d = Math.max(0, mrp - sp);
    return Math.round((d / mrp) * 100);
  };

  // --- unpack & coerce ---
  const searchStr = typeof q.searchStr === 'string' ? q.searchStr.trim() : undefined;

  const brandId = toInt(q.brandId);
  const mainCategoryId = toInt(q.mainCategoryId);
  const subCategoryId = toInt(q.subCategoryId);
  const listSubCatId = toInt(q.listSubCatId);

  const minPrice = toFloat(q.minPrice);
  const maxPrice = toFloat(q.maxPrice);

  const discMin = toFloat((q as any).discountPctMin);
  const discMax = toFloat((q as any).discountPctMax);
  const hasDiscFilter = discMin !== undefined || discMax !== undefined;

  const page = toInt(q.page) ?? 1;
  const pageSize = toInt(q.pageSize) ?? 20;

  // support 'relevance' and default to relevance when a search is present
  const sort = (q.sort as 'relevance' | 'newest' | 'price_asc' | 'price_desc')
    ?? (searchStr ? 'relevance' : 'newest');

  // CSV params (fallback to legacy JSON "filters" if CSV empty)
  let colorLabels = Array.isArray((q as any).color) ? (q as any).color : toCsvArray((q as any).color);
  let sizeTitles  = Array.isArray((q as any).size)  ? (q as any).size  : toCsvArray((q as any).size);
  let filterListIds = Array.isArray((q as any).filterListIds) ? (q as any).filterListIds : toCsvNumberArray((q as any).filterListIds);

  if (!colorLabels.length && !sizeTitles.length && !filterListIds.length && q.filters) {
    try {
      const parsed = JSON.parse(q.filters);
      colorLabels = Array.isArray(parsed?.color) ? parsed.color : [];
      sizeTitles  = Array.isArray(parsed?.size) ? parsed.size : [];
      filterListIds = Array.isArray(parsed?.filterListIds)
        ? parsed.filterListIds.map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n))
        : [];
    } catch { /* ignore */ }
  }

  // --- where builder ---
  const where: any = { status: true };
  if (brandId !== undefined) where.brandId = brandId;

  if (listSubCatId !== undefined) {
    where.categoryId = listSubCatId;
  } else if (subCategoryId !== undefined) {
    where.category = { is: { parentId: subCategoryId } };
  } else if (mainCategoryId !== undefined) {
    where.category = { is: { parent: { is: { parentId: mainCategoryId } } } };
  }

  if (searchStr) {
    // keep a broad OR to filter the set we score
    where.OR = [
      { title: { contains: searchStr } },
      { description: { contains: searchStr } },
      { sku: { contains: searchStr } },
      { searchKeywords: { contains: searchStr } },
    ];
  }

  // --- PRICE FILTER (product OR any variant must be within band) ---
  let priceRange: any | undefined;
  if (minPrice !== undefined || maxPrice !== undefined) {
    priceRange = {};
    if (minPrice !== undefined) priceRange.gte = minPrice;
    if (maxPrice !== undefined) priceRange.lte = maxPrice;

    (where.AND ??= []).push({
      OR: [
        { sellingPrice: priceRange },
        { variants: { some: { sellingPrice: priceRange } } },
      ],
    });
  }

  // --- COLOR filter: product OR any variant color ---
  if (colorLabels.length > 0) {
    const colorIdsRows = await this.prisma.color.findMany({
      where: { label: { in: colorLabels } },
      select: { id: true },
    });
    const colorIds = colorIdsRows.map((c) => c.id);
    if (colorIds.length > 0) {
      (where.AND ??= []).push({
        OR: [
          { colorId: { in: colorIds } },                         // product-level color
          { variants: { some: { colorId: { in: colorIds } } } }, // any variant color
        ],
      });
    }
  }

  // --- SIZE filter: product OR any variant size ---
  if (sizeTitles.length > 0) {
    const sizeIdsRows = await this.prisma.sizeUOM.findMany({
      where: { title: { in: sizeTitles } },
      select: { id: true },
    });
    const sizeIds = sizeIdsRows.map((s) => s.id);
    if (sizeIds.length > 0) {
      (where.AND ??= []).push({
        OR: [
          { sizeId: { in: sizeIds } },                           // product-level size
          { variants: { some: { sizeId: { in: sizeIds } } } },   // any variant size
        ],
      });
    }
  }

  // ProductFilter ANY semantics
  if (filterListIds.length > 0) {
    where.filters = { some: { filterListId: { in: filterListIds } } };
  }

  // --- sorting (no Prisma _relevance; we will sort in app when needed) ---
  const useClientRelevance = sort === 'relevance' && !!searchStr;

  let orderBy:
    | Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput>
    | undefined;

  if (!useClientRelevance) {
    switch (sort) {
      case 'price_asc':
        orderBy = [{ sellingPrice: 'asc' as const }];
        break;
      case 'price_desc':
        orderBy = [{ sellingPrice: 'desc' as const }];
        break;
      case 'newest':
      default:
        orderBy = [{ createdAt: 'desc' as const }];
    }
  } else {
    // stable default when fetching before we score
    orderBy = [{ createdAt: 'desc' as const }];
  }

  // --- include (variants may also be price filtered) ---
  let variantsInclude: any = { include: { size: true, color: true } };
  if (priceRange) {
    variantsInclude = {
      where: { sellingPrice: priceRange },
      include: { size: true, color: true },
    };
  }

  const commonInclude = {
    brand: true,
    color: true,
    size: true,
    category: { include: { parent: { include: { parent: true } } } },
    variants: variantsInclude,
    images: true,
    filters: true,
    features: true,
  } as const;

  // --- fetch (note: for relevance we fetch a larger pool, then paginate after scoring)
  const MAX_RELEVANCE_POOL = 1000; // guard-rail for big categories
  let candidates: any[];

  if (hasDiscFilter || useClientRelevance) {
    candidates = await this.prisma.product.findMany({
      where,
      include: commonInclude,
      orderBy,                 // just for stability; real ordering happens below when relevance
      take: useClientRelevance ? MAX_RELEVANCE_POOL : undefined,
    });
  } else {
    candidates = await this.prisma.product.findMany({
      where,
      include: commonInclude,
      orderBy,
      skip: (Math.max(page, 1) - 1) * Math.min(Math.max(pageSize, 1), 100),
      take: Math.min(Math.max(pageSize, 1), 100),
    });
  }

  const totalBase = await this.prisma.product.count({ where });

  // --- bounds for price band (for displayPrice only)
  const bandMin = minPrice ?? -Infinity;
  const bandMax = maxPrice ?? Infinity;

  // discount % predicate (inclusive)
  const inDiscBand = (mrp: number, sp: number) => {
    const p = pct(mrp, sp);
    if (discMin !== undefined && p < discMin) return false;
    if (discMax !== undefined && p > discMax) return false;
    return true;
  };

  // --- filter by discount% if requested (product OR any variant)
  let filtered = candidates;
  if (hasDiscFilter) {
    filtered = candidates.filter((p: any) => {
      if (inDiscBand(p.mrp, p.sellingPrice)) return true;
      for (const v of p.variants as any[]) {
        if (inDiscBand(v.mrp, v.sellingPrice)) return true;
      }
      return false;
    });
  }

  // --- reshape, attach discount % to variants and choose a badge % per product
  const reshaped = filtered.map((p: any) => {
    const category = p.category;
    const parent = category?.parent;
    const grandparent = parent?.parent;

    // post-filter variants by discount% too when band applied
    const variantsInitial: any[] = hasDiscFilter
      ? (p.variants as any[]).filter((v) => inDiscBand(v.mrp, v.sellingPrice))
      : (p.variants as any[]);

    // augment each variant with discountPercent
    const variantsFinal = variantsInitial.map((v) => ({
      ...v,
      discountPercent: pct(v.mrp, v.sellingPrice),
    }));

    // compute product/variant discount percents
    const productDiscountPercent = pct(p.mrp, p.sellingPrice);
    const maxVariantDiscountPercent = variantsFinal.length
      ? Math.max(...variantsFinal.map((v) => v.discountPercent))
      : 0;

    // choose badge = max(product vs variants)
    const badgeDiscountPercent = Math.max(productDiscountPercent, maxVariantDiscountPercent);

    // images split
    const productImages = p.images.filter((img: any) => img.variantId === null);
    const mainProductImage = productImages.find((img: any) => img.isMain) || null;
    const additionalProductImages = productImages.filter((img: any) => !img.isMain);

    const variantImagesMap: Record<number, { main: any | null; additional: any[] }> = {};
    for (const v of variantsFinal) {
      const imgs = p.images.filter((img: any) => img.variantId === v.id);
      variantImagesMap[v.id] = {
        main: imgs.find((img: any) => img.isMain) || null,
        additional: imgs.filter((img: any) => !img.isMain),
      };
    }

    // displayPrice using in-band price values
    const productInBand =
      p.sellingPrice >= bandMin && p.sellingPrice <= bandMax ? p.sellingPrice : Infinity;
    const minVariant =
      variantsFinal.length ? Math.min(...variantsFinal.map((v: any) => v.sellingPrice)) : Infinity;
    const displayPrice = Math.min(productInBand, minVariant);
    const safeDisplayPrice = Number.isFinite(displayPrice) ? displayPrice : undefined;

    return {
      ...p,
      variants: variantsFinal,
      mainCategoryTitle: grandparent?.title || null,
      mainCategoryId: grandparent?.id || null,
      subCategoryTitle: parent?.title || null,
      subCategoryId: parent?.id || null,
      listSubCategoryTitle: category?.title || null,
      listSubCategoryId: category?.id || null,
      images: {
        main: mainProductImage,
        additional: additionalProductImages,
        variants: variantImagesMap,
      },
      displayPrice: safeDisplayPrice,

      // 🔻 NEW fields for UI
      productDiscountPercent,
      maxVariantDiscountPercent,
      badgeDiscountPercent, // ← use this for the red badge
    };
  });

  // --- app-side relevance scoring (only when requested) ---
  if (useClientRelevance && searchStr) {
    const ql = searchStr.toLowerCase();
    const score = (p: any) => {
      let s = 0;
      const title = (p.title ?? '').toLowerCase();
      const desc  = (p.description ?? '').toLowerCase();
      const sku   = (p.sku ?? '').toLowerCase();
      const keys  = (p.searchKeywords ?? '').toLowerCase();

      if (title === ql) s += 1000;        // exact title match
      if (title.startsWith(ql)) s += 300; // prefix boost
      if (title.includes(ql)) s += 200;
      if (keys.includes(ql))  s += 120;
      if (desc.includes(ql))  s += 80;
      if (sku.includes(ql))   s += 60;

      // tiny boost for variant SKU hits
      for (const v of p.variants ?? []) {
        const vsku = (v.sku ?? '').toLowerCase();
        if (vsku.includes(ql)) { s += 30; break; }
      }
      return s;
    };
    reshaped.sort((a, b) => score(b) - score(a));
  }

  // --- paginate after discount filter or relevance sorting
  const take = Math.min(Math.max(pageSize, 1), 100);
  const skip = (Math.max(page, 1) - 1) * take;

  const finalItems = (hasDiscFilter || useClientRelevance)
    ? reshaped.slice(skip, skip + take)
    : reshaped;

  const totalAfter = (hasDiscFilter || useClientRelevance) ? reshaped.length : totalBase;

  return {
    meta: {
      page,
      pageSize: take,
      total: totalAfter,
      totalPages: Math.ceil(totalAfter / take),
      sort,
      discountPctMin: discMin ?? null,
      discountPctMax: discMax ?? null,
    },
    items: finalItems,
  };
}






  // ====== LEGACY FILTER (kept for backward compatibility) ======
  // NOTE: Now also filters filterListIds in DB; removed post-fetch filtering.
  async getProducts(query: {
    mainCategoryId: number;
    subCategoryId: number;
    listSubCatId?: number;
    brandId?: number;
    searchStr?: string;
    filters?: string; // stringified: { color: ['Red'], size: ['M'], filterListIds: [1,2] }
  }) {
    const {
      mainCategoryId,
      subCategoryId,
      listSubCatId,
      brandId,
      searchStr,
      filters,
    } = query;

    const where: any = { AND: [{ status: true }] };

    // category hierarchy
    if (listSubCatId) {
      where.AND.push({ categoryId: listSubCatId });
    } else if (subCategoryId) {
      const subList = await this.prisma.category.findMany({
        where: { parentId: subCategoryId },
        select: { id: true },
      });
      const listIds = subList.map((c) => c.id);
      if (listIds.length > 0) where.AND.push({ categoryId: { in: listIds } });
    } else if (mainCategoryId) {
      const subCats = await this.prisma.category.findMany({
        where: { parentId: mainCategoryId },
        select: { id: true },
      });
      const subCatIds = subCats.map((sc) => sc.id);
      if (subCatIds.length > 0) {
        const subSubCats = await this.prisma.category.findMany({
          where: { parentId: { in: subCatIds } },
          select: { id: true },
        });
        const allIds = subSubCats.map((c) => c.id);
        if (allIds.length > 0) where.AND.push({ categoryId: { in: allIds } });
      }
    }

    if (brandId) where.AND.push({ brandId });

    if (searchStr && searchStr.trim()) {
      where.AND.push({
        OR: [
          { title: { contains: searchStr, mode: "insensitive" } },
          { description: { contains: searchStr, mode: "insensitive" } },
          { sku: { contains: searchStr, mode: "insensitive" } },
        ],
      });
    }

    const parsed = filters ? JSON.parse(filters) : {};
    const { color = [], size = [], filterListIds = [] } = parsed;

    if (color.length > 0) {
      const colorIds = await this.prisma.color.findMany({
        where: { label: { in: color } },
        select: { id: true },
      });
      const ids = colorIds.map((c) => c.id);
      if (ids.length > 0) where.AND.push({ colorId: { in: ids } });
    }

    if (size.length > 0) {
      const sizeIds = await this.prisma.sizeUOM.findMany({
        where: { title: { in: size } },
        select: { id: true },
      });
      const ids = sizeIds.map((s) => s.id);
      if (ids.length > 0) where.AND.push({ sizeId: { in: ids } });
    }

    // DB-side filter for filterListIds (ANY match)
    if (Array.isArray(filterListIds) && filterListIds.length > 0) {
      where.AND.push({ filters: { some: { filterListId: { in: filterListIds } } } });
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        brand: true,
        size: true,
        color: true,
        category: true,
        productDetails: true,
        variants: { include: { size: true, color: true } },
        images: true,
        filters: true,
      },
    });

    return products;
  }

  // PRODUCT DETAILS + RELATED
// PRODUCT DETAILS with normalized images but still keeping selectedVariant + variantImages
async getProductDetails(productId: number, variantId?: number) {
  const pct = (mrp: number, sp: number): number => {
    if (!Number.isFinite(mrp) || mrp <= 0) return 0;
    const d = Math.max(0, mrp - sp);
    return Math.round((d / mrp) * 100);
  };

  const product = await this.prisma.product.findUnique({
    where: { id: productId },
    include: {
      brand: true,
      size: true,
      color: true,
      productDetails: true,
      variants: { include: { size: true, color: true } },
      images: true,
      category: true,
      // bring enough info to group like the screenshot
      features: {
        include: {
          featureList: {
            select: {
              id: true,
              label: true, // e.g. "Model Name"
              featureSet: {
                select: {
                  id: true,
                  title: true, // e.g. "GENERAL", "BODY FEATURES"
                },
              },
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundException(`Product with ID ${productId} not found`);
  }

  // sibling category ids
  const siblingCategories = await this.prisma.category.findMany({
    where: { parentId: product.category.parentId, id: { not: product.categoryId } },
    select: { id: true },
  });
  const siblingCategoryIds = siblingCategories.map((c) => c.id);

  // related products (add tiny variants select to compute badge)
  const relatedProductsRaw = await this.prisma.product.findMany({
    where: {
      status: true,
      id: { not: productId },
      OR: [{ categoryId: product.categoryId }, { categoryId: { in: siblingCategoryIds } }],
    },
    take: 10,
    include: {
      brand: true,
      images: { where: { isMain: true, variantId: null }, take: 1 },
      category: true,
      variants: { select: { id: true, mrp: true, sellingPrice: true } }, // for badge %
    },
  });

  // product-level images
  const productImages = product.images.filter((img) => img.variantId === null);
  const mainProductImage = productImages.find((img) => img.isMain) || null;
  const additionalProductImages = productImages.filter((img) => !img.isMain);

  // variant-level images
  const variantImagesMap: Record<number, { main: any | null; additional: any[] }> = {};
  for (const v of product.variants) {
    const imgs = product.images.filter((img) => img.variantId === v.id);
    variantImagesMap[v.id] = {
      main: imgs.find((img) => img.isMain) || null,
      additional: imgs.filter((img) => !img.isMain),
    };
  }

  // add discount% to variants
  const variantsWithDiscount = product.variants.map((v: any) => ({
    ...v,
    discountPercent: pct(v.mrp, v.sellingPrice),
  }));

  // product-level discount summary
  const productDiscountPercent = pct(product.mrp, product.sellingPrice);
  const maxVariantDiscountPercent = variantsWithDiscount.length
    ? Math.max(...variantsWithDiscount.map((v: any) => v.discountPercent))
    : 0;
  const badgeDiscountPercent = Math.max(productDiscountPercent, maxVariantDiscountPercent);

  // selected variant support (keep structure; just add discount%)
  let selectedVariant: any = null;
  let variantImages: any[] = [];
  if (variantId) {
    selectedVariant = variantsWithDiscount.find((v: any) => v.id === variantId);
    if (!selectedVariant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found for this product`);
    }
    variantImages = product.images.filter((img) => img.variantId === variantId);
  }

  // shape relatedProducts with badgeDiscountPercent (product vs its variants)
  const relatedProducts = relatedProductsRaw.map((rp: any) => {
    const rpProductPct = pct(rp.mrp, rp.sellingPrice);
    const rpVarMaxPct = rp.variants?.length
      ? Math.max(...rp.variants.map((vv: any) => pct(vv.mrp, vv.sellingPrice)))
      : 0;
    const rpBadge = Math.max(rpProductPct, rpVarMaxPct);
    return { ...rp, badgeDiscountPercent: rpBadge };
  });

  // ===== Group features by FeatureSet (section -> rows) =====
  // featureSets: [{ setId, setTitle, rows: [{ listId, label, value }] }]
  const setsMap = new Map<
    number,
    { setId: number; setTitle: string; rows: { listId: number; label: string; value: string | null }[] }
  >();

  for (const pf of product.features ?? []) {
    const fl: any = (pf as any).featureList;           // { id, label, featureSet }
    const fs: any = fl?.featureSet;                    // { id, title }
    if (!fs) continue;

    if (!setsMap.has(fs.id)) {
      setsMap.set(fs.id, { setId: fs.id, setTitle: fs.title, rows: [] });
    }
    setsMap.get(fs.id)!.rows.push({
      listId: fl.id,
      label: fl.label,
      value: (pf as any).value ?? null,
    });
  }

  const featureSets = Array.from(setsMap.values())
    .map((s) => ({
      ...s,
      rows: s.rows.sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => a.setTitle.localeCompare(b.setTitle));
// --- ETA & delivery charge (from ProductDetails) ---
const now = new Date();
const slaDays = typeof product.productDetails?.sla === 'number'
  ? product.productDetails!.sla
  : null;

let estimatedDeliveryDate: string | null = null;
let estimatedDeliveryText: string | null = null;

if (slaDays !== null && slaDays >= 0) {
  const start = startCountingFrom(now);
  const eta = addBusinessDays(start, slaDays);
  estimatedDeliveryDate = eta.toISOString();               // machine-friendly
  estimatedDeliveryText = `${fmtShort(eta)}`;  // UI-ready
}

const deliveryCharge = product.productDetails?.deliveryCharges ?? null;
  return {
    ...product,
    // override variants with discount-augmented versions
    variants: variantsWithDiscount,

    // images in your preferred structure
    images: {
      main: mainProductImage,
      additional: additionalProductImages,
      variants: variantImagesMap, // e.g. { "226": { main, additional }, ... }
    },

    // discount fields at product level
    productDiscountPercent,
    maxVariantDiscountPercent,
    badgeDiscountPercent,

    // preserve selectedVariant + add images
    selectedVariant: selectedVariant || null,
    variantImages,

    // related with discount badge
    relatedProducts,

    // 👇 grouped sections for UI (like the screenshot)
    featureSets,
      estimatedDeliveryDate,
  estimatedDeliveryText,
  deliveryCharge,
  };
}



}
