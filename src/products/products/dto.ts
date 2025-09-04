import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDetailsDto {
  @IsOptional() @IsString()
  model?: string;

  @IsOptional() @IsNumber()
  weight?: number;

  @IsOptional() @IsInt() @Min(0)
  sla?: number;

  @IsOptional() @IsNumber()
  deliveryCharges?: number;
}


export class VariantDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @IsString()
  sku: string;

  @Type(() => Number)
  @IsNumber()
  stock: number;

  @Type(() => Number)
  @IsNumber()
  mrp: number;

  @Type(() => Number)
  @IsNumber()
  sellingPrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  colorId?: number;
}


export class CreateProductsDto {
  @IsString()
  sku!: string;

  @IsString()
  title!: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsInt() @Min(1)
  brandId?: number;

  @IsInt() @Min(1)
  categoryId!: number;

  @IsOptional() @IsInt() @Min(1)
  colorId?: number;

  @IsOptional() @IsInt() @Min(1)
  sizeId?: number;

  @IsInt() @Min(0)
  stock!: number;

  @IsNumber()
  mrp!: number;

  @IsNumber()
  sellingPrice!: number;

  @IsOptional() @IsNumber()
  height?: number;

  @IsOptional() @IsNumber()
  width?: number;

  @IsOptional() @IsNumber()
  length?: number;

  @IsOptional() @IsString()
  searchKeywords?: string;

  @IsOptional() @IsBoolean()
  status?: boolean;

  // ✅ NEW multi-select promotions
  @IsOptional() @IsArray() @IsInt({ each: true })
  mainCategoryPromotionIds?: number[];

  @IsOptional() @ValidateNested() @Type(() => ProductDetailsDto)
  productDetails?: ProductDetailsDto;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => VariantDto)
  variants?: VariantDto[];
}

export class UpdateProductsDto extends CreateProductsDto {}
