/*
  Warnings:

  - You are about to drop the `ServiceEmployees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services_products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceEmployees" DROP CONSTRAINT "ServiceEmployees_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceEmployees" DROP CONSTRAINT "ServiceEmployees_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "services_products" DROP CONSTRAINT "services_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "services_products" DROP CONSTRAINT "services_products_serviceId_fkey";

-- DropTable
DROP TABLE "ServiceEmployees";

-- DropTable
DROP TABLE "services_products";

-- CreateTable
CREATE TABLE "service_products" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "service_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_employees" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "service_employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_products" ADD CONSTRAINT "service_products_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_products" ADD CONSTRAINT "service_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_employees" ADD CONSTRAINT "service_employees_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_employees" ADD CONSTRAINT "service_employees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
