import { randomUUID } from "crypto";
import { getDb, type OrderRow, type ProductRow } from "./db";
import type { Order, Product } from "@/types";

export type AdminStats = {
  productCount: number;
  orderCount: number;
  pendingOrders: number;
  userCount: number;
  revenueTotal: number;
};

export function getAdminStats(): AdminStats {
  const db = getDb();
  const productCount = (
    db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number }
  ).c;
  const orderCount = (db.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number }).c;
  const pendingOrders = (
    db.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'").get() as {
      c: number;
    }
  ).c;
  const userCount = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  const revenueTotal = (
    db
      .prepare(
        "SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status NOT IN ('cancelled')"
      )
      .get() as { s: number }
  ).s;
  return { productCount, orderCount, pendingOrders, userCount, revenueTotal };
}

function mapProductRow(row: ProductRow): Product {
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
  };
}

export function listAllProducts(): Product[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM products ORDER BY featured DESC, name")
    .all() as ProductRow[];
  return rows.map(mapProductRow);
}

export type AdminOrderListItem = {
  id: string;
  orderNumber: number;
  status: string;
  total: number;
  paymentMethod: string;
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
  itemCount: number;
};

export function listAllOrders(): AdminOrderListItem[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT o.*, u.name as user_name, u.email as user_email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    )
    .all() as (OrderRow & {
    user_name: string | null;
    user_email: string | null;
    item_count: number;
  })[];

  return rows.map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    status: o.status,
    total: o.total,
    paymentMethod: o.payment_method,
    customerName: o.shipping_name ?? o.user_name,
    customerEmail: o.guest_email ?? o.user_email,
    createdAt: o.created_at,
    itemCount: o.item_count,
  }));
}

export function getAdminOrder(orderId: string): Order | null {
  const db = getDb();
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as
    | OrderRow
    | undefined;
  if (!order) return null;

  const items = db
    .prepare(
      `SELECT product_name, quantity, unit_price FROM order_items WHERE order_id = ?`
    )
    .all(orderId) as { product_name: string; quantity: number; unit_price: number }[];

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    paymentMethod: order.payment_method,
    fpsRef: order.fps_ref,
    shippingName: order.shipping_name,
    shippingPhone: order.shipping_phone,
    shippingAddress: order.shipping_address,
    shippingMethod: order.shipping_method,
    createdAt: order.created_at,
    items: items.map((i) => ({
      productName: i.product_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
    })),
  };
}

export type ProductInput = {
  slug: string;
  name: string;
  shortDesc?: string | null;
  description?: string | null;
  price: number;
  sku?: string | null;
  stock: number;
  categoryId?: string | null;
  brand?: string | null;
  vehicleModels?: string | null;
  imageUrl?: string | null;
  badges?: string;
  featured?: boolean;
};

export function createProduct(input: ProductInput): Product {
  const db = getDb();
  const id = `p-${randomUUID().slice(0, 8)}`;
  db.prepare(
    `INSERT INTO products (id, slug, name, short_desc, description, price, sku, stock,
      category_id, brand, vehicle_models, image_url, badges, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.slug,
    input.name,
    input.shortDesc ?? null,
    input.description ?? null,
    input.price,
    input.sku ?? null,
    input.stock,
    input.categoryId ?? null,
    input.brand ?? null,
    input.vehicleModels ?? null,
    input.imageUrl ?? null,
    input.badges ?? null,
    input.featured ? 1 : 0
  );
  return mapProductRow(db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow);
}

export function updateProduct(id: string, input: ProductInput): Product | null {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE products SET slug=?, name=?, short_desc=?, description=?, price=?, sku=?, stock=?,
      category_id=?, brand=?, vehicle_models=?, image_url=?, badges=?, featured=?
     WHERE id=?`
  ).run(
    input.slug,
    input.name,
    input.shortDesc ?? null,
    input.description ?? null,
    input.price,
    input.sku ?? null,
    input.stock,
    input.categoryId ?? null,
    input.brand ?? null,
    input.vehicleModels ?? null,
    input.imageUrl ?? null,
    input.badges ?? null,
    input.featured ? 1 : 0,
    id
  );
  return mapProductRow(db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow);
}

export function deleteProduct(id: string): boolean {
  const db = getDb();
  const r = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return r.changes > 0;
}

export function updateOrderStatus(orderId: string, status: string): boolean {
  const db = getDb();
  const r = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);
  return r.changes > 0;
}

export function updateOrderFpsRef(orderId: string, fpsRef: string): boolean {
  const db = getDb();
  const r = db.prepare("UPDATE orders SET fps_ref = ? WHERE id = ?").run(fpsRef, orderId);
  return r.changes > 0;
}

export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  isAdmin: boolean;
  createdAt: string;
};

export function listUsers(): AdminUserRow[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, email, name, phone, COALESCE(is_admin,0) as is_admin, created_at
       FROM users ORDER BY created_at DESC`
    )
    .all() as {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    is_admin: number;
    created_at: string;
  }[];
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    phone: r.phone,
    isAdmin: r.is_admin === 1,
    createdAt: r.created_at,
  }));
}
