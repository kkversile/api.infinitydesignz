// src/main-product-promotion/dto/create-main-product-promotion.dto.ts
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateMainProductPromotionDto {
  @IsString()
  title: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  priority?: number;

  @Type(() => Number)
  @IsInt()
  mainCategoryPromotionId: number;

  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  brandId?: number;

  @IsString()
  @IsOptional()
  seller?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offerPercentFrom?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offerPercentTo?: number;

  @IsString() @IsOptional() @MaxLength(160) seoTitle?: string;
  @IsString() @IsOptional() @MaxLength(255) seoDescription?: string;
  @IsString() @IsOptional() @MaxLength(255) seoKeywords?: string;

  // form-data "true"/"false" → boolean
  @Transform(({ value }) => (value === 'true' || value === true ? true : value === 'false' || value === false ? false : value))
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
  // imageUrl will be set via controller/file upload, not directly by user
  // @IsString()
  // @IsOptional()
  // imageUrl?: string;