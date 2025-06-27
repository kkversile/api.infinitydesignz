import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureTypesService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string }) {
    return this.prisma.featureType.create({ data });
  }

  findAll() {
    return this.prisma.featureType.findMany();
  }

  findOne(id: number) {
    return this.prisma.featureType.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.featureType.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.featureType.delete({ where: { id } });
  }
}