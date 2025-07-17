-- DropIndex
DROP INDEX `categories_parentId_fkey` ON `categories`;

-- DropIndex
DROP INDEX `category_features_featureListId_fkey` ON `category_features`;

-- DropIndex
DROP INDEX `category_filters_filterListId_fkey` ON `category_filters`;

-- DropIndex
DROP INDEX `feature_lists_featureSetId_fkey` ON `feature_lists`;

-- DropIndex
DROP INDEX `feature_sets_featureTypeId_fkey` ON `feature_sets`;

-- DropIndex
DROP INDEX `filter_lists_filterSetId_fkey` ON `filter_lists`;

-- DropIndex
DROP INDEX `filter_sets_filterTypeId_fkey` ON `filter_sets`;

-- DropIndex
DROP INDEX `product_features_featureListId_fkey` ON `product_features`;

-- DropIndex
DROP INDEX `product_features_productId_fkey` ON `product_features`;

-- DropIndex
DROP INDEX `product_filters_filterListId_fkey` ON `product_filters`;

-- DropIndex
DROP INDEX `product_filters_productId_fkey` ON `product_filters`;

-- DropIndex
DROP INDEX `product_images_productId_fkey` ON `product_images`;

-- DropIndex
DROP INDEX `product_images_variantId_fkey` ON `product_images`;

-- DropIndex
DROP INDEX `product_variants_colorId_fkey` ON `product_variants`;

-- DropIndex
DROP INDEX `product_variants_productId_fkey` ON `product_variants`;

-- DropIndex
DROP INDEX `product_variants_sizeId_fkey` ON `product_variants`;

-- DropIndex
DROP INDEX `products_brandId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_categoryId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_colorId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_sizeId_fkey` ON `products`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `appIcon` VARCHAR(191) NULL,
    ADD COLUMN `frontDisplay` VARCHAR(191) NULL,
    ADD COLUMN `mainImage` VARCHAR(191) NULL,
    ADD COLUMN `position` INTEGER NULL,
    ADD COLUMN `webImage` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `size_uom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_details` ADD CONSTRAINT `product_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `size_uom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_sets` ADD CONSTRAINT `feature_sets_featureTypeId_fkey` FOREIGN KEY (`featureTypeId`) REFERENCES `feature_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_lists` ADD CONSTRAINT `feature_lists_featureSetId_fkey` FOREIGN KEY (`featureSetId`) REFERENCES `feature_sets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_features` ADD CONSTRAINT `category_features_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_features` ADD CONSTRAINT `category_features_featureListId_fkey` FOREIGN KEY (`featureListId`) REFERENCES `feature_lists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_features` ADD CONSTRAINT `product_features_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_features` ADD CONSTRAINT `product_features_featureListId_fkey` FOREIGN KEY (`featureListId`) REFERENCES `feature_lists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filter_sets` ADD CONSTRAINT `filter_sets_filterTypeId_fkey` FOREIGN KEY (`filterTypeId`) REFERENCES `filter_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filter_lists` ADD CONSTRAINT `filter_lists_filterSetId_fkey` FOREIGN KEY (`filterSetId`) REFERENCES `filter_sets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_filters` ADD CONSTRAINT `category_filters_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_filters` ADD CONSTRAINT `category_filters_filterListId_fkey` FOREIGN KEY (`filterListId`) REFERENCES `filter_lists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_filters` ADD CONSTRAINT `product_filters_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_filters` ADD CONSTRAINT `product_filters_filterListId_fkey` FOREIGN KEY (`filterListId`) REFERENCES `filter_lists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
