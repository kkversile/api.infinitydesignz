import { Injectable, BadRequestException } from '@nestjs/common';
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

  try {
    // Check existence of foreign keys BEFORE create
    const productExists = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!productExists) {
      throw new BadRequestException(`Invalid productId does not exists in DB: ${productId}`);
    }

    const filterExists = await this.prisma.filterList.findUnique({
      where: { id: filterListId },
      select: { id: true },
    });

    if (!filterExists) {
      throw new BadRequestException(`Invalid filterListId does not exists in DB: ${filterListId}`);
    }

    // Check for existing combination
    const existing = await this.prisma.productFilter.findUnique({
      where: {
        productId_filterListId: {
          productId,
          filterListId,
        },
      },
    });

    if (existing) return existing;

    return await this.prisma.productFilter.create({
      data: { productId, filterListId },
    });
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }

    if (error.code === 'P2002') {
      throw new BadRequestException(
        `ProductFilter with productId ${productId} and filterListId ${filterListId} already exists.`
      );
    }

    throw new BadRequestException(error.message);
  }
}

  async createOrUpdateMany(dtos: CreateProductFilterDto[]) {
    const results = await Promise.all(
      dtos.map((dto) => this.createOrUpdate(dto))
    );
    return results;
  }

  findAll() {
    return this.prisma.productFilter.findMany();
  }

  findByProduct(productId: number) {
    return this.prisma.productFilter.findMany({ where: { productId } });
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.productFilter.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Update failed: productFilter with similar constraint already exists.`
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.productFilter.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }
}
