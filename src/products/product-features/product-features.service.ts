import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductFeatureDto } from './dto';

@Injectable()
export class ProductFeaturesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductFeatureDto) {
    const { productId, featureListId, value } = dto;
    return this.prisma.productFeature.create({
      data: {
        // connect the existing product by its ID
        product: { connect: { id: productId } },
        // connect the existing featureList by its ID
        featureList: { connect: { id: featureListId } },
        value, // optional override
      },
    });
  }

  findByProduct(productId: number) {
    return this.prisma.productFeature.findMany({ where: { productId } });
  }

 update(id: number, dto: CreateProductFeatureDto) {
    const { productId, featureListId, value } = dto;
    return this.prisma.productFeature.update({
      where: { id },
      data: {
        // you can even reassign the relations if needed:
        product: { connect: { id: productId } },
        featureList: { connect: { id: featureListId } },
        value,
      },
    });
  }

  
}
