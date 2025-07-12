
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureSetService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { title: string; priority: number; status?: boolean; featureTypeId: number }) {
    return this.prisma.featureSet.create({ data });
  }

  findAll() {
    return this.prisma.featureSet.findMany({
      include: { featureType: true },
      orderBy: { id: 'desc' }
    });
  }

  async findOne(id: number) {
    const featureSet = await this.prisma.featureSet.findUnique({
      where: { id },
      include: { featureType: true }
    });
    if (!featureSet) throw new NotFoundException('Feature Set not found');
    return featureSet;
  }

  async update(id: number, data: { title?: string; priority?: number; status?: boolean; featureTypeId?: number }) {
    await this.findOne(id); // ensure exists
    return this.prisma.featureSet.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    await this.findOne(id); // ensure exists
    return this.prisma.featureSet.delete({ where: { id } });
  }
}
