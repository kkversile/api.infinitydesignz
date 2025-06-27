import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

    // ✅ Create the category first
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

    // ✅ Then add featureType links via junction table
    if (featureTypeIds.length > 0) {
      await this.prisma.categoryFeature.createMany({
        data: featureTypeIds.map((fid) => ({
          categoryId: category.id,
          featureId: fid,
        })),
        skipDuplicates: true,
      });
    }

    return category;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        categoryFeatures: {
          include: { feature: true }, // 👈 Include feature details
        },
      },
    });

    // Optional: Flatten into `featureTypes`
    return categories.map((cat) => ({
      ...cat,
      featureTypes: cat.categoryFeatures.map((cf) => cf.feature),
    }));
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        categoryFeatures: {
          include: { feature: true },
        },
      },
    });

    if (!category) return null;

    return {
      ...category,
      featureTypes: category.categoryFeatures.map((cf) => cf.feature),
    };
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
        ...(files.mainImage?.[0] && { mainImage: files.mainImage[0].filename }),
        ...(files.appIcon?.[0] && { appIcon: files.appIcon[0].filename }),
        ...(files.webImage?.[0] && { webImage: files.webImage[0].filename }),
      },
    });

    // ✅ Delete old links
    await this.prisma.categoryFeature.deleteMany({ where: { categoryId: id } });

    // ✅ Re-insert new links
    if (featureTypeIds.length > 0) {
      await this.prisma.categoryFeature.createMany({
        data: featureTypeIds.map((fid) => ({
          categoryId: id,
          featureId: fid,
        })),
        skipDuplicates: true,
      });
    }

    return updatedCategory;
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
