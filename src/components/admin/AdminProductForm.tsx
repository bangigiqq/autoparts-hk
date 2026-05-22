"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types";
import type { CategoryWithMeta } from "@/lib/admin-category-types";
import {
  CATEGORY_ROOT_IDS,
  CATEGORY_TYPE_LABELS,
} from "@/lib/category-constants";

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
    imageUrl: p?.imageUrl ?? "/products/door-lock.svg",
    badges: p?.badges?.join(",") ?? "",
    featured: p?.featured ?? false,
  };
}

export function AdminProductForm({
  productId,
  initial,
  categoryOptions = [],
  initialCategoryIds = [],
}: {
  productId?: string;
  initial?: Product | null;
  categoryOptions?: CategoryWithMeta[];
  initialCategoryIds?: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectableCategories = categoryOptions.filter(
    (c) => !CATEGORY_ROOT_IDS.has(c.id)
  );

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
      {opts?.hint && <span className="text-xs text-slate-500">{opts.hint}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4 bg-white rounded-xl border p-6">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {field("商品名稱 *", "name")}
        {field("網址代稱 (slug) *", "slug", { hint: "例：honda-freed-kit" })}
        {field("售價 (HKD) *", "price", { type: "number" })}
        {field("庫存 *", "stock", { type: "number" })}
        {field("SKU", "sku")}
        {field("品牌", "brand")}
        {field("適用車型", "vehicleModels")}
        {field("圖片路徑", "imageUrl", { hint: "例：/products/door-lock.svg" })}
        {field("標籤", "badges", { hint: "逗號分隔，例：免運,推薦" })}
      </div>
      {field("簡短描述", "shortDesc")}
      {field("詳細描述", "description", { rows: 5 })}

      {selectableCategories.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">商品分類（可多選）</p>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 p-3 space-y-3">
            {(["function", "brand", "monitor"] as const).map((t) => {
              const group = selectableCategories.filter((c) => c.type === t);
              if (!group.length) return null;
              return (
                <div key={t}>
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    {CATEGORY_TYPE_LABELS[t]}
                  </p>
                  <div className="space-y-1">
                    {group.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={categoryIds.includes(c.id)}
                          onChange={() => toggleCategory(c.id)}
                          className="rounded"
                        />
                        <span style={{ paddingLeft: `${c.depth * 8}px` }}>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="rounded"
        />
        設為精選商品
      </label>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {saving ? "儲存中…" : "儲存商品"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-2 text-sm cursor-pointer"
        >
          取消
        </button>
      </div>
    </form>
  );
}
