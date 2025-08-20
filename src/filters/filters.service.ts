import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetFacetsDto } from './dto/get-facets.dto';
import { DISCOUNT_RANGES, MATERIALS } from './constants/facets.constants';

type FacetList = { id: number; label: string; priority: number; count: number };
type FacetSet  = { id: number; title: string; priority: number; lists: FacetList[] };
type FacetType = { id: number; name: string; sets: FacetSet[] };

@Injectable()
export class FiltersService {
  constructor(private readonly prisma: PrismaService) {}

  async getFacets(dto: GetFacetsDto) {
    // ---- Coerce query params to numbers (in case ValidationPipe.transform isn't global)
    const categoryId = dto.categoryId != null ? Number(dto.categoryId) : undefined;
    const brandId    = dto.brandId    != null ? Number(dto.brandId)    : undefined;
    const minPrice   = dto.minPrice   != null ? Number(dto.minPrice)   : undefined;
    const maxPrice   = dto.maxPrice   != null ? Number(dto.maxPrice)   : undefined;

    // ----- 0) Show-empty default behavior -----
    // No categoryId  => showEmpty = true (full taxonomy even if zero)
    // With category  => showEmpty = false (hide groups with no products)
    const computedShowEmptyDefault = categoryId ? false : true;

    // ----- 1) Build scoped product filter (all parts optional) -----
    const productWhere: Prisma.ProductWhereInput = { status: true };

    if (categoryId) productWhere.categoryId = categoryId;
    if (brandId)    productWhere.brandId    = brandId;

    if (dto.q && dto.q.trim().length > 0) {
      // Rely on DB collation for case-insensitive matching (no `mode` in your client)
      productWhere.OR = [
        { title: { contains: dto.q } },
        { description: { contains: dto.q } },
        { sku: { contains: dto.q } },
      ];
    }

    if (minPrice != null || maxPrice != null) {
      const priceCond: Prisma.FloatFilter = {};
      if (minPrice != null) priceCond.gte = minPrice;
      if (maxPrice != null) priceCond.lte = maxPrice;

      productWhere.variants = { some: { sellingPrice: priceCond } };
    }

    // ----- 2) Load Types -> Sets -> Lists -----
    // Your schema: FilterType has `Category Category[]`
    // When categoryId is provided, restrict to the FilterType linked to that Category.
    const typeWhereMapped: Prisma.FilterTypeWhereInput | undefined =
      categoryId ? { Category: { some: { id: categoryId } } } : undefined;

    const typesRaw = await this.prisma.filterType.findMany({
      where: typeWhereMapped, // undefined => no restriction (all types)
      orderBy: { name: 'asc' },
      include: {
        filterSets: {
          where: { status: true },
          orderBy: { priority: 'asc' },
          include: {
            filterLists: {
              where: { status: true },
              orderBy: { priority: 'asc' },
              select: { id: true, label: true, priority: true },
            },
          },
        },
      },
    });

    const listIds = Array.from(
      new Set(typesRaw.flatMap(t => t.filterSets.flatMap(s => s.filterLists.map(l => l.id))))
    );

    // ----- 3) Count products per FilterList within the current scope -----
    const countMap = new Map<number, number>();
    if (listIds.length > 0) {
      const grouped = await this.prisma.productFilter.groupBy({
        by: ['filterListId'],
        where: {
          filterListId: { in: listIds },
          product: productWhere, // relies on ProductFilter.product relation
        },
        _count: { _all: true },
      });
      for (const g of grouped) countMap.set(g.filterListId, g._count._all);
    }

    // ----- 4) Compose sidebar; hide/show empties -----
    const hideEmpty = !(dto.showEmpty ?? computedShowEmptyDefault);

    const sidebar: FacetType[] = typesRaw
      .map(t => {
        const sets: FacetSet[] = t.filterSets
          .map(s => {
            const lists: FacetList[] = s.filterLists
              .map(l => ({
                id: l.id,
                label: l.label,
                priority: l.priority ?? 0,
                count: countMap.get(l.id) ?? 0,
              }))
              .filter(x => (hideEmpty ? x.count > 0 : true));
            return { id: s.id, title: s.title, priority: s.priority ?? 0, lists };
          })
          .filter(set => (hideEmpty ? set.lists.length > 0 : true));
        return { id: t.id, name: t.name, sets };
      })
      .filter(ft => (hideEmpty ? ft.sets.length > 0 : true));

    // ----- 5) Flatten for “All Filters” modal -----
    const allFilters: FacetSet[] = sidebar.flatMap(t => t.sets);

    // ----- 6) Colors + Price range (scoped) -----
    const colors = await this.prisma.color.findMany({
      where: { status: true },
      orderBy: [{ label: 'asc' }],
      select: { id: true, label: true, hex_code: true },
    });

    const priceAgg = await this.prisma.variant.aggregate({
      _min: { sellingPrice: true },
      _max: { sellingPrice: true },
      where: { product: productWhere }, // min/max for the scoped set
    });

    // ----- 7) Hardcoded Discount Range & Material from constants -----
    // (Returned at top-level so the UI can render them like Colors/Price)
    const discountRanges = DISCOUNT_RANGES;
    const materials      = MATERIALS;

    return {
      sidebar,          // FilterType -> FilterSet -> FilterList (with counts)
      allFilters,       // flattened sets for the “All Filters” modal
      colors,
      price: {
        min: priceAgg._min.sellingPrice ?? 0,
        max: priceAgg._max.sellingPrice ?? 0,
      },
      discountRanges,   // <-- hardcoded from constants
      materials,        // <-- hardcoded from constants
    };
  }
}
