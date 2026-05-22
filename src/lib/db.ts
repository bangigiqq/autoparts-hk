import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "shop.db");

const globalForDb = globalThis as typeof globalThis & { __db?: Database.Database };

function createDb() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function getDb(): Database.Database {
  if (!globalForDb.__db) {
    globalForDb.__db = createDb();
    initSchema(globalForDb.__db);
  }
  return globalForDb.__db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_ja TEXT,
      slug TEXT UNIQUE NOT NULL,
      parent_id TEXT,
      type TEXT NOT NULL DEFAULT 'function',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_categories (
      product_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      PRIMARY KEY (product_id, category_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      short_desc TEXT,
      description TEXT,
      price INTEGER NOT NULL,
      sku TEXT,
      stock INTEGER DEFAULT 99,
      category_id TEXT,
      brand TEXT,
      vehicle_models TEXT,
      specs_json TEXT,
      image_url TEXT,
      badges TEXT,
      featured INTEGER DEFAULT 0,
      rich_content_json TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT,
      author_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number INTEGER NOT NULL,
      user_id TEXT,
      guest_email TEXT,
      status TEXT DEFAULT 'pending',
      subtotal INTEGER NOT NULL,
      shipping INTEGER NOT NULL,
      total INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      fps_ref TEXT,
      shipping_name TEXT,
      shipping_phone TEXT,
      shipping_address TEXT,
      shipping_method TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS order_seq (id INTEGER PRIMARY KEY CHECK (id = 1), last_num INTEGER DEFAULT 16394);
    INSERT OR IGNORE INTO order_seq (id, last_num) VALUES (1, 16394);

    CREATE TABLE IF NOT EXISTS home_banners (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      cta TEXT NOT NULL DEFAULT '了解更多',
      href TEXT NOT NULL,
      image_url TEXT,
      gradient TEXT NOT NULL DEFAULT 'from-slate-900 via-slate-800 to-red-950',
      accent TEXT,
      sort_order INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  try {
    db.exec(`ALTER TABLE categories ADD COLUMN name_ja TEXT`);
  } catch {
    /* column exists */
  }
  try {
    db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`);
  } catch {
    /* column exists */
  }
  try {
    db.exec(`ALTER TABLE products ADD COLUMN rich_content_json TEXT`);
  } catch {
    /* column exists */
  }
}

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone: string | null;
  is_admin: number;
  created_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_desc: string | null;
  description: string | null;
  price: number;
  sku: string | null;
  stock: number;
  category_id: string | null;
  brand: string | null;
  vehicle_models: string | null;
  specs_json: string | null;
  image_url: string | null;
  badges: string | null;
  featured: number;
  rich_content_json: string | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  order_number: number;
  user_id: string | null;
  guest_email: string | null;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  fps_ref: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_method: string | null;
  created_at: string;
};
