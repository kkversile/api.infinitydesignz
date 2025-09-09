import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildSlugFromId } from '../common/utils/category-slug.util';

/**
 * If you already have a formatImage util + constants, keep using those.
 * This pass-through version is safe; replace with your real implementation.
 */
const formatImage = (fileName: string | null | undefined): string | null =>
  fileName ? fileName : null;

/** Status filter type used in your existing methods */
type StatusFilter = 'all' | 'active' | 'inactive';

/** Convert status filter to Prisma where */
const statusWhere = (status: StatusFilter) => {
  if (status === 'active') return { status: true };
  if (status === 'inactive') return { status: false };
  return {}; // all
};

/**
 * ✅ One async formatter to rule them all.
 * - Normalizes images
 * - Computes slug using shared helper (DB walk)
 * - Works for both parents and children
 */
const formatCategoryResponse = async (c: any, prisma: PrismaService) => {
  const slug = await buildSlugFromId(prisma, c.id);
  return {
    ...c,
    mainImage: formatImage(c.mainImage),
    appIcon: formatImage(c.appIcon),
    webImage: formatImage(c.webImage),
    slug, // ← "/main/sub/list-<id>" with "-id" on the last segment only
  };
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch flat list (your existing style) and attach children in-memory.
   * Every node (parent + child) will get slug via the async formatter.
   */
  async findAll(status: StatusFilter = 'active') {
    const categories = await this.prisma.category.findMany({
      where: statusWhere(status),
      include: {
        featureType: { include: { featureSets: { include: { featureLists: true } } } },
        filterType:  { include: { filterSets:  { include: { filterLists: true } } } },
      },
      orderBy: { id: 'desc' },
    });

    // Format + add children array
    const formatted = await Promise.all(
      categories.map(async (c) => ({
        ...(await formatCategoryResponse(c, this.prisma)),
        children: [] as any[],
      }))
    );

    // Map for quick parent linking
    const byId = new Map<number, any>();
    formatted.forEach((cat) => byId.set(cat.id, cat));

    const result: any[] = [];
    for (const cat of formatted) {
      if (cat.parentId) {
        const parent = byId.get(cat.parentId);
        if (parent) parent.children.push(cat);
      }
      // you previously returned all nodes regardless of level
      result.push(cat);
    }

    return result;
  }

  /**
   * Return one category with all nested children (each child also has its slug).
   */
  async findOne(id: number) {
    const category = await this.getCategoryWithChildrenRecursive(id);
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  /**
   * Need Help Buying: only non-root categories, each with children (and slug).
   */
  async findNeedHelpBuying() {
    const categories = await this.prisma.category.findMany({
      where: { status: true, showInNeedHelpBuying: true, NOT: { parentId: null } },
      orderBy: [{ position: 'asc' }, { title: 'asc' }],
      select: { id: true },
    });

    const result: any[] = [];
    for (const { id } of categories) {
      const fullCategory = await this.getCategoryWithChildrenRecursive(id);
      if (!fullCategory) continue;

      // You previously removed heavy fields; keep that behavior if needed
      if ('featureType' in fullCategory) delete (fullCategory as any).featureType;
      if ('filterType' in fullCategory) delete (fullCategory as any).filterType;

      result.push(fullCategory);
    }
    return result;
  }

  /**
   * Home Tabs: top-level categories (parentId = null), each with children (and slug).
   */
  async findHomeTabs() {
    const categories = await this.prisma.category.findMany({
      where: { status: true, showInHomeTabs: true, parentId: null },
      orderBy: [{ position: 'asc' }, { title: 'asc' }],
      select: { id: true },
    });

    const result: any[] = [];
    for (const { id } of categories) {
      const fullCategory = await this.getCategoryWithChildrenRecursive(id);
      if (!fullCategory) continue;

      // Strip heavy fields if you don’t need them here
      if ('featureType' in fullCategory) delete (fullCategory as any).featureType;
      if ('filterType' in fullCategory) delete (fullCategory as any).filterType;

      result.push(fullCategory);
    }
    return result;
  }

  /**
   * 🔁 Recursive helper – now returns slug for THIS node and ALL children.
   */
  private async getCategoryWithChildrenRecursive(id: number): Promise<any> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        featureType: { include: { featureSets: { include: { featureLists: true } } } },
        filterType:  { include: { filterSets:  { include: { filterLists: true } } } },
      },
    });

    if (!category) return null;

    // format self (adds slug)
    const formattedSelf = await formatCategoryResponse(category, this.prisma);

    // recurse for children (each child formatted with its own slug)
    const children = await Promise.all(
      category.children.map((child) => this.getCategoryWithChildrenRecursive(child.id))
    );

    return { ...formattedSelf, children };
  }
}
