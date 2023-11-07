/*
  Warnings:

  - You are about to drop the column `employeesIds` on the `service_employees` table. All the data in the column will be lost.
  - You are about to drop the column `productsIds` on the `service_products` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `service_employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `service_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_employees" DROP COLUMN "employeesIds",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "service_products" DROP COLUMN "productsIds",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "service_products" ADD CONSTRAINT "service_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_employees" ADD CONSTRAINT "service_employees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
