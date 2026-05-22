import { getDb } from "./db";
import {
  FREED_LOCK_CONTENT,
  isRichContentCorrupted,
  parseRichContentJson,
  serializeRichContent,
  type ProductRichContent,
} from "./product-content-types";

export function getRichContentFromDb(productId: string): ProductRichContent | null {
  const row = getDb()
    .prepare("SELECT rich_content_json FROM products WHERE id = ?")
    .get(productId) as { rich_content_json: string | null } | undefined;
  if (row?.rich_content_json) {
    const parsed = parseRichContentJson(row.rich_content_json);
    if (parsed) return parsed;
  }
  return null;
}

export function getRichContent(productId: string): ProductRichContent | null {
  const fromDb = getRichContentFromDb(productId);
  if (fromDb && !isRichContentCorrupted(fromDb)) return fromDb;
  if (productId === "p-freed-lock") return FREED_LOCK_CONTENT;
  return null;
}

/** Repair DB rows that were saved with corrupted encoding */
export function repairCorruptedRichContent() {
  const db = getDb();
  const rows = db
    .prepare("SELECT id, rich_content_json FROM products WHERE rich_content_json IS NOT NULL")
    .all() as { id: string; rich_content_json: string }[];

  for (const row of rows) {
    const parsed = parseRichContentJson(row.rich_content_json);
    if (!parsed || !isRichContentCorrupted(parsed)) continue;
    if (row.id === "p-freed-lock") {
      db.prepare("UPDATE products SET rich_content_json = ? WHERE id = ?").run(
        serializeRichContent(FREED_LOCK_CONTENT),
        row.id
      );
    } else {
      db.prepare("UPDATE products SET rich_content_json = NULL WHERE id = ?").run(row.id);
    }
  }
}

export function saveRichContent(productId: string, content: ProductRichContent | null) {
  const json = serializeRichContent(content);
  getDb()
    .prepare("UPDATE products SET rich_content_json = ? WHERE id = ?")
    .run(json, productId);
}
