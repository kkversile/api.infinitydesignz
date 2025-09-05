// src/app.module.ts

import { Module } from '@nestjs/common';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';

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
import { FilterSetsModule } from './filter-sets/filter-sets.module';      //  NEW
import { FilterListsModule } from './filter-lists/filter-lists.module';  //  NEW
import { CouponModule } from './coupons/coupon.module';
import { PriceRangeModule } from './price-range/price-range.module'; //  NEW
import { UsersModule } from './users/users.module'; //  Registered Users Module
import { WishlistModule } from './wishlist/wishlist.module'; 
import { AddressModule } from './addresses/address.module'; 

import { CartModule } from './cart/cart.module'; 
import { OrdersModule } from './orders/orders.module';
import { DeliveryOptionsModule } from './delivery-options/delivery-options.module';

import { PincodeModule } from './pincode/pincode.module';
import { BuyNowModule } from './buy-now/buy-now.module';
import { ContactsModule } from './contacts/contacts.module';
import { UserSubscribeModule } from './user-subscribe/user-subscribe.module';
import {FiltersModule} from './filters/filters.module';
import { KeywordsModule } from './keywords/keywords.module';
import { MainProductPromotionModule } from './main-product-promotion/main-product-promotion.module';
import { HomeCategoriesModule } from './home-categories/home-categories.module';
import { DashboardModule } from './dashboard/dashboard.module';
@Module({
  imports: [      
 MulterModule.register({
      limits: {
        fileSize: 25 * 1024 * 1024, // 25MB per file
        files: 20,                  // up to 20 files per request
        fields: 50,                 // max non-file fields
        fieldSize: 2 * 1024 * 1024, // 2MB per text field in multipart
      },
    }),
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
    FeatureSetsModule,     //  Added here
    FeatureListsModule,    //  Added here
    FilterTypesModule,
    FilterSetsModule,      //  Registered
    FilterListsModule,     //  Registered
    CommonStatusModule,
    CouponModule,  
    PriceRangeModule,
    UsersModule,
    WishlistModule,
    AddressModule,
    CartModule,
    OrdersModule,
    DeliveryOptionsModule,
    PincodeModule,
    BuyNowModule,
    UserSubscribeModule,
    ContactsModule,
    FiltersModule,
    KeywordsModule,
    MainProductPromotionModule,
    HomeCategoriesModule,
    DashboardModule,
  ],
})
export class AppModule {}