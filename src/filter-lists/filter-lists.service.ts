
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilterListService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { label: string; priority: number; status?: boolean; filterSetId: number }) {
    return this.prisma.filterList.create({ data });
  }

  findAll() {
    return this.prisma.filterList.findMany({
      include: { filterSet: true },
      orderBy: { id: 'desc' }
    });
  }

  async findOne(id: number) {
    const filterList = await this.prisma.filterList.findUnique({
      where: { id },
      include: { filterSet: true }
    });
    if (!filterList) throw new NotFoundException('Filter List not found');
    return filterList;
  }

  async update(id: number, data: { label?: string; priority?: number; status?: boolean; filterSetId?: number }) {
    await this.findOne(id); // ensure exists
    return this.prisma.filterList.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    await this.findOne(id); // ensure exists
    return this.prisma.filterList.delete({ where: { id } });
  }
}
