import { IsIn, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export type StatusFilter = 'active' | 'inactive' | 'all';

export class StatusQueryDto {
  @IsOptional()
  @IsIn(['active', 'inactive', 'all'])
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 'active';
    return String(value).toLowerCase();
  })
  status: StatusFilter = 'active';
}
