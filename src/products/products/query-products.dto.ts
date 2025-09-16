import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class QueryProductsDto {
  // search & brand
  @IsOptional() @IsString()
  searchStr?: string;

  @IsOptional() @Transform(({ value }) => parseInt(value, 10))
  @IsInt() @Min(1)
  brandId?: number;

  // category hierarchy
  @IsOptional() @Transform(({ value }) => parseInt(value, 10))
  @IsInt() @Min(1)
  mainCategoryId?: number;

  @IsOptional() @Transform(({ value }) => parseInt(value, 10))
  @IsInt() @Min(1)
  subCategoryId?: number;

  @IsOptional() @Transform(({ value }) => parseInt(value, 10))
  @IsInt() @Min(1)
  listSubCatId?: number;

  // price
  @IsOptional() @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @IsOptional() @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  // Discount % band (inclusive)
  @IsOptional() @Transform(({ value }) => parseFloat(value))
  @IsNumber() @Min(0) @Max(100)
  discountPctMin?: number;

  @IsOptional() @Transform(({ value }) => parseFloat(value))
  @IsNumber() @Min(0) @Max(100)
  discountPctMax?: number;

  // CSV params
  @IsOptional()
  @Transform(({ value }) =>
    value ? String(value).split(',').map((s: string) => s.trim()).filter(Boolean) : undefined
  )
  @IsString({ each: true })
  color?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    value ? String(value).split(',').map((s: string) => s.trim()).filter(Boolean) : undefined
  )
  @IsString({ each: true })
  size?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    value
      ? String(value).split(',').map((s: string) => parseInt(s, 10)).filter((n) => !isNaN(n))
      : undefined
  )
  @IsInt({ each: true })
  filterListIds?: number[];

  // Back-compat: JSON blob fallback
  @IsOptional() @IsString()
  filters?: string;

  // sort & pagination  ⬅️ now includes 'relevance'
  @IsOptional() @IsIn(['relevance', 'newest', 'price_asc', 'price_desc'])
  sort?: 'relevance' | 'newest' | 'price_asc' | 'price_desc';

  @IsOptional() @Transform(({ value }) => parseInt(value, 10))
  @IsInt() @Min(1)
  page?: number;

  @IsOptional() @Transform(({ value }) => parseInt(value, 10))
  @IsInt() @Min(1)
  pageSize?: number;
}
