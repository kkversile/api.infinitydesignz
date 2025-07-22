import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriceRangeDto } from './dto/create-price-range.dto';
import { UpdatePriceRangeDto } from './dto/update-price-range.dto';

@Injectable()
export class PriceRangeService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePriceRangeDto) {
    return this.prisma.priceRange.create({ data });
  }

  findAll() {
    return this.prisma.priceRange.findMany({ orderBy: { min: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.priceRange.findUnique({ where: { id } });
  }

  update(id: number, data: UpdatePriceRangeDto) {
    return this.prisma.priceRange.update({ where: { id }, data });
  }

  async remove(id: number) {
    const exists = await this.prisma.priceRange.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('PriceRange not found');
    return this.prisma.priceRange.delete({ where: { id } });
  }
}