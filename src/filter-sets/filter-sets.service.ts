
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilterSetService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { title: string; priority: number; status?: boolean; filterTypeId: number }) {
    return this.prisma.filterSet.create({ data });
  }

  findAll() {
    return this.prisma.filterSet.findMany({
      include: { filterType: true },
      orderBy: { id: 'desc' }
    });
  }

  async findOne(id: number) {
    const filterSet = await this.prisma.filterSet.findUnique({
      where: { id },
      include: { filterType: true }
    });
    if (!filterSet) throw new NotFoundException('Filter Set not found');
    return filterSet;
  }

  async update(id: number, data: { title?: string; priority?: number; status?: boolean; filterTypeId?: number }) {
    await this.findOne(id); // ensure exists
    return this.prisma.filterSet.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    await this.findOne(id); // ensure exists
    return this.prisma.filterSet.delete({ where: { id } });
  }
}
