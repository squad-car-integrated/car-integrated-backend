/*
  Warnings:

  - Added the required column `quantity` to the `service_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_products" ADD COLUMN     "quantity" INTEGER NOT NULL;
