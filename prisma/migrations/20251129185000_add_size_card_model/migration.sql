-- CreateTable
CREATE TABLE "size_cards" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "template_id" INTEGER NOT NULL,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "size_cards_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "size_card_templates" ("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX "size_cards_template_id_idx" ON "size_cards"("template_id");
