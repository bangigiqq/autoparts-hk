"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

type WishItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
};

export default function WishlistPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/wishlist")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login?redirect=/account/wishlist");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setItems(d.items);
        setLoading(false);
      });
  };

  useEffect(load, [router]);

  const remove = async (productId: string) => {
    await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="p-8 text-center text-slate-500">載入中…</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">收藏 / 已儲存產品</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-slate-600">尚未收藏任何商品。</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 rounded-xl border p-4 bg-white">
              <div className="relative h-20 w-20 shrink-0 rounded border">
                <Image
                  src={item.imageUrl || "/products/placeholder.svg"}
                  alt=""
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="font-medium hover:text-red-600">
                  {item.name}
                </Link>
                <p className="text-red-600 font-semibold">{formatPrice(item.price)}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="text-sm rounded-lg bg-red-600 text-white px-3 py-1 cursor-pointer"
                    onClick={() =>
                      addItem({
                        productId: item.productId,
                        slug: item.slug,
                        name: item.name,
                        price: item.price,
                        imageUrl: item.imageUrl,
                      })
                    }
                  >
                    加入購物車
                  </button>
                  <button
                    type="button"
                    className="text-sm text-slate-500 hover:text-red-600 cursor-pointer"
                    onClick={() => remove(item.productId)}
                  >
                    移除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
