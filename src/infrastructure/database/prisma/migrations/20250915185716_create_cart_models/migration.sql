/*
  Warnings:

  - A unique constraint covering the columns `[celular]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `celular` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `celular` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_celular_key` ON `User`(`celular`);
