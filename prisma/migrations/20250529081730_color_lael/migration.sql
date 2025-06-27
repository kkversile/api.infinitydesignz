/*
  Warnings:

  - You are about to drop the column `name` on the `colors` table. All the data in the column will be lost.
  - Added the required column `label` to the `colors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `colors` DROP COLUMN `name`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL;
