import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const BoolTransform = () =>
  Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const v = value.toLowerCase().trim();
      if (['true', '1', 'yes', 'on'].includes(v)) return true;
      if (['false', '0', 'no', 'off'].includes(v)) return false;
    }
    return undefined;
  });

export class CreateSliderDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link?: string;

  @Type(() => Number)
  @IsInt()
  priority: number;

  @BoolTransform()
  @IsBoolean()
  @IsOptional()
  status?: boolean; // optional, defaults handled in service
}
