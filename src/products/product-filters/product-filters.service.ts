import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface CreateProductFilterDto {
  productId: number;
  filterListId: number;
}

@Injectable()
export class ProductFiltersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(dto: CreateProductFilterDto) {
    const { productId, filterListId } = dto;

    const existing = await this.prisma.productFilter.findUnique({
      where: {
        productId_filterListId: {
          productId,
          filterListId,
        },
      },
    });

    if (existing) return existing;

    return this.prisma.productFilter.create({
      data: { productId, filterListId },
    });
  }

  async createOrUpdateMany(dtos: CreateProductFilterDto[]) {
    const results = await Promise.all(
      dtos.map((dto) => this.createOrUpdate(dto)),
    );
    return results;
  }

  findAll() {
    return this.prisma.productFilter.findMany();
  }


  findByProduct(productId: number) {
    return this.prisma.productFilter.findMany({ where: { productId } });
  }

  update(id: number, data: any) {
    return this.prisma.productFilter.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.productFilter.delete({ where: { id } });
  }
}
