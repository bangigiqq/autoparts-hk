import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getHomeBanners } from "@/lib/home-banners";
import { HomeHeroCarousel } from "@/components/HomeHeroCarousel";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  const featured = getProducts({ featured: true });
  const displayProducts =
    featured.length > 0 ? featured : getProducts().slice(0, 8);
  const banners = getHomeBanners(featured.length > 0 ? featured : displayProducts);

  return (
    <>
      <HomeHeroCarousel banners={banners} />

      <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-red-600 text-sm font-semibold tracking-wide">FEATURED</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">精選商品</h2>
            <p className="text-slate-500 text-sm mt-1">店長推薦 · 熱賣好物</p>
          </div>
          <Link
            href="/products"
            className="text-red-600 text-sm font-medium hover:underline shrink-0"
          >
            查看全部商品 →
          </Link>
        </div>

        {displayProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            <p className="text-slate-600">暫無精選商品</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-red-600 font-medium hover:underline"
            >
              瀏覽商品目錄
            </Link>
          </div>
        )}
      </section>

      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 grid sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl bg-white border p-4 text-center sm:text-left">
            <p className="font-bold text-slate-900">轉數快 FPS</p>
            <p className="mt-1 text-slate-500 text-xs">下單後提交參考編號即可</p>
          </div>
          <div className="rounded-xl bg-white border p-4 text-center sm:text-left">
            <p className="font-bold text-slate-900">屯門門市自取</p>
            <p className="mt-1 text-slate-500 text-xs">週一至六 10:00–19:00</p>
          </div>
          <div className="rounded-xl bg-white border p-4 text-center sm:text-left">
            <Link href="/register" className="font-bold text-red-600 hover:underline">
              會員註冊 →
            </Link>
            <p className="mt-1 text-slate-500 text-xs">訂單追蹤與收藏清單</p>
          </div>
        </div>
      </section>
    </>
  );
}
