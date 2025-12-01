-- CreateEnum
CREATE TYPE "PreorderStatus" AS ENUM ('unconfirmed', 'confirmed');

-- AlterTable
ALTER TABLE "preorders" 
  ADD COLUMN "payment_id" INTEGER,
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" SET DATA TYPE "PreorderStatus" USING 
    CASE 
      WHEN "status" = 'pending' THEN 'unconfirmed'::"PreorderStatus"
      WHEN "status" = 'confirmed' THEN 'confirmed'::"PreorderStatus"
      ELSE 'unconfirmed'::"PreorderStatus"
    END,
  ALTER COLUMN "status" SET DEFAULT 'unconfirmed';
