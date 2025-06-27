import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductFiltersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.productFilter.create({ data });
  }

  findAll() {
    return this.prisma.productFilter.findMany();
  }

  findOne(id: number) {
    return this.prisma.productFilter.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.productFilter.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.productFilter.delete({ where: { id } });
  }
}