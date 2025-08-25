import { PartialType } from '@nestjs/mapped-types';
import { CreateMainCategoryPromotionDto } from './create-main-category-promotion.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMainCategoryPromotionDto extends PartialType(CreateMainCategoryPromotionDto) {
  @IsString()
  @IsOptional()
  imageUrl?: string; // filename when uploading a new image
}
