import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SizeUOMService {
  constructor(private prisma: PrismaService) { }

  create(data: any) {
    return this.prisma.sizeUOM.create({ data });
  }

  findAll() {
    return this.prisma.sizeUOM.findMany();
  }

  findOne(id: number) {
    return this.prisma.sizeUOM.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.sizeUOM.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.sizeUOM.delete({ where: { id } });
  }
}