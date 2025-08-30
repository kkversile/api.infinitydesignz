// dto/upsert-home-categories.dto.ts
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum RoomType {
  LivingRoom = 'LivingRoom',
  Kitchen = 'Kitchen',
  Office = 'Office',
  Study = 'Study',
  Garden = 'Garden',
}

export class HomeCategoryItemDto {
  @IsInt() categoryId: number;
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;   // now optional
  @IsBoolean() status: boolean;
}

export class UpsertHomeCategoriesDto {
  @IsEnum(RoomType) room: RoomType;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeCategoryItemDto)
  items: HomeCategoryItemDto[];
}

export class ReorderHomeCategoriesDto {
  room: RoomType;
  items: Array<{ categoryId: number; position: number }>;
}

export class ToggleHomeCategoryDto {
  room: RoomType;
  categoryId: number;
  status: boolean;
}
