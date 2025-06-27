
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMainCategoryPromotionDto } from './dto/create-main-category-promotion.dto';
import { UpdateMainCategoryPromotionDto } from './dto/update-main-category-promotion.dto';

@Injectable()
export class MainCategoryPromotionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mainCategoryPromotion.findMany({ orderBy: { created_at: 'asc' } });
  }

 async create(data: CreateMainCategoryPromotionDto & { image_url: string }) {
  return this.prisma.mainCategoryPromotion.create({
    data: {
      ...data,
      display_count: Number(data.display_count),
      display_rows: Number(data.display_rows),
     status:
          typeof data.status === 'string'
            ? data.status === 'true' || data.status === '1'
            : Boolean(data.status),
    },
  });
}
 async update(id: number, data: UpdateMainCategoryPromotionDto & { image_url?: string }) {
  return this.prisma.mainCategoryPromotion.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.position && { position: data.position }),
      ...(data.image_url && { image_url: data.image_url }),
      ...(data.display_count !== undefined && { display_count: Number(data.display_count) }),
      ...(data.display_rows !== undefined && { display_rows: Number(data.display_rows) }),
      ...(data.status !== undefined && {
        status:
          typeof data.status === 'string'
            ? data.status === 'true' || data.status === '1'
            : Boolean(data.status),
      }),
    },
  });
}


  async remove(id: number) {
    return this.prisma.mainCategoryPromotion.delete({ where: { id } });
  }
}
