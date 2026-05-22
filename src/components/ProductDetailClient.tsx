"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import {
  DIP_SWITCH_ROWS,
  SPECS_HIDDEN_WHEN_RICH,
  type ProductRichContent,
} from "@/lib/product-content-types";
import { formatPrice, stars } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { ProductGallery } from "./ProductGallery";
import { FeatureShowcase } from "./FeatureShowcase";
import { CartAddedModal } from "./CartAddedModal";
import { ScrollReveal } from "./ScrollReveal";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
};

type RelatedCat = {
  id: string;
  slug: string;
  name: string;
  name_ja: string | null;
  type: string;
};

export function ProductDetailClient({
  product,
  reviews,
  relatedCategories = [],
  richContent,
}: {
  product: Product;
  reviews: Review[];
  relatedCategories?: RelatedCat[];
  richContent?: ProductRichContent | null;
}) {
  const [qty, setQty] = useState(1);
  const [cartModal, setCartModal] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

  const galleryImages = richContent?.gallery ?? [];
  const hasFeatures = !!richContent?.features?.length;
  const showDipSwitch = richContent?.showDipSwitch && hasFeatures;
  const shopBody = hasFeatures && richContent?.shopMessage
    ? richContent.shopMessage
    : product.description;
  const visibleSpecs = product.specs
    ? Object.entries(product.specs).filter(
        ([k]) => !hasFeatures || !SPECS_HIDDEN_WHEN_RICH.has(k)
      )
    : [];

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      qty
    );
    setCartModal(true);
  };

  const toggleWishlist = async () => {
    const res = await fetch("/api/wishlist", {
      method: wishlisted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    if (res.status === 401) {
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }
    if (res.ok) setWishlisted(!wishlisted);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <CartAddedModal
        open={cartModal}
        onClose={() => setCartModal(false)}
        productName={product.name}
      />

      <nav className="text-sm text-slate-500 mb-6 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-red-600">
          首頁
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-red-600">
          商品目錄
        </Link>
        {relatedCategories.slice(0, 3).map((c) => (
          <span key={c.id} className="flex items-center gap-1">
            <span>/</span>
            <Link
              href={`/products?mode=${c.type === "brand" ? "brand" : "function"}&cat=${c.slug}`}
              className="hover:text-red-600"
            >
              {c.name}
            </Link>
          </span>
        ))}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductGallery
          images={galleryImages}
          fallback={product.imageUrl || "/products/placeholder.svg"}
          productName={product.name}
        />

        <div className="lg:sticky lg:top-28">
          <div className="flex flex-wrap gap-2">
            {product.badges.includes("免運") && (
              <span className="badge-shine rounded px-2 py-0.5 text-xs font-bold text-white">
                免運費
              </span>
            )}
            {(product.badges.includes("推薦") || product.badges.includes("熱賣")) && (
              <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">
                推薦
              </span>
            )}
            {product.badges
              .filter((b) => !["免運", "推薦", "熱賣"].includes(b))
              .map((b) => (
                <span
                  key={b}
                  className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                >
                  {b}
                </span>
              ))}
          </div>

          <h1 className="mt-3 text-xl md:text-2xl font-bold text-slate-900 leading-snug">
            {product.name}
          </h1>

          {product.reviewCount ? (
            <p className="mt-2 text-amber-600 text-sm">
              {stars(product.avgRating ?? 0)}（{product.reviewCount} 則評價）
            </p>
          ) : null}

          <p className="mt-4 text-4xl font-bold text-[var(--enlarge-red)]">
            {formatPrice(product.price)}
            <span className="text-base font-normal text-slate-500 ml-2">含稅</span>
          </p>

          {product.sku && (
            <p className="mt-2 text-sm text-slate-600">
              商品編號：<strong className="font-mono">{product.sku}</strong>
            </p>
          )}

          <p className="mt-2 text-sm text-emerald-700 font-medium">
            下午 3 時前訂單，當日發貨
          </p>

          {product.shortDesc && (
            <p className="mt-4 text-slate-700 text-sm leading-relaxed border-l-4 border-red-600 pl-4">
              {product.shortDesc}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium">數量</span>
            <div className="flex items-center rounded-lg border-2 border-slate-300">
              <button
                type="button"
                className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-lg"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-14 text-center border-x-2 border-slate-300 py-2 text-sm"
              />
              <button
                type="button"
                className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-lg"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-lg bg-[var(--enlarge-red)] px-6 py-4 text-lg font-bold text-white hover:brightness-110 shadow-lg cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              加入購物車
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleWishlist}
                className={`flex-1 rounded-lg border-2 py-3 font-medium cursor-pointer transition-colors ${
                  wishlisted
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-slate-300 hover:border-red-600"
                }`}
              >
                {wishlisted ? "♥ 已收藏" : "♡ 加入收藏"}
              </button>
              <Link
                href="/contact"
                className="flex-1 rounded-lg border-2 border-slate-300 py-3 text-center text-sm font-medium hover:border-slate-500 cursor-pointer"
              >
                聯絡我們
              </Link>
            </div>
          </div>

          <div className="mt-4 flex gap-3 text-xs text-slate-500">
            <span>楽天</span>
            <span>·</span>
            <span>Yahoo</span>
            <span>·</span>
            <span>Amazon</span>
            <span className="text-slate-400">（外部連結示範）</span>
          </div>

          {product.vehicleModels && (
            <dl className="mt-6 rounded-xl bg-slate-50 border p-4 text-sm grid gap-2">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <dt className="text-slate-500">適用車種</dt>
                <dd className="font-medium">{product.vehicleModels}</dd>
              </div>
              {product.brand && (
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <dt className="text-slate-500">品牌</dt>
                  <dd className="font-medium">{product.brand}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>

      {relatedCategories.length > 0 && (
        <ScrollReveal className="mt-10">
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-500">相關分類</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {relatedCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products?mode=${c.type === "brand" ? "brand" : c.type === "monitor" ? "monitor" : "function"}&cat=${c.slug}`}
                    className="inline-block rounded-full border-2 border-slate-200 bg-slate-50 px-4 py-1.5 text-sm hover:border-red-600 hover:text-red-600 cursor-pointer"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>
      )}

      {hasFeatures && richContent && <FeatureShowcase content={richContent} />}

      {showDipSwitch && (
        <ScrollReveal className="mt-16">
          <section className="rounded-2xl border-2 border-slate-800 overflow-hidden">
            <div className="bg-slate-800 text-white px-6 py-4 font-bold">
              功能切換（撥動開關）
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left">撥桿</th>
                    <th className="px-4 py-3 text-left">項目</th>
                    <th className="px-4 py-3 text-left">上</th>
                    <th className="px-4 py-3 text-left">下（初期）</th>
                  </tr>
                </thead>
                <tbody>
                  {DIP_SWITCH_ROWS.map((row) => (
                    <tr key={row.lever} className="border-t">
                      <td className="px-4 py-3 font-mono font-bold">{row.lever}</td>
                      <td className="px-4 py-3">{row.label}</td>
                      <td className="px-4 py-3 text-emerald-700">{row.on}</td>
                      <td className="px-4 py-3 text-slate-600">{row.off}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-6 py-4 text-xs text-amber-800 bg-amber-50">
              ※切換時必須在控制器斷開連接器狀態下操作
            </p>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal className="mt-16">
        <section>
          <h2 className="text-xl font-bold border-b-2 border-slate-800 pb-2">
            店舖說明
          </h2>
          <div className="mt-4 prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed">
            {shopBody}
          </div>
          {visibleSpecs.length > 0 && (
            <table className="mt-6 w-full max-w-2xl text-sm border border-slate-200 rounded-lg overflow-hidden">
              <tbody>
                {visibleSpecs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                    <th className="py-3 px-4 text-left text-slate-500 font-normal w-1/3 border-r">
                      {k}
                    </th>
                    <td className="py-3 px-4">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </ScrollReveal>

      <ScrollReveal className="mt-16">
        <section>
          <h2 className="text-xl font-bold border-b-2 pb-2 flex items-center gap-2">
            顧客評價
            {reviews.length > 0 && (
              <span className="text-amber-600 text-base">{stars(product.avgRating ?? 5)}</span>
            )}
          </h2>
          <ul className="mt-6 space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-xl border-2 border-slate-100 p-5 bg-white shadow-sm">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{r.author_name}</span>
                  <span className="text-slate-500">{r.created_at.slice(0, 10)}</span>
                </div>
                <p className="text-amber-600 text-sm mt-1">{stars(r.rating)}</p>
                {r.title && <p className="font-bold mt-2 text-lg">{r.title}</p>}
                <p className="mt-2 text-slate-700">{r.body}</p>
              </li>
            ))}
            {reviews.length === 0 && (
              <p className="text-slate-500 py-8 text-center">暫無評價，歡迎購買後分享心得。</p>
            )}
          </ul>
        </section>
      </ScrollReveal>
    </div>
  );
}
