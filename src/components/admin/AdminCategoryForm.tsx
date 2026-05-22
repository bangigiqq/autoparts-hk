"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FlatCategory } from "@/lib/categories";
import { CATEGORY_TYPE_LABELS } from "@/lib/category-constants";

type FormState = {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  parentId: string;
  type: "function" | "brand" | "monitor";
  sortOrder: string;
};

function defaultParent(type: string, parents: FlatCategory[]): string {
  const root =
    type === "function" ? "fn-root" : type === "brand" ? "br-root" : "mon-root";
  return parents.some((p) => p.id === root) ? root : (parents[0]?.id ?? "");
}

export function AdminCategoryForm({
  categoryId,
  initial,
  parentOptions,
  defaultType = "function",
}: {
  categoryId?: string;
  initial?: FlatCategory | null;
  parentOptions: FlatCategory[];
  defaultType?: "function" | "brand" | "monitor";
}) {
  const router = useRouter();
  const type = (initial?.type ?? defaultType) as "function" | "brand" | "monitor";

  const [form, setForm] = useState<FormState>(() => ({
    id: initial?.id ?? "",
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    nameJa: initial?.nameJa ?? "",
    parentId:
      initial?.parentId ??
      defaultParent(
        type,
        parentOptions.filter((p) => p.type === type)
      ),
    type,
    sortOrder: initial ? String(initial.sortOrder) : "99",
  }));

  const parentsForType = useMemo(
    () => parentOptions.filter((p) => p.type === form.type),
    [parentOptions, form.type]
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isRoot = categoryId
    ? ["fn-root", "br-root", "mon-root"].includes(categoryId)
    : false;

  const parentLabel = (p: FlatCategory) => {
    const depth = parentOptions.filter((x) => x.type === type);
    const byId = new Map(depth.map((c) => [c.id, c]));
    let d = 0;
    let cur = byId.get(p.id);
    while (cur?.parentId) {
      d++;
      cur = byId.get(cur.parentId);
    }
    return `${"　".repeat(d)}${p.name}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      nameJa: form.nameJa.trim() || null,
      parentId: form.parentId || null,
      type: form.type,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
      ...(categoryId ? {} : { id: form.id.trim() || undefined }),
    };

    const url = categoryId
      ? `/api/admin/categories/${categoryId}`
      : "/api/admin/categories";
    const method = categoryId ? "PATCH" : "POST";

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
    router.push(`/admin/categories?type=${form.type}`);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 bg-white rounded-xl border p-6">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {!categoryId ? (
        <label className="block">
          <span className="text-sm font-medium text-slate-700">分類類型 *</span>
          <select
            value={form.type}
            onChange={(e) => {
              const newType = e.target.value as FormState["type"];
              const opts = parentOptions.filter((p) => p.type === newType);
              setForm({
                ...form,
                type: newType,
                parentId: defaultParent(newType, opts),
              });
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {Object.entries(CATEGORY_TYPE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          分類類型：
          <span className="font-medium text-slate-900">
            {CATEGORY_TYPE_LABELS[form.type]}
          </span>
          <span className="ml-3 text-slate-400">ID: {categoryId}</span>
        </div>
      )}

      {!categoryId && (
        <label className="block">
          <span className="text-sm font-medium text-slate-700">自訂 ID（選填）</span>
          <input
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="留空則依 slug 自動產生，例：fn-my-part"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      )}

      <label className="block">
        <span className="text-sm font-medium text-slate-700">分類名稱 *</span>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">日文名稱（選填）</span>
        <input
          value={form.nameJa}
          onChange={(e) => setForm({ ...form, nameJa: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">網址代稱 (slug) *</span>
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          disabled={isRoot}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">上層分類 *</span>
        <select
          required
          value={form.parentId}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
          disabled={isRoot}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
        >
          {parentsForType.map((p) => (
            <option key={p.id} value={p.id}>
              {parentLabel(p)}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">排序（數字愈小愈前）</span>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {saving ? "儲存中…" : "儲存分類"}
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
