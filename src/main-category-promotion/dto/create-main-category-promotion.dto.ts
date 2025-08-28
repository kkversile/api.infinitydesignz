import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateMainCategoryPromotionDto {
  @IsString()
  title: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  displayCount?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  priority?: number;

  @Transform(({ value }) =>
    value === 'true' || value === true ? true :
    value === 'false' || value === false ? false : value
  )
  @IsBoolean()
  @IsOptional()
  status?: boolean;

   @Transform(({ value }) =>
    value === 'true' || value === true ? true :
    value === 'false' || value === false ? false : value
  )
   @IsOptional()
  @IsBoolean()
  showTitle?: boolean = true; // ✅ default true
}
