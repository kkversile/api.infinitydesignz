import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilterTypesService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string }) {
    return this.prisma.filterType.create({ data });
  }

  findAll() {
    return this.prisma.filterType.findMany();
  }

  findOne(id: number) {
    return this.prisma.filterType.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.filterType.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.filterType.delete({ where: { id } });
  }
}