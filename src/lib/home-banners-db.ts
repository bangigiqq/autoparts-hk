import { randomUUID } from "crypto";
import { getDb } from "./db";
import { GRADIENT_PRESETS } from "./home-banner-constants";
import type { HomeBanner } from "./home-banners";

export { GRADIENT_PRESETS } from "./home-banner-constants";

const SETTING_INCLUDE_FEATURED = "home_include_featured_products";

type BannerRow = {
  id: string;
  title: string;
  subtitle: string | null;
  cta: string;
  href: string;
  image_url: string | null;
  gradient: string;
  accent: string | null;
  sort_order: number;
  enabled: number;
};

export type HomeBannerRecord = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  imageUrl: string | null;
  gradient: string;
  accent: string | null;
  sortOrder: number;
  enabled: boolean;
};

function rowToRecord(row: BannerRow): HomeBannerRecord {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    cta: row.cta,
    href: row.href,
    imageUrl: row.image_url,
    gradient: row.gradient,
    accent: row.accent,
    sortOrder: row.sort_order,
    enabled: row.enabled === 1,
  };
}

function recordToHomeBanner(r: HomeBannerRecord): HomeBanner {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    cta: r.cta,
    href: r.href,
    image: r.imageUrl ?? undefined,
    gradient: r.gradient,
    accent: r.accent ?? undefined,
  };
}

const DEFAULT_BANNERS: Omit<HomeBannerRecord, "id">[] = [
  {
    title: "欣榮汽配專門店",
    subtitle: "屯門萬能閣 G7 地鋪 · 專業汽車機油與電裝升級套件",
    cta: "瀏覽全部商品",
    href: "/products",
    imageUrl: null,
    gradient: "from-slate-900 via-slate-800 to-red-950",
    accent: "門市自取 · 轉數快付款",
    sortOrder: 10,
    enabled: true,
  },
  {
    title: "轉數快 FPS 付款",
    subtitle: "下單後提交參考編號，WhatsApp 54495722 傳送付款截圖即可",
    cta: "了解付款方式",
    href: "/contact",
    imageUrl: null,
    gradient: "from-red-700 via-red-600 to-orange-600",
    accent: "安全便捷",
    sortOrder: 20,
    enabled: true,
  },
  {
    title: "會員專區上線",
    subtitle: "註冊即可追蹤訂單、管理收藏清單",
    cta: "免費註冊",
    href: "/register",
    imageUrl: null,
    gradient: "from-indigo-900 via-slate-800 to-slate-900",
    accent: "示範帳號 demo@example.com",
    sortOrder: 30,
    enabled: true,
  },
];

export function seedHomeBannersIfEmpty(db = getDb()) {
  const count = db.prepare("SELECT COUNT(*) as c FROM home_banners").get() as {
    c: number;
  };
  if (count.c > 0) return false;

  const insert = db.prepare(
    `INSERT INTO home_banners (id, title, subtitle, cta, href, image_url, gradient, accent, sort_order, enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
  );
  const ids = ["store", "fps", "member"];
  const tx = db.transaction(() => {
    DEFAULT_BANNERS.forEach((b, i) => {
      insert.run(
        ids[i],
        b.title,
        b.subtitle,
        b.cta,
        b.href,
        b.imageUrl,
        b.gradient,
        b.accent,
        b.sortOrder
      );
    });
    db.prepare(
      `INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)`
    ).run(SETTING_INCLUDE_FEATURED, "1");
  });
  tx();
  return true;
}

export function getHomeIncludeFeaturedProducts(db = getDb()): boolean {
  seedHomeBannersIfEmpty(db);
  const row = db
    .prepare("SELECT value FROM site_settings WHERE key = ?")
    .get(SETTING_INCLUDE_FEATURED) as { value: string } | undefined;
  return row?.value !== "0";
}

export function setHomeIncludeFeaturedProducts(enabled: boolean, db = getDb()) {
  db.prepare(
    `INSERT INTO site_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(SETTING_INCLUDE_FEATURED, enabled ? "1" : "0");
}

export function listActiveHomeBanners(db = getDb()): HomeBanner[] {
  seedHomeBannersIfEmpty(db);
  const rows = db
    .prepare(
      `SELECT id, title, subtitle, cta, href, image_url, gradient, accent, sort_order, enabled
       FROM home_banners WHERE enabled = 1
       ORDER BY sort_order, title`
    )
    .all() as BannerRow[];
  return rows.map((r) => recordToHomeBanner(rowToRecord(r)));
}

export function listAllHomeBannersAdmin(db = getDb()): HomeBannerRecord[] {
  seedHomeBannersIfEmpty(db);
  const rows = db
    .prepare(
      `SELECT id, title, subtitle, cta, href, image_url, gradient, accent, sort_order, enabled
       FROM home_banners ORDER BY sort_order, title`
    )
    .all() as BannerRow[];
  return rows.map(rowToRecord);
}

export function getHomeBannerRecord(id: string, db = getDb()): HomeBannerRecord | null {
  seedHomeBannersIfEmpty(db);
  const row = db
    .prepare(
      `SELECT id, title, subtitle, cta, href, image_url, gradient, accent, sort_order, enabled
       FROM home_banners WHERE id = ?`
    )
    .get(id) as BannerRow | undefined;
  return row ? rowToRecord(row) : null;
}

export type HomeBannerInput = {
  id?: string;
  title: string;
  subtitle?: string;
  cta: string;
  href: string;
  imageUrl?: string | null;
  gradient: string;
  accent?: string | null;
  sortOrder: number;
  enabled: boolean;
};

export function createHomeBanner(input: HomeBannerInput, db = getDb()): HomeBannerRecord {
  const id = input.id?.trim() || `banner-${randomUUID().slice(0, 8)}`;
  if (!input.title.trim()) throw new Error("請填寫標題");
  if (!input.href.trim()) throw new Error("請填寫連結");
  db.prepare(
    `INSERT INTO home_banners (id, title, subtitle, cta, href, image_url, gradient, accent, sort_order, enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.title.trim(),
    input.subtitle?.trim() ?? "",
    input.cta.trim() || "了解更多",
    input.href.trim(),
    input.imageUrl?.trim() || null,
    input.gradient.trim() || GRADIENT_PRESETS[0].value,
    input.accent?.trim() || null,
    input.sortOrder,
    input.enabled ? 1 : 0
  );
  return getHomeBannerRecord(id, db)!;
}

export function updateHomeBanner(
  id: string,
  input: Omit<HomeBannerInput, "id">,
  db = getDb()
): HomeBannerRecord {
  const existing = getHomeBannerRecord(id, db);
  if (!existing) throw new Error("找不到廣告");
  if (!input.title.trim()) throw new Error("請填寫標題");
  if (!input.href.trim()) throw new Error("請填寫連結");
  db.prepare(
    `UPDATE home_banners SET title = ?, subtitle = ?, cta = ?, href = ?, image_url = ?,
     gradient = ?, accent = ?, sort_order = ?, enabled = ? WHERE id = ?`
  ).run(
    input.title.trim(),
    input.subtitle?.trim() ?? "",
    input.cta.trim() || "了解更多",
    input.href.trim(),
    input.imageUrl?.trim() || null,
    input.gradient.trim() || GRADIENT_PRESETS[0].value,
    input.accent?.trim() || null,
    input.sortOrder,
    input.enabled ? 1 : 0,
    id
  );
  return getHomeBannerRecord(id, db)!;
}

export function deleteHomeBanner(id: string, db = getDb()) {
  const r = db.prepare("DELETE FROM home_banners WHERE id = ?").run(id);
  if (r.changes === 0) throw new Error("找不到廣告");
}
