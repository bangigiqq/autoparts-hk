"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types";
import type { CategoryWithMeta } from "@/lib/admin-category-types";
import type { ProductRichContent } from "@/lib/product-content-types";
import { CATEGORY_ROOT_IDS, CATEGORY_TYPE_LABELS } from "@/lib/category-constants";
import { AdminProductRichPanel } from "./AdminProductRichPanel";

type Tab = "basic" | "page" | "gallery" | "features";

type FormState = {
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  price: string;
  sku: string;
  stock: string;
  brand: string;
  vehicleModels: string;
  imageUrl: string;
  badges: string;
  featured: boolean;
};

function toForm(p?: Product | null): FormState {
  return {
    slug: p?.slug ?? "",
    name: p?.name ?? "",
    shortDesc: p?.shortDesc ?? "",
    description: p?.description ?? "",
    price: p ? String(p.price) : "",
    sku: p?.sku ?? "",
    stock: p ? String(p.stock) : "99",
    brand: p?.brand ?? "",
    vehicleModels: p?.vehicleModels ?? "",
    imageUrl: p?.imageUrl ?? "/products/placeholder.svg",
    badges: p?.badges?.join(",") ?? "",
    featured: p?.featured ?? false,
  };
}

const TABS: { key: Tab; label: string }[] = [
  { key: "basic", label: "基本資料" },
  { key: "page", label: "說明頁" },
  { key: "gallery", label: "圖版" },
  { key: "features", label: "功能展示" },
];

export function AdminProductEditor({
  productId,
  initial,
  initialRich,
  categoryOptions = [],
  initialCategoryIds = [],
}: {
  productId?: string;
  initial?: Product | null;
  initialRich: ProductRichContent;
  categoryOptions?: CategoryWithMeta[];
  initialCategoryIds?: string[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("basic");
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [rich, setRich] = useState<ProductRichContent>(initialRich);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      shortDesc: form.shortDesc || undefined,
      description: form.description || undefined,
      price: parseInt(form.price, 10),
      sku: form.sku || undefined,
      stock: parseInt(form.stock, 10),
      brand: form.brand || undefined,
      vehicleModels: form.vehicleModels || undefined,
      imageUrl: form.imageUrl || undefined,
      badges: form.badges || undefined,
      featured: form.featured,
      categoryIds,
      richContent: rich,
    };

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "儲存失敗");
      return;
    }
    if (!productId && data.product?.id) {
      router.push(`/admin/products/${data.product.id}`);
      router.refresh();
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  const field = (
    label: string,
    key: keyof FormState,
    opts?: { type?: string; rows?: number; hint?: string }
  ) => (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {opts?.rows ? (
        <textarea
          rows={opts.rows}
          value={String(form[key])}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          type={opts?.type ?? "text"}
          value={String(form[key])}
          onChange={(e) =>
            setForm({
              ...form,
              [key]:
                key === "featured"
                  ? (e.target as HTMLInputElement).checked
                  : e.target.value,
            })
          }
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      )}
      {opts?.hint && <p className="text-xs text-slate-500 mt-1">{opts.hint}</p>}
    </label>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
              tab === t.key
                ? "bg-red-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
            {t.key === "gallery" && rich.gallery.length > 0 && (
              <span className="ml-1 opacity-80">({rich.gallery.length})</span>
            )}
            {t.key === "features" && rich.features.length > 0 && (
              <span className="ml-1 opacity-80">({rich.features.length})</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="bg-white rounded-xl border p-6">
        {tab === "basic" && (
          <div className="max-w-2xl space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {field("商品名稱 *", "name")}
              {field("網址代稱 (slug) *", "slug", { hint: "例：honda-freed-kit" })}
              {field("售價 (HKD) *", "price", { type: "number" })}
              {field("庫存 *", "stock", { type: "number" })}
              {field("SKU", "sku")}
              {field("品牌", "brand")}
              {field("適用車型", "vehicleModels")}
              {field("主圖路徑", "imageUrl", {
                hint: "列表與輪播用，例：/products/door-lock.svg",
              })}
              {field("標籤", "badges", { hint: "逗號分隔：免運,推薦" })}
            </div>
            {field("簡短描述", "shortDesc")}
            {field("商品摘要（無豐富說明時顯示）", "description", { rows: 4 })}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              設為精選商品
            </label>
            {categoryOptions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">商品分類</p>
                <div className="max-h-40 overflow-y-auto rounded-lg border p-3 space-y-2 text-sm">
                  {(["function", "brand", "monitor"] as const).map((t) => {
                    const group = categoryOptions.filter(
                      (c) => c.type === t && !CATEGORY_ROOT_IDS.has(c.id)
                    );
                    if (!group.length) return null;
                    return (
                      <div key={t}>
                        <p className="text-xs font-semibold text-slate-500">
                          {CATEGORY_TYPE_LABELS[t]}
                        </p>
                        {group.map((c) => (
                          <label key={c.id} className="flex items-center gap-2 py-0.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={categoryIds.includes(c.id)}
                              onChange={() =>
                                setCategoryIds((prev) =>
                                  prev.includes(c.id)
                                    ? prev.filter((x) => x !== c.id)
                                    : [...prev, c.id]
                                )
                              }
                              className="rounded"
                            />
                            {c.name}
                          </label>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {(tab === "page" || tab === "gallery" || tab === "features") && (
          <AdminProductRichPanel
            tab={tab}
            rich={rich}
            onChange={setRich}
            mainImageUrl={form.imageUrl}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {saving ? "儲存中…" : "儲存全部內容"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-2.5 text-sm cursor-pointer"
        >
          取消
        </button>
        {productId && (
          <a
            href={`/products/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm text-slate-600 hover:text-red-600"
          >
            預覽前台 ↗
          </a>
        )}
      </div>
    </form>
  );
}
