"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/lib/product-content-types";

export function ProductGallery({
  images,
  fallback,
  productName,
}: {
  images: GalleryImage[];
  fallback: string;
  productName: string;
}) {
  const list = images.length > 0 ? images : [{ id: "0", label: "主圖", src: fallback }];
  const [active, setActive] = useState(0);
  const current = list[active] ?? list[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-lg gallery-main">
        <Image
          key={current.src}
          src={current.src}
          alt={`${productName} - ${current.label}`}
          fill
          className="object-contain p-6 gallery-image-enter"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute bottom-3 right-3 rounded-full bg-slate-900/75 px-3 py-1 text-xs text-white font-medium">
          {active + 1} / {list.length}
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
        role="tablist"
        aria-label="商品圖片"
      >
        {list.map((img, i) => (
          <button
            key={img.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`${i + 1} of ${list.length}: ${img.label}`}
            onClick={() => setActive(i)}
            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200 ${
              i === active
                ? "border-red-600 ring-2 ring-red-200 scale-105"
                : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400"
            }`}
          >
            <Image src={img.src} alt="" fill className="object-cover p-1 bg-slate-50" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
