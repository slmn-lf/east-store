-- Drop unnecessary columns and make price_idr required again
ALTER TABLE "products" DROP COLUMN "price_cents",
DROP COLUMN "stock_quantity",
ALTER COLUMN "price_idr" SET NOT NULL;
