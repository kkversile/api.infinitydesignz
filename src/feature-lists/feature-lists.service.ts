
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureListService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { label: string; priority: number; status?: boolean; featureSetId: number }) {
    return this.prisma.featureList.create({ data });
  }

  findAll() {
    return this.prisma.featureList.findMany({
      include: { featureSet: true },
      orderBy: { id: 'desc' }
    });
  }

  async findOne(id: number) {
    const featureList = await this.prisma.featureList.findUnique({
      where: { id },
      include: { featureSet: true }
    });
    if (!featureList) throw new NotFoundException('Feature List not found');
    return featureList;
  }

  async update(id: number, data: { label?: string; priority?: number; status?: boolean; featureSetId?: number }) {
    await this.findOne(id); // ensure exists
    return this.prisma.featureList.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    await this.findOne(id); // ensure exists
    return this.prisma.featureList.delete({ where: { id } });
  }
}
