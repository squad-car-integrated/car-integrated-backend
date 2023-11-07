/*
  Warnings:

  - You are about to drop the `_EmployeeToServiceEmployees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToServiceProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EmployeeToServiceEmployees" DROP CONSTRAINT "_EmployeeToServiceEmployees_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToServiceEmployees" DROP CONSTRAINT "_EmployeeToServiceEmployees_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToServiceProducts" DROP CONSTRAINT "_ProductToServiceProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToServiceProducts" DROP CONSTRAINT "_ProductToServiceProducts_B_fkey";

-- AlterTable
ALTER TABLE "service_employees" ADD COLUMN     "employeesIds" TEXT[];

-- AlterTable
ALTER TABLE "service_products" ADD COLUMN     "productsIds" TEXT[];

-- DropTable
DROP TABLE "_EmployeeToServiceEmployees";

-- DropTable
DROP TABLE "_ProductToServiceProducts";
