import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { MainCategoryPromotionService } from "./main-category-promotion.service";
import { CreateMainCategoryPromotionDto } from "./dto/create-main-category-promotion.dto";
import { UpdateMainCategoryPromotionDto } from "./dto/update-main-category-promotion.dto";
import { MAIN_CATEGORY_PROMOTION_IMAGE_PATH } from "../config/constants";

@UseGuards(JwtAuthGuard)
@Controller("home-category-promotions")
export class MainCategoryPromotionController {
  constructor(private readonly service: MainCategoryPromotionService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: `.${MAIN_CATEGORY_PROMOTION_IMAGE_PATH}`,
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, name + extname(file.originalname));
        },
      }),
    })
  )
  async create(
    @Body() dto: CreateMainCategoryPromotionDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.service.create({ ...dto, imageUrl: file?.filename ?? null });
  }

  @Patch(":id")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: `.${MAIN_CATEGORY_PROMOTION_IMAGE_PATH}`,
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, name + extname(file.originalname));
        },
      }),
    })
  )
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateMainCategoryPromotionDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.service.update(id, {
      ...dto,
      ...(file ? { imageUrl: file.filename } : {}),
    });
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
