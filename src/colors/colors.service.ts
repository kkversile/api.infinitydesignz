import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) { }

  create(data: any) {
    return this.prisma.color.create({ data });
  }

  findAll() {
    return this.prisma.color.findMany();
  }

  findOne(id: number) {
    return this.prisma.color.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.color.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.color.delete({ where: { id } });
  }
}