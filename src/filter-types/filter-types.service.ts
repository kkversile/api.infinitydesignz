import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilterTypesService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string }) {
    return this.prisma.filterType.create({ data });
  }

  findAll() {
    return this.prisma.filterType.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.filterType.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.filterType.update({ where: { id }, data });
  }

  async remove(id: number) {
    // ✅ Step 1: Ensure filterType exists
    const filterType = await this.prisma.filterType.findUnique({
      where: { id },
    });

    if (!filterType) {
      throw new NotFoundException('Filter Type not found');
    }

    // ✅ Step 2: Check if any category is using this filter type
    const categories = await this.prisma.category.findMany({
      where: { filterTypeId: id },
      select: { id: true, title: true },
    });

    if (categories.length > 0) {
      const usage = categories.map(c => `#${c.id} (${c.title})`).join(', ');
      throw new BadRequestException(
        `This filter type is used by categories: ${usage}. Please reassign them before deletion.`
      );
    }

    // ✅ Step 3: Safe to delete
    return this.prisma.filterType.delete({ where: { id } });
  }
}
