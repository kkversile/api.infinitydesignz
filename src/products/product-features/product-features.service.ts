import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductFeatureDto, UpdateProductFeatureDto } from './dto';

@Injectable()
export class ProductFeaturesService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(dto: CreateProductFeatureDto) {
    const { productId, featureListId, value } = dto;

    try {
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
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation (from Prisma)
        throw new BadRequestException(
          `ProductFeature with productId ${productId} and featureListId ${featureListId} already exists.`
        );
      }
      // Fallback: rethrow if it's not a handled error
      throw new BadRequestException(error.message);
    }
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

  async update(id: number, dto: UpdateProductFeatureDto) {
    try {
      return await this.prisma.productFeature.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(`Duplicate entry for update: ${JSON.stringify(dto)}`);
      }
      throw new BadRequestException(error.message);
    }
  }
}
