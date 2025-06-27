import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.variant.create({ data });
  }

  findAll() {
    return this.prisma.variant.findMany();
  }

  findOne(id: number) {
    return this.prisma.variant.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.variant.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.variant.delete({ where: { id } });
  }
}