import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';

@Injectable()
export class SliderService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.slider.findMany({
      orderBy: { priority: 'asc' },
    });
  }

  async create(data: CreateSliderDto & { image_url: string }) {
    return this.prisma.slider.create({
      data: {
        title: data.title,
        link: data.link,
        image_url: data.image_url,
        priority: Number(data.priority),
         status:
          typeof data.status === 'string'
            ? data.status === 'true' || data.status === '1'
            : Boolean(data.status),
      },
    });
  }

async update(id: number, data: UpdateSliderDto & { image_url?: string }) {
  return this.prisma.slider.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.link && { link: data.link }),
      ...(data.image_url && { image_url: data.image_url }),
      ...(data.priority !== undefined && { priority: Number(data.priority) }),
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
    return this.prisma.slider.delete({
      where: { id },
    });
  }
}
