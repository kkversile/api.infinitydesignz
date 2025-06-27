import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductDetailsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.productDetails.create({ data });
  }

  findAll() {
    return this.prisma.productDetails.findMany();
  }

  findOne(id: number) {
    return this.prisma.productDetails.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.productDetails.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.productDetails.delete({ where: { id } });
  }
}