"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "總覽", exact: true },
  { href: "/admin/banners", label: "首頁廣告" },
  { href: "/admin/products", label: "商品管理" },
  { href: "/admin/categories", label: "分類管理" },
  { href: "/admin/orders", label: "訂單管理" },
  { href: "/admin/users", label: "會員列表" },
];

export function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-56 shrink-0 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link href="/admin" className="text-lg font-bold">
            欣榮<span className="text-red-400">後台</span>
          </Link>
          <p className="text-xs text-slate-400 mt-1 truncate">{user.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-red-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-700 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white"
          >
            查看前台 ↗
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white cursor-pointer"
          >
            登出
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            歡迎，<span className="font-medium text-slate-900">{user.name}</span>
          </p>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
