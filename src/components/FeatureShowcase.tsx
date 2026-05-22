"use client";

import type { ProductRichContent } from "@/lib/product-content-types";
import { ScrollReveal } from "./ScrollReveal";
import { FeatureVisual } from "./FeatureVisual";

export function FeatureShowcase({ content }: { content: ProductRichContent }) {
  const mainFeatures = content.features.filter((f) => f.num > 0);
  const relock = content.features.find((f) => f.visual === "relock");

  return (
    <section className="mt-16 border-t-4 border-slate-800 pt-12">
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-red-600 font-bold tracking-widest text-sm">六大功能</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
            {content.summaryTitle}
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-8" delay={100}>
        <ul className="flex flex-wrap justify-center gap-2">
          {mainFeatures.map((f) => (
            <li key={f.num}>
              <a
                href={`#feature-${f.num}`}
                className="inline-block rounded-full border-2 border-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                功能 {f.num}
              </a>
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-100 p-6">
        <p className="text-sm font-bold text-red-800 mb-3">產品重點</p>
        <ul className="space-y-2">
          {content.points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="text-red-600 shrink-0">✓</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 space-y-20">
        {mainFeatures.map((feature, index) => {
          const isEven = index % 2 === 0;
          return (
            <ScrollReveal key={feature.num} delay={index * 80}>
              <article
                id={`feature-${feature.num}`}
                className={`scroll-mt-24 grid gap-8 lg:gap-12 items-center lg:grid-cols-2 ${
                  isEven ? "" : "lg:[direction:rtl] lg:[&>*]:[direction:ltr]"
                }`}
              >
                <div className={isEven ? "" : "lg:col-start-2"}>
                  <FeatureVisual visual={feature.visual} />
                </div>
                <div>
                  <span className="inline-block rounded bg-slate-800 text-white text-xs font-bold px-3 py-1">
                    功能 {feature.num}
                  </span>
                  <h3 className="mt-3 text-xl md:text-2xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
                    {feature.body}
                  </p>
                  {feature.note && (
                    <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      {feature.note}
                    </p>
                  )}
                </div>
              </article>
            </ScrollReveal>
          );
        })}

        {relock && (
          <ScrollReveal>
            <article className="grid gap-8 lg:grid-cols-2 items-center bg-slate-50 rounded-2xl p-8 border">
              <FeatureVisual visual="relock" />
              <div>
                <span className="inline-block rounded bg-amber-500 text-white text-xs font-bold px-3 py-1">
                  再鎖定功能
                </span>
                <h3 className="mt-3 text-xl font-bold">{relock.title}</h3>
                <p className="mt-4 text-slate-600">{relock.body}</p>
                {relock.note && <p className="mt-2 text-sm text-slate-500">{relock.note}</p>}
              </div>
            </article>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
