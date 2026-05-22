import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice, stars } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card-hover group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Link href={`/products/${product.slug}`} className="relative aspect-square bg-slate-50 cursor-pointer">
        <Image
          src={product.imageUrl || "/products/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {product.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.badges.map((b) => (
              <span
                key={b}
                className="rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-xs text-slate-500 uppercase tracking-wide">{product.brand}</p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 hover:text-red-600 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        {product.reviewCount ? (
          <p className="mt-1 text-xs text-amber-600">
            {stars(product.avgRating ?? 0)} ({product.reviewCount})
          </p>
        ) : null}
        <p className="mt-auto pt-3 text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-2 block text-center rounded-lg border border-slate-300 py-2 text-sm font-medium hover:border-red-600 hover:text-red-600 cursor-pointer"
        >
          查看詳情
        </Link>
      </div>
    </article>
  );
}
