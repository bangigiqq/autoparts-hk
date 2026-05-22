import { getDb } from "./db";
import { ALL_ENLARGE_CATEGORIES, type CategorySeed } from "./enlarge-categories";

export type CategoryNode = {
  id: string;
  slug: string;
  name: string;
  nameJa: string | null;
  parentId: string | null;
  type: string;
  sortOrder: number;
  /** 此分類及其子分類下的商品總數（去重） */
  productCount: number;
  children: CategoryNode[];
};

export type FlatCategory = {
  id: string;
  slug: string;
  name: string;
  nameJa: string | null;
  parentId: string | null;
  type: string;
  sortOrder: number;
};

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  name_ja: string | null;
  parent_id: string | null;
  type: string;
  sort_order: number;
};

function mapCategoryRow(row: CategoryRow): FlatCategory {
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

function sortCategoryNodes(nodes: CategoryNode[]): CategoryNode[] {
  return [...nodes]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "zh-Hant"))
    .map((n) => ({
      ...n,
      children: sortCategoryNodes(n.children),
    }));
}

export function seedEnlargeCategories(db = getDb()) {
  const hasEnlarge = db
    .prepare("SELECT id FROM categories WHERE id = ?")
    .get("fn-speed-door-lock");
  if (hasEnlarge) return false;

  const insert = db.prepare(
    `INSERT INTO categories (id, name, slug, parent_id, type, sort_order, name_ja)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    db.prepare("DELETE FROM product_categories").run();
    db.prepare("UPDATE products SET category_id = NULL").run();
    db.prepare("DELETE FROM categories").run();
    for (const c of ALL_ENLARGE_CATEGORIES) {
      insert.run(
        c.id,
        c.name,
        c.slug,
        c.parentId,
        c.type,
        c.sortOrder,
        c.nameJa ?? null
      );
    }
  });
  tx();
  return true;
}

export function getFlatCategories(type?: string): FlatCategory[] {
  const db = getDb();
  let sql = "SELECT id, slug, name, name_ja, parent_id, type, sort_order FROM categories";
  const params: string[] = [];
  if (type) {
    sql += " WHERE type = ?";
    params.push(type);
  }
  sql += " ORDER BY sort_order, name";
  const rows = db.prepare(sql).all(...params) as CategoryRow[];
  return rows.map(mapCategoryRow);
}

/** 含自身與所有子分類的商品總數（同一商品只計一次） */
export function getCategoryProductCountsMap(): Map<string, number> {
  const db = getDb();
  const flat = getFlatCategories();
  const result = new Map<string, number>();
  const memo = new Map<string, number>();

  for (const c of flat) {
    if (c.id.endsWith("-root")) {
      result.set(c.id, 0);
      continue;
    }
    const cached = memo.get(c.id);
    if (cached !== undefined) {
      result.set(c.id, cached);
      continue;
    }
    const ids = getDescendantCategoryIds(c.id);
    const placeholders = ids.map(() => "?").join(",");
    const row = db
      .prepare(
        `SELECT COUNT(DISTINCT product_id) as cnt FROM product_categories
         WHERE category_id IN (${placeholders})`
      )
      .get(...ids) as { cnt: number };
    const cnt = row?.cnt ?? 0;
    memo.set(c.id, cnt);
    result.set(c.id, cnt);
  }
  return result;
}

function attachProductCounts(
  nodes: CategoryNode[],
  counts: Map<string, number>
): CategoryNode[] {
  return nodes.map((n) => ({
    ...n,
    productCount: counts.get(n.id) ?? 0,
    children: attachProductCounts(n.children, counts),
  }));
}

/** 某分類維度下所有商品數（去重） */
export function getProductCountForCategoryType(
  type: "function" | "brand" | "monitor"
): number {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COUNT(DISTINCT pc.product_id) as cnt
       FROM product_categories pc
       INNER JOIN categories c ON c.id = pc.category_id
       WHERE c.type = ?`
    )
    .get(type) as { cnt: number } | undefined;
  return row?.cnt ?? 0;
}

export function buildCategoryTree(type: "function" | "brand" | "monitor"): CategoryNode[] {
  const rootId =
    type === "function" ? "fn-root" : type === "brand" ? "br-root" : "mon-root";
  const flat = getFlatCategories(type);
  const counts = getCategoryProductCountsMap();

  const map = new Map<string, CategoryNode>();
  for (const c of flat) {
    map.set(c.id, {
      id: c.id,
      slug: c.slug,
      name: c.name,
      nameJa: c.nameJa,
      parentId: c.parentId,
      type: c.type,
      sortOrder: c.sortOrder,
      productCount: counts.get(c.id) ?? 0,
      children: [],
    });
  }

  for (const c of flat) {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(map.get(c.id)!);
    }
  }

  const roots = map.get(rootId)?.children ?? [];
  return attachProductCounts(sortCategoryNodes(roots), counts);
}

export function getCategoryBySlug(slug: string): FlatCategory | null {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, slug, name, name_ja, parent_id, type, sort_order FROM categories WHERE slug = ?"
    )
    .get(slug) as CategoryRow | undefined;
  return row ? mapCategoryRow(row) : null;
}

export function getCategoryById(id: string): FlatCategory | null {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, slug, name, name_ja, parent_id, type, sort_order FROM categories WHERE id = ?"
    )
    .get(id) as CategoryRow | undefined;
  return row ? mapCategoryRow(row) : null;
}

export function getCategoryCounts() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT type, COUNT(*) as count FROM categories
       WHERE id NOT IN ('fn-root', 'br-root', 'mon-root')
       GROUP BY type`
    )
    .all() as { type: string; count: number }[];
  return {
    function: rows.find((r) => r.type === "function")?.count ?? 0,
    brand: rows.find((r) => r.type === "brand")?.count ?? 0,
    monitor: rows.find((r) => r.type === "monitor")?.count ?? 0,
    total: rows.reduce((s, r) => s + r.count, 0),
  };
}

/** 含自身與所有子分類 ID */
export function getDescendantCategoryIds(categoryId: string): string[] {
  const db = getDb();
  const rows = db
    .prepare(
      `WITH RECURSIVE descendants AS (
        SELECT id FROM categories WHERE id = ?
        UNION ALL
        SELECT c.id FROM categories c
        INNER JOIN descendants d ON c.parent_id = d.id
      )
      SELECT id FROM descendants`
    )
    .all(categoryId) as { id: string }[];
  return rows.map((r) => r.id);
}

export function getCategoryBreadcrumb(categoryId: string): FlatCategory[] {
  const trail: FlatCategory[] = [];
  let current = getCategoryById(categoryId);
  while (current) {
    if (!current.id.endsWith("-root")) trail.unshift(current);
    current = current.parentId ? getCategoryById(current.parentId) : null;
  }
  return trail;
}

export function linkProductCategories(
  productId: string,
  categoryIds: string[],
  db = getDb()
) {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)"
  );
  for (const cid of categoryIds) {
    insert.run(productId, cid);
  }
}
