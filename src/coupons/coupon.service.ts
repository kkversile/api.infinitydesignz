// src/coupons/coupon.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCouponDto) {
    try {
      return await this.prisma.coupon.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Coupon code already exists');
      }
      throw error; // unknown error - rethrow
    }
  }

  findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.coupon.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateCouponDto) {
    try {
      return await this.prisma.coupon.update({ where: { id }, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Coupon not found');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const exists = await this.prisma.coupon.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Coupon not found');
    return this.prisma.coupon.delete({ where: { id } });
  }
}
