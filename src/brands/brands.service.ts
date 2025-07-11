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
  return this.prisma.brand.findMany({
    orderBy: {
      id: 'desc',
    },
  });
}

  findOne(id: number) {
    return this.prisma.brand.findUnique({ where: { id } });
  }

async update(
  id: number,
  data: Partial<{ name: string; status: boolean }>
) {
  if (data.name) {
    const existing = await this.prisma.brand.findFirst({
      where: {
        name: data.name,
        NOT: { id }, // Exclude current brand by ID
      },
    });

    if (existing) {
      throw new BadRequestException('Another brand with the same name already exists.');
    }
  }

  return this.prisma.brand.update({
    where: { id },
    data,
  });
}


  remove(id: number) {
    return this.prisma.brand.delete({ where: { id } });
  }
}
