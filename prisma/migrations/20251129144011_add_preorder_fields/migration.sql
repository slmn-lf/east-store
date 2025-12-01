/*
  Warnings:

  - Added the required column `customer_address` to the `preorders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `preorders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `preorders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `preorders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "preorders" ADD COLUMN     "customer_address" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "total_price" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT;
