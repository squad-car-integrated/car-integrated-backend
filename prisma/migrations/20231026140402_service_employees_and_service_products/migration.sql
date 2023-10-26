/*
  Warnings:

  - You are about to drop the column `employeeId` on the `service_employees` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `service_products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "service_employees" DROP CONSTRAINT "service_employees_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "service_products" DROP CONSTRAINT "service_products_productId_fkey";

-- AlterTable
ALTER TABLE "service_employees" DROP COLUMN "employeeId";

-- AlterTable
ALTER TABLE "service_products" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_EmployeeToServiceEmployees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToServiceProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToServiceEmployees_AB_unique" ON "_EmployeeToServiceEmployees"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToServiceEmployees_B_index" ON "_EmployeeToServiceEmployees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToServiceProducts_AB_unique" ON "_ProductToServiceProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToServiceProducts_B_index" ON "_ProductToServiceProducts"("B");

-- AddForeignKey
ALTER TABLE "_EmployeeToServiceEmployees" ADD CONSTRAINT "_EmployeeToServiceEmployees_A_fkey" FOREIGN KEY ("A") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToServiceEmployees" ADD CONSTRAINT "_EmployeeToServiceEmployees_B_fkey" FOREIGN KEY ("B") REFERENCES "service_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToServiceProducts" ADD CONSTRAINT "_ProductToServiceProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToServiceProducts" ADD CONSTRAINT "_ProductToServiceProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "service_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
