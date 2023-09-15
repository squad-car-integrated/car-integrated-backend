-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'OWNER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OWNER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitValue" DOUBLE PRECISION NOT NULL,
    "productAmout" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automobiles" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),

    CONSTRAINT "automobiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "automobileId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "employeesIds" TEXT[],
    "totalValue" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_products" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "services_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "automobiles" ADD CONSTRAINT "automobiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_automobileId_fkey" FOREIGN KEY ("automobileId") REFERENCES "automobiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_products" ADD CONSTRAINT "services_products_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_products" ADD CONSTRAINT "services_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
