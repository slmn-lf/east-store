-- CreateTable
CREATE TABLE "size_card_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "size_card_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "size_card_rows" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "panjang" INTEGER NOT NULL,
    "lebarDada" INTEGER NOT NULL,
    "lebarBahu" INTEGER NOT NULL,
    "panjangLengan" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "size_card_rows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "size_card_templates_name_key" ON "size_card_templates"("name");

-- AddForeignKey
ALTER TABLE "size_card_rows" ADD CONSTRAINT "size_card_rows_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "size_card_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
