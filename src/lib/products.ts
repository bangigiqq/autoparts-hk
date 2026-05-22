import { getDb, type ProductRow } from "./db";
import type { Product } from "@/types";
import {
  getCategoryBySlug,
  getCategoryById,
  getDescendantCategoryIds,
} from "./categories";

function mapProduct(row: ProductRow, extra?: { avgRating?: number; reviewCount?: number }): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDesc: row.short_desc,
    description: row.description,
    price: row.price,
    sku: row.sku,
    stock: row.stock,
    categoryId: row.category_id,
    brand: row.brand,
    vehicleModels: row.vehicle_models,
    specs: row.specs_json ? (JSON.parse(row.specs_json) as Record<string, string>) : null,
    imageUrl: row.image_url,
    badges: row.badges ? row.badges.split(",").filter(Boolean) : [],
    featured: row.featured === 1,
    ...extra,
  };
}

export function getProducts(filters?: {
  category?: string;
  cat?: string;
  brand?: string;
  search?: string;
  featured?: boolean;
}): Product[] {
  const db = getDb();
  let sql = `
    SELECT p.*,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  const catKey = filters?.cat ?? filters?.category;
  if (catKey) {
    const bySlug = getCategoryBySlug(catKey);
    const byId = getCategoryById(catKey);
    const cat = bySlug ?? byId;
    if (cat) {
      const ids = getDescendantCategoryIds(cat.id);
      const placeholders = ids.map(() => "?").join(",");
      sql += ` AND p.id IN (
        SELECT product_id FROM product_categories WHERE category_id IN (${placeholders})
      )`;
      params.push(...ids);
    } else {
      sql += ` AND p.category_id = ?`;
      params.push(catKey);
    }
  }
  if (filters?.brand) {
    sql += ` AND p.brand = ?`;
    params.push(filters.brand);
  }
  if (filters?.search) {
    sql += ` AND (p.name LIKE ? OR p.short_desc LIKE ?)`;
    const q = `%${filters.search}%`;
    params.push(q, q);
  }
  if (filters?.featured) {
    sql += ` AND p.featured = 1`;
  }

  sql += ` GROUP BY p.id ORDER BY p.featured DESC, p.name`;

  const rows = db.prepare(sql).all(...params) as (ProductRow & {
    avg_rating: number;
    review_count: number;
  })[];

  return rows.map((r) =>
    mapProduct(r, {
      avgRating: r.avg_rating,
      reviewCount: r.review_count,
    })
  );
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT p.*,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN reviews r ON r.product_id = p.id
       WHERE p.slug = ?
       GROUP BY p.id`
    )
    .get(slug) as (ProductRow & { avg_rating: number; review_count: number }) | undefined;

  if (!row) return null;
  return mapProduct(row, { avgRating: row.avg_rating, reviewCount: row.review_count });
}

export function getProductById(id: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  if (!row) return null;
  return mapProduct(row);
}

export function getProductCategoryBreadcrumb(productId: string) {
  const db = getDb();
  return db
    .prepare(
      `SELECT c.id, c.slug, c.name, c.name_ja, c.type
       FROM categories c
       INNER JOIN product_categories pc ON pc.category_id = c.id
       WHERE pc.product_id = ?
       ORDER BY c.type, c.sort_order`
    )
    .all(productId) as {
    id: string;
    slug: string;
    name: string;
    name_ja: string | null;
    type: string;
  }[];
}

export function getReviews(productId: string) {
  const db = getDb();
  return db
    .prepare(
      `SELECT id, author_name, rating, title, body, created_at
       FROM reviews WHERE product_id = ? ORDER BY created_at DESC`
    )
    .all(productId) as {
    id: string;
    author_name: string;
    rating: number;
    title: string | null;
    body: string;
    created_at: string;
  }[];
}
