import { Injectable,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}


  async create(data: { name: string; logo_url?: string; status?: boolean }) {
    const existing = await this.prisma.brand.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      throw new BadRequestException('Brand with the same name already exists.');
    }

    return this.prisma.brand.create({ data });
  }


  findAll() {
    return this.prisma.brand.findMany();
  }

  findOne(id: number) {
    return this.prisma.brand.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.brand.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.brand.delete({ where: { id } });
  }
}
