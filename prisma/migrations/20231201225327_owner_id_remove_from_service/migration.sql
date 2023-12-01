/*
  Warnings:

  - You are about to drop the column `owner_id` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_owner_id_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "owner_id",
ADD COLUMN     "ownerId" TEXT;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
