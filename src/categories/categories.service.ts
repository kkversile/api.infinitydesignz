// src/categories/categories.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService }              from '../prisma/prisma.service';
import { CATEGORY_IMAGE_PATH }        from '../config/constants';

const formatImage = (fn: string|null) => fn ? `${CATEGORY_IMAGE_PATH}${fn}` : null;
const formatCategoryResponse = (c: any) => ({
  ...c,
  mainImage: formatImage(c.mainImage),
  appIcon:   formatImage(c.appIcon),
  webImage:  formatImage(c.webImage),
});

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /** Create a leaf category with direct FeatureType/FilterType FKs */
  async create(data: any, files: any = {}) {
    const parentId = data.parentId != null ? Number(data.parentId) : null;
    const status   = data.status === 'true' || data.status === true;

    // 1) prevent duplicate title under same parent
    if (await this.prisma.category.findFirst({ where: { title: data.title, parentId } })) {
      throw new BadRequestException(
        'Category with same title already exists under selected parent.'
      );
    }

    // 2) parse single IDs
    const featureTypeId = data.featureTypeId != null ? Number(data.featureTypeId) : null;
    const filterTypeId  = data.filterTypeId  != null ? Number(data.filterTypeId)  : null;

    // 3) create record, connecting FKs
    const category = await this.prisma.category.create({
      data: {
        title: data.title,
        status,
        ...(parentId    != null && { parent:     { connect: { id: parentId    } } }),
        ...(featureTypeId != null && { featureType: { connect: { id: featureTypeId } } }),
        ...(filterTypeId  != null && { filterType:  { connect: { id: filterTypeId  } } }),
        mainImage: files.mainImage?.[0]?.filename || null,
        appIcon:   files.appIcon?.[0]?.filename   || null,
        webImage:  files.webImage?.[0]?.filename  || null,
      },
    });

    return formatCategoryResponse(category);
  }

  /** List all categories with nested FeatureType→Sets→Lists and FilterType→Sets→Lists */
  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'desc' },
      include: {
        featureType: { include: { featureSets: { include: { featureLists: true } } } },
        filterType:  { include: { filterSets:  { include: { filterLists:  true } } } },
      },
    });

    const ids      = categories.map(c => c.id);
    const children = await this.prisma.category.findMany({ where: { parentId: { in: ids } } });
    const map      = new Map<number, any[]>();
    for (const ch of children) {
      (map.get(ch.parentId) ?? map.set(ch.parentId, []).get(ch.parentId)).push(ch);
    }

    return categories.map(c => ({
      ...formatCategoryResponse(c),
      children: (map.get(c.id) || []).map(ch => ({ id: ch.id, title: ch.title, children: [] })),
    }));
  }

  /** Fetch one category (with its tree) plus its FeatureType & FilterType hierarchy */
  async findOne(id: number) {
    const cat = await this.prisma.category.findUnique({
      where: { id },
      include: {
        featureType: { include: { featureSets: { include: { featureLists: true } } } },
        filterType:  { include: { filterSets:  { include: { filterLists:  true } } } },
        children: true,
      },
    });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);

    return {
      ...formatCategoryResponse(cat),
      children: cat.children.map(ch => ({ id: ch.id, title: ch.title, children: [] }))
    };
  }

  /** Update direct FKs via connect/disconnect on one FeatureType & one FilterType */
  async update(id: number, data: any, files: any = {}) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Category ${id} not found`);

    // duplicate‐title check
    if (data.title) {
      const dup = await this.prisma.category.findFirst({
        where: {
          title: data.title.trim(),
          parentId: data.parentId != null ? Number(data.parentId) : undefined,
          NOT: { id }
        }
      });
      if (dup) throw new BadRequestException(
        'Category with same title already exists under selected parent.'
      );
    }

    const payload: any = {
      ...(data.title       && { title: data.title.trim() }),
      ...(data.status      && { status: data.status === 'true' || data.status === true }),
      ...(data.parentId    !== undefined && {
        parent: data.parentId === null
          ? { disconnect: true }
          : { connect:    { id: Number(data.parentId) } }
      }),
      ...(data.featureTypeId !== undefined && {
        featureType: { connect: { id: Number(data.featureTypeId) } }
      }),
      ...(data.filterTypeId !== undefined && {
        filterType: { connect: { id: Number(data.filterTypeId) } }
      }),
      ...(files.mainImage?.[0] && { mainImage: files.mainImage[0].filename }),
      ...(files.appIcon?.[0]   && { appIcon:   files.appIcon[0].filename   }),
      ...(files.webImage?.[0]  && { webImage:  files.webImage[0].filename  }),
    };

    const updated = await this.prisma.category.update({
      where: { id },
      data: payload,
    });

    return formatCategoryResponse(updated);
  }

  async updateStatusBulk(ids: number[], status: boolean) {
    if (!Array.isArray(ids) || !ids.length) {
      throw new BadRequestException('IDs must be a non-empty array.');
    }
    const res = await this.prisma.category.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    return {
      message:      `Updated ${res.count} categories' status to ${status}`,
      updatedCount: res.count,
    };
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
