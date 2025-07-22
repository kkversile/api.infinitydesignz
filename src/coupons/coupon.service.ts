import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCouponDto) {
    return this.prisma.coupon.create({ data })
  }

  findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  }

  findOne(id: number) {
    return this.prisma.coupon.findUnique({ where: { id } })
  }

  update(id: number, data: UpdateCouponDto) {
    return this.prisma.coupon.update({ where: { id }, data })
  }

  async remove(id: number) {
    const exists = await this.prisma.coupon.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('Coupon not found')
    return this.prisma.coupon.delete({ where: { id } })
  }
}