import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

 async create(data: any) {
    const existing = await this.prisma.variant.findFirst({
      where: { sku: data.sku },
    });

    if (existing) {
      throw new BadRequestException('A variant with this SKU already exists.');
    }

    return this.prisma.variant.create({ data });
  }

  findAll() {
    return this.prisma.variant.findMany();
  }

  findOne(id: number) {
    return this.prisma.variant.findUnique({ where: { id } });
  }

   async update(id: number, data: any) {
    const existing = await this.prisma.variant.findFirst({
      where: {
        sku: data.sku,
        NOT: { id }, // Exclude current variant from the check
      },
    });

    if (existing) {
      throw new BadRequestException('Another variant with this SKU already exists.');
    }

    return this.prisma.variant.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.variant.delete({ where: { id } });
  }
}