"use client";

import Image from "next/image";
import {
  FEATURE_VISUAL_OPTIONS,
  type GalleryImage,
  type ProductFeatureBlock,
  type ProductRichContent,
} from "@/lib/product-content-types";

type Tab = "page" | "gallery" | "features";

export function AdminProductRichPanel({
  tab,
  rich,
  onChange,
  mainImageUrl,
}: {
  tab: Tab;
  rich: ProductRichContent;
  onChange: (next: ProductRichContent) => void;
  mainImageUrl: string;
}) {
  const update = (patch: Partial<ProductRichContent>) => onChange({ ...rich, ...patch });

  if (tab === "page") {
    return (
      <div className="max-w-3xl space-y-4">
        <p className="text-sm text-slate-500">
          說明頁內容會顯示於商品詳情下方「店舖說明」與「六大功能」標題區。若留空則使用基本資料中的描述。
        </p>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">功能區主標題</span>
          <input
            value={rich.summaryTitle}
            onChange={(e) => update({ summaryTitle: e.target.value })}
            placeholder="例：車速連動自動門鎖・P 檔解鎖…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">產品重點（每行一項）</span>
          <textarea
            rows={5}
            value={rich.points.join("\n")}
            onChange={(e) =>
              update({
                points: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
            placeholder="自動上鎖、自動解鎖…"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">店舖說明（安裝・保固・注意事項）</span>
          <textarea
            rows={12}
            value={rich.shopMessage}
            onChange={(e) => update({ shopMessage: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="【安裝說明】&#10;…"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={rich.showDipSwitch ?? false}
            onChange={(e) => update({ showDipSwitch: e.target.checked })}
            className="rounded"
          />
          顯示「撥動開關」功能切換表（門鎖套件適用）
        </label>
      </div>
    );
  }

  if (tab === "gallery") {
    const addImage = () => {
      const n = rich.gallery.length + 1;
      update({
        gallery: [
          ...rich.gallery,
          {
            id: `g-${Date.now()}`,
            label: `圖 ${n}`,
            src: mainImageUrl || "/products/placeholder.svg",
          },
        ],
      });
    };

    const patchImage = (index: number, patch: Partial<GalleryImage>) => {
      const gallery = rich.gallery.map((g, i) => (i === index ? { ...g, ...patch } : g));
      update({ gallery });
    };

    const removeImage = (index: number) => {
      update({ gallery: rich.gallery.filter((_, i) => i !== index) });
    };

    const moveImage = (index: number, dir: -1 | 1) => {
      const next = index + dir;
      if (next < 0 || next >= rich.gallery.length) return;
      const gallery = [...rich.gallery];
      [gallery[index], gallery[next]] = [gallery[next], gallery[index]];
      update({ gallery });
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            圖版用於商品詳情左側相簿，路徑請填網站內公開檔案（如 /products/gallery/xxx.svg）。
          </p>
          <button
            type="button"
            onClick={addImage}
            className="rounded-lg bg-slate-800 text-white px-4 py-2 text-sm cursor-pointer hover:bg-slate-700"
          >
            + 新增圖片
          </button>
        </div>
        {rich.gallery.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-slate-500 text-sm">
            尚無圖版，點「新增圖片」加入。未設定時前台僅顯示主圖。
          </div>
        ) : (
          <ul className="space-y-4">
            {rich.gallery.map((img, index) => (
              <li
                key={img.id}
                className="flex flex-col sm:flex-row gap-4 rounded-xl border p-4 bg-slate-50"
              >
                <div className="relative w-full sm:w-32 h-32 shrink-0 rounded-lg bg-white border overflow-hidden">
                  <Image
                    src={img.src || "/products/placeholder.svg"}
                    alt={img.label}
                    fill
                    className="object-contain p-2"
                    sizes="128px"
                    unoptimized={img.src.endsWith(".svg")}
                  />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <label className="block text-xs">
                      標籤
                      <input
                        value={img.label}
                        onChange={(e) => patchImage(index, { label: e.target.value })}
                        className="mt-0.5 w-full rounded border px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="block text-xs sm:col-span-2">
                      圖片路徑 URL
                      <input
                        value={img.src}
                        onChange={(e) => patchImage(index, { src: e.target.value })}
                        className="mt-0.5 w-full rounded border px-2 py-1.5 text-sm font-mono"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                      className="text-xs border rounded px-2 py-1 cursor-pointer disabled:opacity-40"
                    >
                      ↑ 上移
                    </button>
                    <button
                      type="button"
                      disabled={index === rich.gallery.length - 1}
                      onClick={() => moveImage(index, 1)}
                      className="text-xs border rounded px-2 py-1 cursor-pointer disabled:opacity-40"
                    >
                      ↓ 下移
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 cursor-pointer hover:bg-red-50"
                    >
                      刪除
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

  const addFeature = () => {
    update({
      features: [
        ...rich.features,
        {
          num: rich.features.filter((f) => f.num > 0).length + 1,
          title: "新功能",
          body: "",
          visual: "auto-lock",
        },
      ],
    });
  };

  const patchFeature = (index: number, patch: Partial<ProductFeatureBlock>) => {
    const features = rich.features.map((f, i) => (i === index ? { ...f, ...patch } : f));
    update({ features });
  };

  const removeFeature = (index: number) => {
    update({ features: rich.features.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          每個功能區塊會在前台顯示標題、說明與動畫示範。編號 0 可設為「再鎖定」等特殊區塊。
        </p>
        <button
          type="button"
          onClick={addFeature}
          className="rounded-lg bg-slate-800 text-white px-4 py-2 text-sm cursor-pointer hover:bg-slate-700"
        >
          + 新增功能區塊
        </button>
      </div>
      {rich.features.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-slate-500 text-sm">
          尚無功能展示區塊。
        </div>
      ) : (
        <ul className="space-y-4">
          {rich.features.map((f, index) => (
            <li key={`${f.visual}-${index}`} className="rounded-xl border p-4 space-y-3">
              <div className="grid sm:grid-cols-4 gap-3">
                <label className="block text-xs">
                  編號
                  <input
                    type="number"
                    value={f.num}
                    onChange={(e) =>
                      patchFeature(index, { num: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-0.5 w-full rounded border px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="block text-xs sm:col-span-2">
                  標題
                  <input
                    value={f.title}
                    onChange={(e) => patchFeature(index, { title: e.target.value })}
                    className="mt-0.5 w-full rounded border px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="block text-xs">
                  動畫類型
                  <select
                    value={f.visual}
                    onChange={(e) =>
                      patchFeature(index, {
                        visual: e.target.value as ProductFeatureBlock["visual"],
                      })
                    }
                    className="mt-0.5 w-full rounded border px-2 py-1.5 text-sm"
                  >
                    {FEATURE_VISUAL_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-xs">
                說明內文
                <textarea
                  rows={3}
                  value={f.body}
                  onChange={(e) => patchFeature(index, { body: e.target.value })}
                  className="mt-0.5 w-full rounded border px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block text-xs">
                備註（選填）
                <input
                  value={f.note ?? ""}
                  onChange={(e) => patchFeature(index, { note: e.target.value || undefined })}
                  className="mt-0.5 w-full rounded border px-2 py-1.5 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-xs text-red-600 cursor-pointer hover:underline"
              >
                刪除此功能區塊
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
