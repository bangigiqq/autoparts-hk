import Link from "next/link";
import { listAllProducts } from "@/lib/admin";
import { formatPrice } from "@/lib/format";

export default function AdminProductsPage() {
  const products = listAllProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + 新增商品
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">商品</th>
              <th className="px-4 py-3">售價</th>
              <th className="px-4 py-3">庫存</th>
              <th className="px-4 py-3">精選</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.slug}</p>
                </td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.featured ? "是" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-red-600 hover:underline"
                  >
                    編輯內容
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-slate-500">尚無商品</p>
        )}
      </div>
    </div>
  );
}
