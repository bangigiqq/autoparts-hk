"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

type User = { id: string; email: string; name: string } | null;

export function Header({
  onOpenMegaMenu,
  megaOpen,
  categoryCount,
}: {
  onOpenMegaMenu?: () => void;
  megaOpen?: boolean;
  categoryCount?: number;
} = {}) {
  const { count } = useCart();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center gap-3 md:gap-4">
        <Link
          href="/"
          className="text-lg md:text-xl font-bold text-slate-900 shrink-0 order-1"
        >
          欣榮<span className="text-red-600">汽配</span>
        </Link>

        <form
          action="/products"
          className="order-3 w-full md:order-2 md:flex-1 md:max-w-2xl flex"
        >
          <input
            name="q"
            type="search"
            placeholder="搜尋商品、車種、品牌…"
            className="w-full rounded-l-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="shrink-0 rounded-r-lg bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
          >
            搜尋
          </button>
        </form>

        <div className="order-2 md:order-3 ml-auto flex items-center gap-2 md:gap-3 text-sm font-medium shrink-0">
          {onOpenMegaMenu && (
            <button
              type="button"
              onClick={onOpenMegaMenu}
              aria-expanded={megaOpen}
              aria-haspopup="true"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                megaOpen
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-white hover:bg-red-600"
              }`}
            >
              <span>全商品分類</span>
              <svg
                className={`w-4 h-4 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {user ? (
            <>
              <Link href="/account" className="hidden sm:inline hover:text-red-600">
                會員專區
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hover:text-red-600 cursor-pointer"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="hover:text-red-600">
                註冊
              </Link>
              <Link href="/login" className="hover:text-red-600">
                登入
              </Link>
            </>
          )}

          <Link
            href="/cart"
            className="relative rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200 cursor-pointer"
          >
            購物車
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </div>

        {onOpenMegaMenu && (
          <button
            type="button"
            onClick={onOpenMegaMenu}
            aria-expanded={megaOpen}
            className={`order-4 w-full sm:hidden py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 ${
              megaOpen ? "bg-red-600 text-white" : "bg-slate-800 text-white"
            }`}
          >
            全商品分類
            {categoryCount != null && categoryCount > 0 && (
              <span className="text-xs opacity-80">（{categoryCount}+ 項）</span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${megaOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
