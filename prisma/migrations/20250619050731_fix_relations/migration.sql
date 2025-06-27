/*
  Warnings:

  - You are about to drop the column `assembly_required` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `ideal_for` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `other_features` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `usage` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `with_cushions` on the `product_details` table. All the data in the column will be lost.
  - Added the required column `mrp` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `products` table without a default value. This is not possible if the table is not empty.

*/
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
DROP INDEX `products_categoryId_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_colorId_fkey` ON `products`;

-- AlterTable
ALTER TABLE `product_details` DROP COLUMN `assembly_required`,
    DROP COLUMN `brand`,
    DROP COLUMN `color`,
    DROP COLUMN `dimensions`,
    DROP COLUMN `ideal_for`,
    DROP COLUMN `other_features`,
    DROP COLUMN `type`,
    DROP COLUMN `usage`,
    DROP COLUMN `with_cushions`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `height` DOUBLE NULL,
    ADD COLUMN `length` DOUBLE NULL,
    ADD COLUMN `mrp` DOUBLE NOT NULL,
    ADD COLUMN `searchKeywords` VARCHAR(191) NULL,
    ADD COLUMN `sellingPrice` DOUBLE NOT NULL,
    ADD COLUMN `sizeId` INTEGER NULL,
    ADD COLUMN `stock` INTEGER NOT NULL,
    ADD COLUMN `width` DOUBLE NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
