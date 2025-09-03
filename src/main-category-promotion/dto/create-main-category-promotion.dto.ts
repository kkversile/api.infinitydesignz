import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

const BoolTransform = () =>
  Transform(({ value }) => {
    // Treat missing/empty as "not provided"
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const v = value.toLowerCase().trim();
      if (['true', '1', 'yes', 'on'].includes(v)) return true;
      if (['false', '0', 'no', 'off'].includes(v)) return false;
    }
    return undefined; // keeps it optional if garbage comes in
  });

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

  @BoolTransform()
  @IsBoolean()
  @IsOptional()
  status?: boolean; // service will default to false if omitted

  @BoolTransform()
  @IsBoolean()
  @IsOptional()
  showTitle?: boolean = true; // stays true when omitted
}
