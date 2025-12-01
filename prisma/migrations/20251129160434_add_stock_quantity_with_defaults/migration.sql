/*
  Warnings:

  - Added the required column `price_cents` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "price_cents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock_quantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "price_idr" DROP NOT NULL;
