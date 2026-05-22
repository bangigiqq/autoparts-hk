"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GRADIENT_PRESETS } from "@/lib/home-banner-constants";
import type { HomeBannerRecord } from "@/lib/home-banners-db";

type FormState = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  imageUrl: string;
  gradient: string;
  accent: string;
  sortOrder: string;
  enabled: boolean;
};

export function AdminBannerForm({
  bannerId,
  initial,
}: {
  bannerId?: string;
  initial?: HomeBannerRecord | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => ({
    id: initial?.id ?? "",
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    cta: initial?.cta ?? "了解更多",
    href: initial?.href ?? "/products",
    imageUrl: initial?.imageUrl ?? "",
    gradient: initial?.gradient ?? GRADIENT_PRESETS[0].value,
    accent: initial?.accent ?? "",
    sortOrder: initial ? String(initial.sortOrder) : "50",
    enabled: initial?.enabled ?? true,
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const presetValues = new Set(GRADIENT_PRESETS.map((p) => p.value));
  const gradientIsCustom = !presetValues.has(form.gradient);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      id: form.id.trim() || undefined,
      title: form.title,
      subtitle: form.subtitle,
      cta: form.cta,
      href: form.href,
      imageUrl: form.imageUrl.trim() || null,
      gradient: form.gradient,
      accent: form.accent.trim() || null,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
      enabled: form.enabled,
    };

    const url = bannerId
      ? `/api/admin/banners/${bannerId}`
      : "/api/admin/banners";
    const method = bannerId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "儲存失敗");
      return;
    }

    router.push("/admin/banners");
    router.refresh();
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl bg-white rounded-xl border p-6 space-y-5"
    >
      {!bannerId && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            識別碼 ID（選填）
          </label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="留空則自動產生"
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">僅英文、數字、連字號，建立後不可改</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            主標題 *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            副標題
          </label>
          <textarea
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            rows={2}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            按鈕文字 *
          </label>
          <input
            type="text"
            required
            value={form.cta}
            onChange={(e) => setForm({ ...form, cta: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            排序（數字愈小愈前）
          </label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            連結網址 *
          </label>
          <input
            type="text"
            required
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            placeholder="/products 或 https://..."
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            角標文字（選填）
          </label>
          <input
            type="text"
            value={form.accent}
            onChange={(e) => setForm({ ...form, accent: e.target.value })}
            placeholder="例如：門市自取 · 轉數快付款"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            背景圖片網址（選填）
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <p className="text-xs text-slate-400 mt-1">有圖片時會顯示於輪播右側；無圖則僅文字與漸層背景</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          背景漸層
        </label>
        <select
          value={gradientIsCustom ? "__custom__" : form.gradient}
          onChange={(e) => {
            if (e.target.value === "__custom__") return;
            setForm({ ...form, gradient: e.target.value });
          }}
          className="w-full rounded-lg border px-3 py-2 text-sm mb-2"
        >
          {GRADIENT_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
          <option value="__custom__">自訂…</option>
        </select>
        {(gradientIsCustom || form.gradient) && (
          <input
            type="text"
            value={form.gradient}
            onChange={(e) => setForm({ ...form, gradient: e.target.value })}
            placeholder="from-slate-900 via-slate-800 to-red-950"
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
          />
        )}
        <div
          className={`mt-2 h-12 rounded-lg bg-gradient-to-br ${form.gradient}`}
          aria-hidden
        />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          className="rounded"
        />
        啟用（顯示於首頁輪播）
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {saving ? "儲存中…" : "儲存"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          取消
        </button>
      </div>
    </form>
  );
}
