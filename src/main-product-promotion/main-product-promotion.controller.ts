import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseInterceptors, UploadedFile, ParseIntPipe, UseGuards, Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { MainProductPromotionService } from './main-product-promotion.service';
import { CreateMainProductPromotionDto } from './dto/create-main-product-promotion.dto';
import { UpdateMainProductPromotionDto } from './dto/update-main-product-promotion.dto';
import { MAIN_PRODUCT_PROMOTION_IMAGE_PATH } from '../config/constants';

@UseGuards(JwtAuthGuard)
@Controller('product-promotions')
export class MainProductPromotionController {
  constructor(private readonly service: MainProductPromotionService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: 'all' | 'active' | 'inactive',
    @Query('q') q?: string,
  ) {
    return this.service.findAll({ page, limit, status: status ?? 'all', q });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // CREATE — multipart/form-data, file field name: image
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `.${MAIN_PRODUCT_PROMOTION_IMAGE_PATH}`, // e.g. ./uploads/main-product-promotions/
      filename: (_req, file, cb) => {
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, name + extname(file.originalname));
      },
    }),
  }))
  async create(
    @Body() dto: CreateMainProductPromotionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // store only filename like your category flow
  return this.service.create(dto, file.filename);
  }

  // UPDATE — supports optional new image via multipart (same style as category)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `.${MAIN_PRODUCT_PROMOTION_IMAGE_PATH}`,
      filename: (_req, file, cb) => {
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, name + extname(file.originalname));
      },
    }),
  }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMainProductPromotionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.update(id, {
      ...dto,
      ...(file ? { imageUrl: file.filename } : {}),
    });
  }

  // Soft delete (status=false)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
