-- DropIndex
DROP INDEX `product_features_featureId_fkey` ON `product_features`;

-- DropIndex
DROP INDEX `product_features_productId_fkey` ON `product_features`;

-- DropIndex
DROP INDEX `product_filters_filterId_fkey` ON `product_filters`;

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
DROP INDEX `products_colorId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_listSubCategoryId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_mainCategoryId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_sizeId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_subCategoryId_fkey` ON `products`;

-- CreateTable
CREATE TABLE `_CategoryFeatures` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryFeatures_AB_unique`(`A`, `B`),
    INDEX `_CategoryFeatures_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_mainCategoryId_fkey` FOREIGN KEY (`mainCategoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_listSubCategoryId_fkey` FOREIGN KEY (`listSubCategoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `size_uom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE `product_features` ADD CONSTRAINT `product_features_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_features` ADD CONSTRAINT `product_features_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `featuretype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_filters` ADD CONSTRAINT `product_filters_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_filters` ADD CONSTRAINT `product_filters_filterId_fkey` FOREIGN KEY (`filterId`) REFERENCES `filtertype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryFeatures` ADD CONSTRAINT `_CategoryFeatures_A_fkey` FOREIGN KEY (`A`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryFeatures` ADD CONSTRAINT `_CategoryFeatures_B_fkey` FOREIGN KEY (`B`) REFERENCES `featuretype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
