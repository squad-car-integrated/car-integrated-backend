-- DropForeignKey
ALTER TABLE "automobiles" DROP CONSTRAINT "automobiles_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "service_employees" DROP CONSTRAINT "service_employees_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "service_employees" DROP CONSTRAINT "service_employees_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_products" DROP CONSTRAINT "service_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "service_products" DROP CONSTRAINT "service_products_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_automobile_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "automobiles" ADD CONSTRAINT "automobiles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_automobile_id_fkey" FOREIGN KEY ("automobile_id") REFERENCES "automobiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_products" ADD CONSTRAINT "service_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_products" ADD CONSTRAINT "service_products_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_employees" ADD CONSTRAINT "service_employees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_employees" ADD CONSTRAINT "service_employees_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
