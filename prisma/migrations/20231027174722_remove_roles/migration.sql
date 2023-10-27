/*
  Warnings:

  - You are about to drop the column `role` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `owners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "owners" DROP COLUMN "role";

-- DropEnum
DROP TYPE "UserRole";
