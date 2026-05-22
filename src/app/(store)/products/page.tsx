import { getProducts } from "@/lib/products";
import {
  buildCategoryTree,
  getCategoryBySlug,
  getCategoryBreadcrumb,
  getProductCountForCategoryType,
} from "@/lib/categories";
import { ProductCard } from "@/components/ProductCard";
import { CategorySidebar } from "@/components/CategorySidebar";
import Link from "next/link";

type SearchParams = {
  mode?: string;
  cat?: string;
  category?: string;
  q?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const mode =
    params.mode === "brand" || params.mode === "monitor"
      ? params.mode
      : "function";

  const activeCat = params.cat ?? params.category;
  const products = getProducts({
    cat: activeCat,
    search: params.q,
  });

  const tree = buildCategoryTree(mode);
  const modeProductTotal = getProductCountForCategoryType(mode);
  const currentCategory = activeCat ? getCategoryBySlug(activeCat) : null;
  const breadcrumb = currentCategory
    ? getCategoryBreadcrumb(currentCategory.id)
    : [];

  const modeTitles = {
    function: "依功能・安裝位置選購",
    brand: "依品牌・車型選購",
    monitor: "開發招募中",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-slate-500 mb-2">
        <Link href="/" className="hover:text-red-600">
          首頁
        </Link>
        <span className="mx-2">/</span>
        <span>商品目錄</span>
        {breadcrumb.map((c) => (
          <span key={c.id}>
            <span className="mx-2">/</span>
            <Link
              href={`/products?mode=${mode}&cat=${c.slug}`}
              className="hover:text-red-600"
            >
              {c.name}
            </Link>
          </span>
        ))}
      </nav>

      <h1 className="text-2xl font-bold">{modeTitles[mode]}</h1>
      {currentCategory && (
        <p className="mt-1 text-slate-600">
          {currentCategory.nameJa && (
            <span className="text-slate-400 mr-2">{currentCategory.nameJa}</span>
          )}
          共 {products.length} 件商品
        </p>
      )}
      {params.q && (
        <p className="mt-2 text-slate-600">
          搜尋「{params.q}」— 共 {products.length} 件
        </p>
      )}

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <CategorySidebar
          mode={mode}
          tree={tree}
          activeSlug={activeCat}
          modeProductTotal={modeProductTotal}
        />

        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="rounded-xl border bg-slate-50 py-16 text-center">
              <p className="text-slate-600">此分類暫無商品</p>
              <Link
                href="/products"
                className="mt-4 inline-block text-red-600 font-medium hover:underline"
              >
                瀏覽全部商品
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
