import { Module } from '@nestjs/common';
import { ProductDetailsService } from './product-details.service';
import { ProductDetailsController } from './product-details.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProductDetailsController],
  providers: [ProductDetailsService, PrismaService],
})
export class ProductdetailsModule {}