import { getDb } from "./db";
import { hashPassword } from "./auth";
import { seedEnlargeCategories, linkProductCategories } from "./categories";
import { FREED_LOCK_CONTENT, serializeRichContent } from "./product-content-types";
import { repairCorruptedRichContent } from "./product-rich-db";
import { randomUUID } from "crypto";

const PRODUCT_CATEGORY_MAP: Record<string, string[]> = {
  "p-mobil5w30": ["fn-engine-oil", "br-universal"],
  "p-freed-lock": [
    "fn-speed-door-lock",
    "fn-engine-lock",
    "fn-auto-hazard",
    "fn-thank-hazard",
    "br-honda",
    "br-honda-freed",
    "mon-freed-2024",
  ],
  "p-shell-5w40": ["fn-engine-oil", "br-universal"],
  "p-varta-battery": ["fn-battery", "br-universal", "br-uni-battery-tester"],
};

export async function ensureAdminUser() {
  const db = getDb();
  const hash = await hashPassword("admin1234");
  db.prepare(
    `INSERT INTO users (id, email, password_hash, name, phone, is_admin)
     VALUES ('user-admin', 'admin@xinrong.hk', ?, '系統管理員', NULL, 1)
     ON CONFLICT(email) DO UPDATE SET
       password_hash = excluded.password_hash,
       is_admin = 1,
       name = excluded.name`
  ).run(hash);
}

export async function seedDatabase() {
  const db = getDb();
  await ensureAdminUser();
  repairCorruptedRichContent();

  const productCount = db.prepare("SELECT COUNT(*) as c FROM products").get() as {
    c: number;
  };

  seedEnlargeCategories(db);

  if (productCount.c > 0) {
    linkExistingProducts(db);
    return { seeded: false, categories: true };
  }

  const demoHash = await hashPassword("demo1234");

  const runSeed = db.transaction(() => {
    db.prepare(
      `INSERT OR IGNORE INTO users (id, email, password_hash, name, phone) VALUES (?, ?, ?, ?, ?)`
    ).run(randomUUID(), "demo@example.com", demoHash, "示範會員", "54495722");

    const products = [
      {
        id: "p-mobil5w30",
        slug: "mobil-1-5w30-4l",
        name: "MOBIL 美孚1號 (無比1號) 5W30 全合成機油 (4L)",
        short_desc: "全合成機油，適用多數汽油引擎",
        description:
          "美孚1號 5W-30 全合成機油，提供卓越抗磨保護與低溫流動性。建議更換週期請參考車廠手冊。",
        price: 360,
        sku: "MOBIL-5W30-4L",
        stock: 200,
        category_id: "fn-engine-oil",
        brand: "MOBIL",
        vehicle_models: "通用",
        image_url: "/products/mobil-oil.svg",
        badges: "熱賣,免運",
        featured: 1,
      },
      {
        id: "p-freed-lock",
        slug: "honda-freed-2024-door-lock-kit",
        name: "HONDA フリード 新型 2024 車速連動自動門鎖＆引擎待機鎖定＆自動危險燈 六合一套件",
        short_desc: "新型 FREED 專用｜六大功能合一｜含再鎖定",
        description:
          "新型 FREED（2024 年 6 月起）專用六合一門鎖套件。詳細功能說明請見下方「六大功能」區塊。",
        price: 6980,
        sku: "LOCK-16",
        stock: 15,
        category_id: "fn-speed-door-lock",
        brand: "HONDA",
        vehicle_models: "FREED 2024 GT系",
        specs_json: JSON.stringify({
          對應型式: "5BA-GT1~GT4 / 6AA-GT5~GT8",
          適用等級: "全等級",
        }),
        image_url: "/products/door-lock.svg",
        badges: "免運,推薦",
        featured: 1,
      },
      {
        id: "p-shell-5w40",
        slug: "shell-helix-5w40-4l",
        name: "SHELL 蜆殼 HELIX 5W40 全合成機油 (4L)",
        short_desc: "高性能全合成配方",
        description: "Shell Helix 全合成機油，清潔引擎沉積，延長引擎壽命。",
        price: 320,
        sku: "SHELL-5W40-4L",
        stock: 80,
        category_id: "fn-engine-oil",
        brand: "SHELL",
        vehicle_models: "通用",
        image_url: "/products/shell-oil.svg",
        badges: "新品",
        featured: 0,
      },
      {
        id: "p-varta-battery",
        slug: "varta-blue-dynamic-60ah",
        name: "VARTA 華達 Blue Dynamic 60Ah 汽車電池",
        short_desc: "德國品牌，即裝即用",
        description: "適用多數中小型房車，提供穩定啟動電流。",
        price: 880,
        sku: "VARTA-60AH",
        stock: 25,
        category_id: "fn-battery",
        brand: "VARTA",
        vehicle_models: "通用",
        image_url: "/products/battery.svg",
        badges: "",
        featured: 0,
      },
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (id, slug, name, short_desc, description, price, sku, stock,
        category_id, brand, vehicle_models, specs_json, image_url, badges, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of products) {
      insertProduct.run(
        p.id,
        p.slug,
        p.name,
        p.short_desc,
        p.description,
        p.price,
        p.sku,
        p.stock,
        p.category_id,
        p.brand,
        p.vehicle_models,
        p.specs_json ?? null,
        p.image_url,
        p.badges,
        p.featured
      );
      linkProductCategories(p.id, PRODUCT_CATEGORY_MAP[p.id] ?? [p.category_id], db);
    }

    db.prepare(`
      INSERT INTO reviews (id, product_id, user_id, author_name, rating, title, body)
      VALUES (?, ?, NULL, ?, ?, ?, ?)
    `).run(
      randomUUID(),
      "p-freed-lock",
      "まっちゃん",
      5,
      "完美！",
      "初裝很簡單，自動上鎖與 P 檔解鎖都完美運作。"
    );
  });

  try {
    runSeed();
  } catch (e) {
    const again = db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number };
    if (again.c > 0) return { seeded: false, categories: true };
    throw e;
  }

  return { seeded: true, categories: true };
}

function linkExistingProducts(db = getDb()) {
  const products = db.prepare("SELECT id, category_id FROM products").all() as {
    id: string;
    category_id: string | null;
  }[];
  for (const { id, category_id } of products) {
    const cats = PRODUCT_CATEGORY_MAP[id] ?? (category_id ? [category_id] : []);
    if (cats.length) {
      linkProductCategories(id, cats, db);
      db.prepare("UPDATE products SET category_id = ? WHERE id = ?").run(cats[0], id);
    }
  }

  db.prepare(
    `UPDATE products SET short_desc = ?, description = ?, specs_json = ?, rich_content_json = ?
     WHERE id = 'p-freed-lock'`
  ).run(
    "新型 FREED 專用｜六大功能合一｜含再鎖定",
    "新型 FREED（2024 年 6 月起）專用六合一門鎖套件。詳細功能說明請見下方「六大功能」區塊。",
    JSON.stringify({ 對應型式: "5BA-GT1~GT4 / 6AA-GT5~GT8", 適用等級: "全等級" }),
    serializeRichContent(FREED_LOCK_CONTENT)
  );
}
