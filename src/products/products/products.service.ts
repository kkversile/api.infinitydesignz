import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateProductsDto, UpdateProductsDto } from "./dto";
import { QueryProductsDto } from './query-products.dto';

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
        const exists = await (model as any).findUnique({
          where: { id: Number(fkId) },
        });
        if (!exists) {
          throw new BadRequestException(`${label} with ID '${fkId}' does not exist.`);
        }
      }
    }

    const updated = await this.prisma.product.update({
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

        variants: variants.length
          ? {
              deleteMany: {}, // replace variants
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

    // NEW: replace promotion links if provided
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

    return { message: "Product updated successfully", data: updated };
  }

  // DELETE
  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
        features: true,
        filters: true,
        productDetails: true,
      },
    });
    if (!product) throw new NotFoundException("Product not found");

    const deleteOps = [];

    // NEW: unlink promotions for this product
    deleteOps.push(
      this.prisma.productMainCategoryPromotion.deleteMany({ where: { productId: id } })
    );

    const variantImageIds = await this.prisma.image.findMany({
      where: { variantId: { in: product.variants.map((v) => v.id) } },
      select: { id: true },
    });

    deleteOps.push(
      this.prisma.image.deleteMany({
        where: { id: { in: variantImageIds.map((i) => i.id) } },
      }),
    );

    deleteOps.push(this.prisma.image.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.productFeature.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.productFilter.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.variant.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.productDetails.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.cartItem.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.wishlist.deleteMany({ where: { productId: id } }));

    deleteOps.push(this.prisma.product.delete({ where: { id } }));

    await this.prisma.$transaction(deleteOps);

    return { message: "Product and related data deleted successfully" };
  }

  // ====== FILTERED SEARCH (robust coercion + CSV support) ======
 // ====== FILTERED SEARCH (images shaped like findOne) ======
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
  const sort = (q.sort as 'newest' | 'price_asc' | 'price_desc') ?? 'newest';

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
    } catch {/* ignore */}
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

  // map color labels -> ids
  if (colorLabels.length > 0) {
    const colorIds = await this.prisma.color.findMany({
      where: { label: { in: colorLabels } },
      select: { id: true },
    });
    const ids = colorIds.map((c) => c.id);
    if (ids.length > 0) (where.AND ??= []).push({ colorId: { in: ids } });
  }

  // map size titles -> ids
  if (sizeTitles.length > 0) {
    const sizeIds = await this.prisma.sizeUOM.findMany({
      where: { title: { in: sizeTitles } },
      select: { id: true },
    });
    const ids = sizeIds.map((s) => s.id);
    if (ids.length > 0) (where.AND ??= []).push({ sizeId: { in: ids } });
  }

  // ProductFilter ANY semantics
  if (filterListIds.length > 0) {
    where.filters = { some: { filterListId: { in: filterListIds } } };
  }

  // --- sorting ---
  let orderBy: any;
  switch (sort) {
    case 'price_asc': orderBy = { sellingPrice: 'asc' }; break;
    case 'price_desc': orderBy = { sellingPrice: 'desc' }; break;
    case 'newest':
    default: orderBy = { createdAt: 'desc' };
  }

  // --- include (variants may also be price filtered) ---
  let variantsInclude: any = { include: { size: true, color: true } };
  if (priceRange) {
    variantsInclude = {
      where: { sellingPrice: priceRange },
      include: { size: true, color: true },
    };
  }

  const baseFindArgs = {
    where,
    include: {
      brand: true,
      category: { include: { parent: { include: { parent: true } } } },
      variants: variantsInclude,
      images: true,
      filters: true,
      features: true,
    },
    orderBy,
  } as const;

  const candidates = hasDiscFilter
    ? await this.prisma.product.findMany(baseFindArgs)
    : await this.prisma.product.findMany({
        ...baseFindArgs,
        skip: (Math.max(page, 1) - 1) * Math.min(Math.max(pageSize, 1), 100),
        take: Math.min(Math.max(pageSize, 1), 100),
      });

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

  // --- paginate after discount filter (if used)
  const take = Math.min(Math.max(pageSize, 1), 100);
  const skip = (Math.max(page, 1) - 1) * take;

  const finalItems = hasDiscFilter ? reshaped.slice(skip, skip + take) : reshaped;
  const totalAfter = hasDiscFilter ? reshaped.length : totalBase;

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
    return {
      ...rp,
      badgeDiscountPercent: rpBadge,
    };
  });

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

    // ✅ NEW discount fields at product level
    productDiscountPercent,
    maxVariantDiscountPercent,
    badgeDiscountPercent,

    // preserve selectedVariant + add images
    selectedVariant: selectedVariant || null,
    variantImages,

    // related with discount badge
    relatedProducts,
  };
}


}
