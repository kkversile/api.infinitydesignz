import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SizeUOMService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; status?: boolean }) {
    const existing = await this.prisma.sizeUOM.findFirst({
      where: { title: data.title },
    });

    if (existing) {
      throw new BadRequestException('Size UOM with the same title already exists.');
    }

    return this.prisma.sizeUOM.create({ data });
  }

  findAll() {
    return this.prisma.sizeUOM.findMany();
  }

  findOne(id: number) {
    return this.prisma.sizeUOM.findUnique({ where: { id } });
  }

async update(id: number, data: any) {
    if (data.title) {
      const existing = await this.prisma.sizeUOM.findFirst({
        where: {
          title: data.title,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BadRequestException('Another Size UOM with the same title already exists.');
      }
    }

    return this.prisma.sizeUOM.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.sizeUOM.delete({ where: { id } });
  }
}
