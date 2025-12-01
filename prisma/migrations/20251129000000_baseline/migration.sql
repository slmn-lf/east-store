-- CreateTable _prisma_migrations for tracking
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"            SERIAL     NOT NULL PRIMARY KEY,
    "checksum"      VARCHAR    NOT NULL,
    "finished_at"   TIMESTAMP,
    "migration_name"VARCHAR    NOT NULL UNIQUE,
    "logs"          TEXT,
    "rolled_back_at"TIMESTAMP,
    "started_at"    TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

-- Insert baseline migrations that have been applied
INSERT INTO "_prisma_migrations" (checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES
('abc123', CURRENT_TIMESTAMP, '20251129114722_init', NULL, NULL, CURRENT_TIMESTAMP, 1),
('abc124', CURRENT_TIMESTAMP, '20251129144011_add_preorder_fields', NULL, NULL, CURRENT_TIMESTAMP, 1),
('abc125', CURRENT_TIMESTAMP, '20251129160434_add_stock_quantity_with_defaults', NULL, NULL, CURRENT_TIMESTAMP, 1),
('abc126', CURRENT_TIMESTAMP, '20251129170000_cleanup_product_fields', NULL, NULL, CURRENT_TIMESTAMP, 1)
ON CONFLICT DO NOTHING;
