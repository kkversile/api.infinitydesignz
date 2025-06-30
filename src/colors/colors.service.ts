import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { label: string; hex_code?: string; status?: boolean }) {
    const existing = await this.prisma.color.findFirst({
      where: { label: data.label },
    });

    if (existing) {
      throw new BadRequestException('Color with the same label already exists.');
    }

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
