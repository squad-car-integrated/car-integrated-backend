/*
  Warnings:

  - You are about to drop the column `totalValue` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "totalValue",
ADD COLUMN     "laborValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "productsTotalValue" DOUBLE PRECISION NOT NULL DEFAULT 0;
