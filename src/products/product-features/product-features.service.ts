import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductFeatureDto } from './dto';

@Injectable()
export class ProductFeaturesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductFeatureDto) {
    return this.prisma.productFeature.create({ data: dto });
  }

  findByProduct(productId: number) {
    return this.prisma.productFeature.findMany({ where: { productId } });
  }

  update(id: number, dto: CreateProductFeatureDto) {
    return this.prisma.productFeature.update({
      where: { id },
      data: dto,
    });
  }

  
}
