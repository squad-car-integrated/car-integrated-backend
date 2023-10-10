/*
  Warnings:

  - A unique constraint covering the columns `[plate]` on the table `automobiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE';

-- CreateIndex
CREATE UNIQUE INDEX "automobiles_plate_key" ON "automobiles"("plate");
