import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean, Min,IsDate } from 'class-validator'
import { CouponType, PriceType } from '@prisma/client'
import { Type } from 'class-transformer'

export class CreateCouponDto {
  @IsString()
  code: string

  @IsEnum(CouponType)
  type: CouponType

  @IsEnum(PriceType)
  priceType: PriceType

  @IsNumber()
  @Min(0)
  value: number

  // ✅ Optional; default to 0 if omitted
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrderAmount?: number = 0;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status: boolean = true; //  Default true

  @IsOptional() menuId?: number
  @IsOptional() subMenuId?: number
  @IsOptional() listSubMenuId?: number
  @IsOptional() brandId?: number
  @IsOptional() sellerId?: number
  @IsOptional() priceRangeId?: number
  @IsOptional() url?: string
}