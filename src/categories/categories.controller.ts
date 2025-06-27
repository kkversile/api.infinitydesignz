import { Express } from 'express';
/// <reference types="multer" />
import { multerCategoryStorage } from '../config/multer.config'; // adjust path

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'appIcon', maxCount: 1 },
      { name: 'webImage', maxCount: 1 },
    ], { storage: multerCategoryStorage } )
  )
  create(
    @Body() body: any,
 @UploadedFiles()
    files: {
      mainImage?: Array<Express.Multer.File>;
      appIcon?: Array<Express.Multer.File>;
      webImage?: Array<Express.Multer.File>;
    }
  ) {
    return this.service.create(body, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'appIcon', maxCount: 1 },
      { name: 'webImage', maxCount: 1 },
      
    ], { storage: multerCategoryStorage } )
  )
  update(
    @Param('id') id: string,
    @Body() body: any,
   @UploadedFiles()
      files: {
        mainImage?: Array<Express.Multer.File>;
        appIcon?: Array<Express.Multer.File>;
        webImage?: Array<Express.Multer.File>;
      }
  ) {
    return this.service.update(+id, body, files);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
