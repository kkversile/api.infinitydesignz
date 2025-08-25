import { PartialType } from '@nestjs/mapped-types';
import { CreateMainProductPromotionDto } from './create-main-product-promotion.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMainProductPromotionDto extends PartialType(CreateMainProductPromotionDto) {
  // Allow imageUrl override on update (e.g., via PATCH /:id/image or multipart PATCH)
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
