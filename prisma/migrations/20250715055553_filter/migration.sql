/*
  Warnings:

  - You are about to drop the `featuretype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filtertype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `category_features_featureId_fkey` ON `category_features`;

-- DropIndex
DROP INDEX `CategoryFilter_filterId_fkey` ON `categoryfilter`;

-- DropIndex
DROP INDEX `feature_lists_featureSetId_fkey` ON `feature_lists`;

-- DropIndex
DROP INDEX `feature_sets_featureTypeId_fkey` ON `feature_sets`;

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
DROP INDEX `ProductFilterValue_filterId_fkey` ON `productfiltervalue`;

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

-- DropTable
DROP TABLE `featuretype`;

-- DropTable
DROP TABLE `filtertype`;

-- CreateTable
CREATE TABLE `feature_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `feature_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filter_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `filter_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filter_sets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `filterTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filter_lists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `filterSetId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
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
ALTER TABLE `product_features` ADD CONSTRAINT `product_features_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_filters` ADD CONSTRAINT `product_filters_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_filters` ADD CONSTRAINT `product_filters_filterId_fkey` FOREIGN KEY (`filterId`) REFERENCES `filter_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_features` ADD CONSTRAINT `category_features_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_features` ADD CONSTRAINT `category_features_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryFilter` ADD CONSTRAINT `CategoryFilter_filterId_fkey` FOREIGN KEY (`filterId`) REFERENCES `product_filters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductFilterValue` ADD CONSTRAINT `ProductFilterValue_filterId_fkey` FOREIGN KEY (`filterId`) REFERENCES `product_filters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_sets` ADD CONSTRAINT `feature_sets_featureTypeId_fkey` FOREIGN KEY (`featureTypeId`) REFERENCES `feature_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_lists` ADD CONSTRAINT `feature_lists_featureSetId_fkey` FOREIGN KEY (`featureSetId`) REFERENCES `feature_sets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filter_sets` ADD CONSTRAINT `filter_sets_filterTypeId_fkey` FOREIGN KEY (`filterTypeId`) REFERENCES `filter_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filter_lists` ADD CONSTRAINT `filter_lists_filterSetId_fkey` FOREIGN KEY (`filterSetId`) REFERENCES `filter_sets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
