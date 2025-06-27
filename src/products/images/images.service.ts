import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async saveImages(productId: string, files: Record<string, Express.Multer.File[]>) {
    const entries = [];

    for (const field in files) {
      const fileGroup = files[field];
      for (const file of fileGroup) {
        entries.push({
          productId: Number(productId),
          field,
          path: file.filename,
        });
      }
    }

    return this.prisma.image.createMany({ data: entries });
  }
}
