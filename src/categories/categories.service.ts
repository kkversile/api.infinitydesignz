import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CATEGORY_IMAGE_PATH } from '../config/constants';

const formatImage = (filename: string | null) =>
  filename ? `${CATEGORY_IMAGE_PATH}${filename}` : null;

const formatCategoryResponse = (category: any) => ({
  ...category,
  mainImage: formatImage(category.mainImage),
  appIcon: formatImage(category.appIcon),
  webImage: formatImage(category.webImage),
});

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, files: any = {}) {
    const parentId = data.parent_id ? Number(data.parent_id) : null;
    const status = Boolean(data.status);

    const existing = await this.prisma.category.findFirst({
      where: {
        title: data.title,
        parent_id: parentId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Category with same title already exists under selected parent.',
      );
    }

    const featureTypeIds: number[] = Array.isArray(data.featureTypeIds)
      ? data.featureTypeIds.map((id: any) => Number(id))
      : [];

    const category = await this.prisma.category.create({
      data: {
        title: data.title,
        status,
        parent_id: parentId,
        mainImage: files.mainImage?.[0]?.filename || null,
        appIcon: files.appIcon?.[0]?.filename || null,
        webImage: files.webImage?.[0]?.filename || null,
      },
    });

    if (featureTypeIds.length > 0) {
      await this.prisma.categoryFeature.createMany({
        data: featureTypeIds.map((fid) => ({
          categoryId: category.id,
          featureId: fid,
        })),
        skipDuplicates: true,
      });
    }

    return formatCategoryResponse(category);
  }

  async findAll() {
    const allCategories = await this.prisma.category.findMany({
      include: {
        categoryFeatures: {
          include: { feature: true },
        },
      },
    });

    const categoryMap = new Map<number, any>();

    for (const category of allCategories) {
      categoryMap.set(category.id, {
        ...category,
        featureTypes: category.categoryFeatures.map((cf) => cf.feature),
        children: [],
      });
    }

    for (const category of allCategories) {
      if (category.parent_id !== null && categoryMap.has(category.parent_id)) {
        const parent = categoryMap.get(category.parent_id);
        parent.children.push({
          id: category.id,
          title: category.title,
          children: [],
        });
      }
    }

    const populateChildren = (node: any) => {
      node.children = node.children.map((child: any) => {
        const fullChild = categoryMap.get(child.id);
        return {
          id: fullChild.id,
          title: fullChild.title,
          children: populateChildren(fullChild).children,
        };
      });
      return node;
    };

    const result = [];
    for (const [id, cat] of categoryMap.entries()) {
      if (cat.parent_id === null) {
        const populated = populateChildren(cat);
        result.push(formatCategoryResponse(populated));
      }
    }

    return result;
  }

  async findOne(id: number) {
    const fetchCategoryWithChildren = async (
      categoryId: number,
      includeFeatures = false,
      parentTrail: { id: number; title: string }[] = []
    ): Promise<any> => {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: includeFeatures
          ? {
              categoryFeatures: {
                include: { feature: true },
              },
            }
          : undefined,
      });

      if (!category) return null;

      const breadcrumb = [
        ...parentTrail,
        { id: category.id, title: category.title },
      ];

      const children = await this.prisma.category.findMany({
        where: { parent_id: categoryId },
      });

      const nestedChildren = await Promise.all(
        children.map((child) =>
          fetchCategoryWithChildren(child.id, false, breadcrumb)
        )
      );

      return {
        id: category.id,
        title: category.title,
        mainImage: formatImage(category.mainImage),
        appIcon: formatImage(category.appIcon),
        webImage: formatImage(category.webImage),
        ...(includeFeatures && {
          featureTypes: category.categoryFeatures.map((cf) => cf.feature),
        }),
        breadcrumb,
        children: nestedChildren,
      };
    };

    return await fetchCategoryWithChildren(id, true, []);
  }

  async update(id: number, data: any, files: any) {
    const parentId =
      data.parent_id !== undefined && data.parent_id !== null
        ? Number(data.parent_id)
        : null;
    const status = Boolean(data.status);

    const existing = await this.prisma.category.findFirst({
      where: {
        title: data.title,
        parent_id: parentId,
        NOT: { id },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Category with same title already exists under selected parent.',
      );
    }

    const featureTypeIds: number[] = Array.isArray(data.featureTypeIds)
      ? data.featureTypeIds.map((id: any) => Number(id))
      : [];

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        status,
        parent_id: parentId,
        ...(files.mainImage?.[0] && {
          mainImage: files.mainImage[0].filename,
        }),
        ...(files.appIcon?.[0] && {
          appIcon: files.appIcon[0].filename,
        }),
        ...(files.webImage?.[0] && {
          webImage: files.webImage[0].filename,
        }),
      },
    });

    await this.prisma.categoryFeature.deleteMany({ where: { categoryId: id } });

    if (featureTypeIds.length > 0) {
      await this.prisma.categoryFeature.createMany({
        data: featureTypeIds.map((fid) => ({
          categoryId: id,
          featureId: fid,
        })),
        skipDuplicates: true,
      });
    }

    return formatCategoryResponse(updatedCategory);
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
