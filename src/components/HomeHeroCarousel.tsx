"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HomeBanner } from "@/lib/home-banners";

const INTERVAL_MS = 5500;

export function HomeHeroCarousel({ banners }: { banners: HomeBanner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => go(index + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [index, paused, count, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  if (count === 0) return null;

  const slide = banners[index];

  return (
    <section
      className="relative overflow-hidden bg-slate-900"
      aria-roledescription="carousel"
      aria-label="首頁廣告輪播"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="relative aspect-[21/9] min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px]">
          {banners.map((b, i) => (
            <div
              key={b.id}
              className={`carousel-slide absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={i !== index}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient}`} />
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,#fff,transparent_55%)]" />

              <div className="relative z-10 h-full flex flex-col md:flex-row items-center gap-6 md:gap-10 px-6 md:px-12 py-8 md:py-10">
                <div className="flex-1 text-white text-center md:text-left min-w-0">
                  {b.accent && (
                    <span className="inline-block rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium text-red-100 mb-3">
                      {b.accent}
                    </span>
                  )}
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
                    style={{ fontFamily: "Rubik, sans-serif" }}
                  >
                    {b.title}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl mx-auto md:mx-0 line-clamp-2 md:line-clamp-3">
                    {b.subtitle}
                  </p>
                  <Link
                    href={b.href}
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-white text-slate-900 px-6 py-3 text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    {b.cta} →
                  </Link>
                </div>

                {b.image && (
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 shrink-0 rounded-2xl bg-white/10 backdrop-blur p-4 shadow-2xl">
                    <Image
                      src={b.image}
                      alt=""
                      fill
                      className="object-contain drop-shadow-lg"
                      sizes="(max-width:768px) 40vw, 224px"
                      priority={i === 0}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur cursor-pointer flex items-center justify-center"
              aria-label="上一張"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur cursor-pointer flex items-center justify-center"
              aria-label="下一張"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === index ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`第 ${i + 1} 張廣告`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        第 {index + 1} 張，共 {count} 張：{slide.title}
      </p>
    </section>
  );
}
