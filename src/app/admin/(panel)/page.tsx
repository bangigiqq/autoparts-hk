import Link from "next/link";
import { getAdminStats } from "@/lib/admin";
import { formatPrice } from "@/lib/format";

export default function AdminDashboardPage() {
  const stats = getAdminStats();

  const cards = [
    { label: "商品總數", value: stats.productCount, href: "/admin/products" },
    { label: "訂單總數", value: stats.orderCount, href: "/admin/orders" },
    { label: "待處理訂單", value: stats.pendingOrders, href: "/admin/orders" },
    { label: "會員人數", value: stats.userCount, href: "/admin/users" },
    {
      label: "有效營業額",
      value: formatPrice(stats.revenueTotal),
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">總覽</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-red-300 hover:shadow-sm transition-shadow"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-xl border p-5 text-sm text-slate-600">
        <p className="font-medium text-slate-900 mb-2">快速操作</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <Link href="/admin/products/new" className="text-red-600 hover:underline">
              新增商品
            </Link>
          </li>
          <li>
            <Link href="/admin/banners" className="text-red-600 hover:underline">
              編輯首頁廣告輪播
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className="text-red-600 hover:underline">
              管理商品分類
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="text-red-600 hover:underline">
              查看所有訂單
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
