import { Module } from '@nestjs/common';
import { MainProductPromotionController } from './main-product-promotion.controller'; // admin controller
import { PromotionsFrontendController } from './promotions-frontend.controller'; // ✅ new frontend controller
import { MainProductPromotionService } from './main-product-promotion.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [
    MainProductPromotionController, // admin CRUD (protected with JwtAuthGuard)
    PromotionsFrontendController,   // ✅ new frontend controller (public)
  ],
  providers: [MainProductPromotionService, PrismaService],
})
export class MainProductPromotionModule {}
