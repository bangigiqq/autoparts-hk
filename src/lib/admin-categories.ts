import { getDb } from "./db";
import {
  getCategoryById,
  getDescendantCategoryIds,
  type FlatCategory,
} from "./categories";

import { CATEGORY_ROOT_IDS } from "./category-constants";

const ROOT_IDS = CATEGORY_ROOT_IDS;

const TYPE_PREFIX: Record<string, string> = {
  function: "fn",
  brand: "br",
  monitor: "mon",
};

export { CATEGORY_TYPE_LABELS } from "./category-constants";

export type CategoryInput = {
  id?: string;
  slug: string;
  name: string;
  nameJa?: string | null;
  parentId: string | null;
  type: "function" | "brand" | "monitor";
  sortOrder: number;
};

import type { CategoryWithMeta } from "./admin-category-types";

export type { CategoryWithMeta } from "./admin-category-types";

function rowToFlat(row: {
  id: string;
  slug: string;
  name: string;
  name_ja: string | null;
  parent_id: string | null;
  type: string;
  sort_order: number;
}): FlatCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameJa: row.name_ja,
    parentId: row.parent_id,
    type: row.type,
    sortOrder: row.sort_order,
  };
}

function computeDepth(
  id: string,
  byId: Map<string, FlatCategory>
): number {
  let depth = 0;
  let current = byId.get(id);
  while (current?.parentId) {
    depth++;
    current = byId.get(current.parentId);
    if (depth > 20) break;
  }
  return depth;
}

export function listCategoriesAdmin(type?: string): CategoryWithMeta[] {
  const db = getDb();
  let sql = `SELECT c.id, c.slug, c.name, c.name_ja, c.parent_id, c.type, c.sort_order,
    (SELECT COUNT(*) FROM product_categories pc WHERE pc.category_id = c.id) as product_count,
    (SELECT COUNT(*) FROM categories ch WHERE ch.parent_id = c.id) as child_count
    FROM categories c`;
  const params: string[] = [];
  if (type) {
    sql += " WHERE c.type = ?";
    params.push(type);
  }
  sql += " ORDER BY c.type, c.sort_order, c.name";

  const rows = db.prepare(sql).all(...params) as {
    id: string;
    slug: string;
    name: string;
    name_ja: string | null;
    parent_id: string | null;
    type: string;
    sort_order: number;
    product_count: number;
    child_count: number;
  }[];

  const flat = rows.map((r) => rowToFlat(r));
  const byId = new Map(flat.map((c) => [c.id, c]));

  return rows.map((r) => ({
    ...rowToFlat(r),
    productCount: r.product_count,
    childCount: r.child_count,
    depth: computeDepth(r.id, byId),
  }));
}

export function getCategoryAdmin(id: string): CategoryWithMeta | null {
  const list = listCategoriesAdmin();
  return list.find((c) => c.id === id) ?? null;
}

function validateParent(
  parentId: string | null,
  type: string,
  selfId?: string
): string | null {
  if (!parentId) {
    return "必須選擇上層分類";
  }
  const parent = getCategoryById(parentId);
  if (!parent) return "上層分類不存在";
  if (parent.type !== type) return "上層分類類型必須相同";
  if (selfId && parentId === selfId) return "不能以自己為上層";
  if (selfId) {
    const descendants = getDescendantCategoryIds(selfId);
    if (descendants.includes(parentId)) return "不能設為自己的子分類之下";
  }
  return null;
}

function generateId(type: string, slug: string, customId?: string): string {
  if (customId?.trim()) return customId.trim();
  const prefix = TYPE_PREFIX[type] ?? "cat";
  const base = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${prefix}-${base || "item"}`;
}

export function createCategory(input: CategoryInput): FlatCategory {
  const db = getDb();
  const parentErr = validateParent(input.parentId, input.type);
  if (parentErr) throw new Error(parentErr);

  const id = generateId(input.type, input.slug, input.id);
  const slugExists = db.prepare("SELECT id FROM categories WHERE slug = ?").get(input.slug);
  if (slugExists) throw new Error("網址代稱已被使用");

  const idExists = db.prepare("SELECT id FROM categories WHERE id = ?").get(id);
  if (idExists) throw new Error("分類 ID 已存在，請修改 slug 或自訂 ID");

  db.prepare(
    `INSERT INTO categories (id, name, slug, parent_id, type, sort_order, name_ja)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.name.trim(),
    input.slug.trim(),
    input.parentId,
    input.type,
    input.sortOrder,
    input.nameJa?.trim() || null
  );

  return getCategoryById(id)!;
}

export function updateCategory(
  id: string,
  input: Omit<CategoryInput, "id" | "type">
): FlatCategory {
  const db = getDb();
  const existing = getCategoryById(id);
  if (!existing) throw new Error("找不到分類");

  if (ROOT_IDS.has(id) && input.parentId !== existing.parentId) {
    throw new Error("根分類不能更改上層");
  }

  const parentErr = validateParent(input.parentId, existing.type, id);
  if (parentErr) throw new Error(parentErr);

  const slugRow = db
    .prepare("SELECT id FROM categories WHERE slug = ? AND id != ?")
    .get(input.slug.trim(), id) as { id: string } | undefined;
  if (slugRow) throw new Error("網址代稱已被使用");

  db.prepare(
    `UPDATE categories SET name=?, slug=?, parent_id=?, sort_order=?, name_ja=?
     WHERE id=?`
  ).run(
    input.name.trim(),
    input.slug.trim(),
    input.parentId,
    input.sortOrder,
    input.nameJa?.trim() || null,
    id
  );

  return getCategoryById(id)!;
}

export function deleteCategory(id: string): void {
  if (ROOT_IDS.has(id)) throw new Error("根分類不能刪除");

  const db = getDb();
  const meta = getCategoryAdmin(id);
  if (!meta) throw new Error("找不到分類");
  if (meta.childCount > 0) throw new Error("請先刪除或移走子分類");
  if (meta.productCount > 0) throw new Error("此分類仍有關聯商品，請先解除商品關聯");

  db.prepare("UPDATE products SET category_id = NULL WHERE category_id = ?").run(id);
  db.prepare("DELETE FROM product_categories WHERE category_id = ?").run(id);
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}

/** 供下拉選單：依類型列出可選上層（含 root） */
export function getParentOptions(type: "function" | "brand" | "monitor"): FlatCategory[] {
  const flat = listCategoriesAdmin(type);
  return flat.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "zh-Hant"));
}

export function getProductCategoryIds(productId: string): string[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT category_id FROM product_categories WHERE product_id = ?")
    .all(productId) as { category_id: string }[];
  return rows.map((r) => r.category_id);
}

export function setProductCategories(productId: string, categoryIds: string[]) {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM product_categories WHERE product_id = ?").run(productId);
    const insert = db.prepare(
      "INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)"
    );
    for (const cid of categoryIds) {
      insert.run(productId, cid);
    }
    const primary = categoryIds[0] ?? null;
    db.prepare("UPDATE products SET category_id = ? WHERE id = ?").run(primary, productId);
  });
  tx();
}
