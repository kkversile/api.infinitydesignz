import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SliderRightService {
  constructor(private prisma: PrismaService) {}

  async findOne() {
    return this.prisma.sliderRight.findUnique({ where: { id: 1 } });
  }

  async update(images: { image1?: string; image2?: string; image3?: string }) {
    return this.prisma.sliderRight.update({
      where: { id: 1 },
      data: images,
    });
  }
}