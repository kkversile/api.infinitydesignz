import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatusQueryDto } from '../common-status/dto/status-query.dto';


@Controller('sliders')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Get()
  findAll(@Query() { status }: StatusQueryDto) {
    return this.sliderService.findAll(status);
  }
  
@UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sliders',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, name + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateSliderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sliderService.create({
      ...dto,
      image_url: file.filename,
    });
  }

@UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sliders',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, name + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSliderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sliderService.update(id, {
      ...dto,
      ...(file ? { image_url: file.filename } : {}),
    });
  }
@UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sliderService.remove(id);
  }
}
