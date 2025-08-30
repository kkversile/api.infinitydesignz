// home-categories.module.ts
import { Module } from '@nestjs/common';
import { HomeCategoriesController } from './home-categories.controller';
import { HomeCategoriesService } from './home-categories.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HomeCategoriesController],
  providers: [HomeCategoriesService, PrismaService],
})
export class HomeCategoriesModule {}
