"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { CategoryNode } from "@/lib/categories";

type Props = {
  open: boolean;
  onClose: () => void;
  topOffset: number;
  functionTree: CategoryNode[];
  brandTree: CategoryNode[];
  monitorTree: CategoryNode[];
  productTotals?: { function: number; brand: number; monitor: number };
};

function CategoryTreeLinks({
  nodes,
  mode,
  onClose,
  depth = 0,
}: {
  nodes: CategoryNode[];
  mode: string;
  onClose: () => void;
  depth?: number;
}) {
  if (!nodes.length) return null;

  return (
    <ul
      className={
        depth === 0
          ? "space-y-0.5"
          : "ml-3 mt-0.5 border-l border-slate-200 pl-2 space-y-0.5"
      }
    >
      {nodes.map((node) => (
        <li key={node.id}>
          <Link
            href={`/products?mode=${mode}&cat=${node.slug}`}
            onClick={onClose}
            className={`block py-1 hover:text-red-600 cursor-pointer ${
              depth === 0 ? "font-medium text-slate-800" : "text-slate-600 text-xs"
            }`}
          >
            {node.name}
            <span className="ml-1 text-slate-400 font-normal tabular-nums">
              ({node.productCount})
            </span>
          </Link>
          {node.children.length > 0 && (
            <CategoryTreeLinks
              nodes={node.children}
              mode={mode}
              onClose={onClose}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function MenuColumn({
  title,
  tree,
  mode,
  onClose,
  productTotal,
}: {
  title: string;
  tree: CategoryNode[];
  mode: string;
  onClose: () => void;
  productTotal?: number;
}) {
  return (
    <div className="min-w-0">
      <h3 className="font-bold text-slate-900 border-b-2 border-red-600 pb-2 text-sm md:text-base">
        {title}
        {productTotal !== undefined && (
          <span className="ml-2 text-xs font-normal text-slate-400">
            （{productTotal} 件商品）
          </span>
        )}
      </h3>
      <div className="max-h-[min(60vh,480px)] overflow-y-auto pr-1 text-sm">
        <CategoryTreeLinks nodes={tree} mode={mode} onClose={onClose} />
      </div>
    </div>
  );
}

export function MegaMenu({
  open,
  onClose,
  topOffset,
  functionTree,
  brandTree,
  monitorTree,
  productTotals,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-x-0 bottom-0 z-[45] cursor-pointer bg-slate-900/40 backdrop-blur-[2px]"
        style={{ top: topOffset }}
        aria-label="關閉分類選單"
        onClick={onClose}
      />
      <div
        className="fixed left-0 right-0 z-[46] bg-white shadow-2xl border-b-4 border-red-600 mega-panel"
        style={{ top: topOffset }}
        role="dialog"
        aria-label="全部商品分類"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
          <div className="flex justify-between items-center gap-3 mb-4">
            <div>
              <p className="font-bold text-base md:text-lg text-slate-900">全部商品分類</p>
              <p className="text-xs text-slate-500 mt-0.5">點選分類進入商品列表</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer"
            >
              關閉
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <MenuColumn
              title="功能・安裝位置"
              tree={functionTree}
              mode="function"
              onClose={onClose}
              productTotal={productTotals?.function}
            />
            <MenuColumn
              title="品牌・車型"
              tree={brandTree}
              mode="brand"
              onClose={onClose}
              productTotal={productTotals?.brand}
            />
            <MenuColumn
              title="開發招募"
              tree={monitorTree}
              mode="monitor"
              onClose={onClose}
              productTotal={productTotals?.monitor}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href="/products"
              onClick={onClose}
              className="text-slate-600 hover:text-red-600 font-medium"
            >
              瀏覽全部商品
            </Link>
            <Link href="/" onClick={onClose} className="text-slate-500 hover:text-red-600">
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
