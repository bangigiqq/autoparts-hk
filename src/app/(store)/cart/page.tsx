"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">購物車</h1>
        <p className="mt-4 text-slate-600">尚未選購任何商品。</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 text-white font-medium hover:bg-red-700 cursor-pointer"
        >
          前往商品目錄
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">購物車</h1>
      <ul className="mt-8 divide-y">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-6">
            <div className="relative h-20 w-20 shrink-0 rounded border bg-slate-50">
              <Image
                src={item.imageUrl || "/products/placeholder.svg"}
                alt=""
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="font-medium hover:text-red-600 line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="text-red-600 font-semibold mt-1">{formatPrice(item.price)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="w-8 h-8 rounded border cursor-pointer"
                  onClick={() => updateQty(item.productId, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded border cursor-pointer"
                  onClick={() => updateQty(item.productId, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="ml-4 text-sm text-slate-500 hover:text-red-600 cursor-pointer"
                  onClick={() => removeItem(item.productId)}
                >
                  移除
                </button>
              </div>
            </div>
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t pt-6 flex justify-between items-center">
        <p className="text-lg">
          小計：<span className="font-bold text-red-600">{formatPrice(subtotal)}</span>
        </p>
        <Link
          href="/checkout"
          className="rounded-lg bg-red-600 px-8 py-3 font-semibold text-white hover:bg-red-700 cursor-pointer"
        >
          前往結帳
        </Link>
      </div>
    </div>
  );
}
