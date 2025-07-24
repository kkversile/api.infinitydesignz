import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductFeatureDto, UpdateProductFeatureDto } from './dto';

@Injectable()
export class ProductFeaturesService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(dto: CreateProductFeatureDto) {
    const { productId, featureListId, value } = dto;

    const existing = await this.prisma.productFeature.findUnique({
      where: {
        productId_featureListId: { productId, featureListId },
      },
    });

    if (existing) {
      return this.prisma.productFeature.update({
        where: {
          productId_featureListId: { productId, featureListId },
        },
        data: { value },
      });
    }

    return this.prisma.productFeature.create({
      data: {
        productId,
        featureListId,
        value,
      },
    });
  }

  async createOrUpdateMany(items: CreateProductFeatureDto[]) {
    const results = await Promise.all(
      items.map((dto) => this.createOrUpdate(dto))
    );
    return results;
  }

  findByProduct(productId: number) {
    return this.prisma.productFeature.findMany({ where: { productId } });
  }

  update(id: number, dto: UpdateProductFeatureDto) {
    return this.prisma.productFeature.update({
      where: { id },
      data: dto,
    });
  }
}
