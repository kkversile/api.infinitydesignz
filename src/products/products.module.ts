import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { VariantsController } from './variants/variants.controller';
import { VariantsService } from './variants/variants.service';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { ProductDetailsController } from './product-details/product-details.controller';
import { ProductDetailsService } from './product-details/product-details.service';
import { ProductFiltersController } from './product-filters/product-filters.controller';
import { ProductFiltersService } from './product-filters/product-filters.service';
import { ProductFeaturesController } from './product-features/product-features.controller';
import { ProductFeaturesService } from './product-features/product-features.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [
    ProductsController,
    VariantsController,
    ImagesController,
    ProductDetailsController,
    ProductFiltersController,
    ProductFeaturesController
  ],
  providers: [
    ProductsService,
    VariantsService,
    ImagesService,
    ProductDetailsService,
    ProductFiltersService,
    PrismaService,
    ProductFeaturesService
  ],
})
export class ProductsModule {}
