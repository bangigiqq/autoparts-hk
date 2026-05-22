import Link from "next/link";
import {
  CATEGORY_TYPE_LABELS,
  listCategoriesAdmin,
} from "@/lib/admin-categories";

const TABS = ["function", "brand", "monitor"] as const;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: typeParam } = await searchParams;
  const activeType =
    typeParam === "brand" || typeParam === "monitor" ? typeParam : "function";
  const categories = listCategoriesAdmin(activeType);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">分類管理</h1>
        <Link
          href={`/admin/categories/new?type=${activeType}`}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + 新增分類
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/admin/categories?type=${t}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeType === t
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-red-300"
            }`}
          >
            {CATEGORY_TYPE_LABELS[t]}
          </Link>
        ))}
      </div>

      <p className="text-sm text-slate-500 mb-4">
        共 {categories.length} 個分類。刪除前請先移走子分類及商品關聯。
      </p>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">名稱</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">排序</th>
              <th className="px-4 py-3">子類</th>
              <th className="px-4 py-3">商品</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const isRoot = ["fn-root", "br-root", "mon-root"].includes(c.id);
              return (
                <tr
                  key={c.id}
                  className={`border-t border-slate-100 hover:bg-slate-50 ${
                    isRoot ? "bg-slate-50/80" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span style={{ paddingLeft: `${c.depth * 16}px` }} className="inline-block">
                      <span className="font-medium text-slate-900">{c.name}</span>
                      {c.nameJa && (
                        <span className="block text-xs text-slate-400">{c.nameJa}</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3">{c.sortOrder}</td>
                  <td className="px-4 py-3">{c.childCount}</td>
                  <td className="px-4 py-3">{c.productCount}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/categories/${c.id}`}
                      className="text-red-600 hover:underline"
                    >
                      編輯
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
