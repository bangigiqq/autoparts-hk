import type { Product } from "@/types";
import {
  getHomeIncludeFeaturedProducts,
  listActiveHomeBanners,
  seedHomeBannersIfEmpty,
} from "./home-banners-db";

export type HomeBanner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image?: string;
  /** Tailwind gradient classes for slide background */
  gradient: string;
  accent?: string;
};

function productToBanner(p: Product): HomeBanner {
  const short = p.shortDesc ?? p.brand ?? "";
  return {
    id: `product-${p.id}`,
    title: p.name.length > 42 ? `${p.name.slice(0, 40)}…` : p.name,
    subtitle: short,
    cta: "立即選購",
    href: `/products/${p.slug}`,
    image: p.imageUrl ?? undefined,
    gradient: "from-slate-800 via-slate-700 to-red-900",
    accent: p.badges[0] ?? "精選推薦",
  };
}

/** 首頁輪播：後台廣告 + 可選精選商品 */
export function getHomeBanners(featured: Product[]): HomeBanner[] {
  seedHomeBannersIfEmpty();
  const manual = listActiveHomeBanners();
  if (!getHomeIncludeFeaturedProducts()) {
    return manual;
  }
  const productBanners = featured.slice(0, 4).map(productToBanner);
  return [...manual, ...productBanners];
}
