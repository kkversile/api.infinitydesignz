// src/app.module.ts

import { Module } from '@nestjs/common';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module'; 
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { ColorsModule } from './colors/colors.module';
import { SizeUOMModule } from './size-uom/size-uom.module';



import { SliderRightModule } from './slider-right/slider-right.module';
import { SliderModule } from './sliders/slider.module';
import { ProductsModule } from './products/products.module';

import { MainCategoryPromotionModule } from './main-category-promotion/main-category-promotion.module';
import { FeatureTypesModule } from './feature-types/feature-types.module';
import { CommonStatusModule } from './common-status/common-status.module';
import { FeatureSetsModule } from './feature-sets/feature-sets.module';     
import { FeatureListsModule } from './feature-lists/feature-lists.module';
import { FilterTypesModule } from './filter-types/filter-types.module';
import { FilterSetsModule } from './filter-sets/filter-sets.module';      // ✅ NEW
import { FilterListsModule } from './filter-lists/filter-lists.module';  // ✅ NEW
import { CouponModule } from './coupons/coupon.module';
import { PriceRangeModule } from './price-range/price-range.module'; // ✅ NEW
import { UsersModule } from './users/users.module'; // ✅ Registered Users Module
import { WishlistModule } from './wishlist/wishlist.module'; 

@Module({
  imports: [      

    PrismaModule,
    AuthModule,
    BrandsModule,
    CategoriesModule,
    SliderRightModule,    
    SliderModule,
    SizeUOMModule,
    ColorsModule,
    MainCategoryPromotionModule,
    ProductsModule,
    FeatureTypesModule,
    FeatureSetsModule,     // ✅ Added here
    FeatureListsModule,    // ✅ Added here
    FilterTypesModule,
    FilterSetsModule,      // ✅ Registered
    FilterListsModule,     // ✅ Registered
    CommonStatusModule,
    CouponModule,  
    PriceRangeModule,
    //UsersModule,
    WishlistModule,
  ],
})
export class AppModule {}