/*
  Warnings:

  - You are about to drop the `sliderright` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `sliderright`;

-- CreateTable
CREATE TABLE `slider_right` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `image1` VARCHAR(191) NOT NULL,
    `image2` VARCHAR(191) NOT NULL,
    `image3` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
