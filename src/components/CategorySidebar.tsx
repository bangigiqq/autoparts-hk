"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoryNode } from "@/lib/categories";

type Props = {
  mode: "function" | "brand" | "monitor";
  tree: CategoryNode[];
  activeSlug?: string;
  basePath?: string;
  /** 當前分類維度下的商品總數（「全部分類」用） */
  modeProductTotal?: number;
};

function CategoryItem({
  node,
  activeSlug,
  basePath,
  mode,
  depth = 0,
}: {
  node: CategoryNode;
  activeSlug?: string;
  basePath: string;
  mode: Props["mode"];
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const isActive = activeSlug === node.slug;
  const href = `${basePath}?mode=${mode}&cat=${node.slug}`;

  return (
    <li>
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 12 }}>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-5 h-5 shrink-0 text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
            aria-label={open ? "收合" : "展開"}
          >
            {open ? "▼" : "▶"}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <Link
          href={href}
          className={`flex-1 py-1.5 text-sm hover:text-red-600 cursor-pointer line-clamp-2 ${
            isActive ? "text-red-600 font-semibold" : "text-slate-700"
          }`}
        >
          {node.name}
          <span className="ml-1 text-slate-400 tabular-nums">({node.productCount})</span>
        </Link>
      </div>
      {hasChildren && open && (
        <ul className="mt-0.5">
          {node.children.map((child) => (
            <CategoryItem
              key={child.id}
              node={child}
              activeSlug={activeSlug}
              basePath={basePath}
              mode={mode}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CategorySidebar({
  mode,
  tree,
  activeSlug,
  basePath = "/products",
  modeProductTotal,
}: Props) {
  const tabs = [
    { key: "function" as const, label: "功能・安裝" },
    { key: "brand" as const, label: "品牌・車型" },
    { key: "monitor" as const, label: "開發招募" },
  ];

  return (
    <aside className="lg:w-72 shrink-0">
      <div className="rounded-xl border bg-white overflow-hidden sticky top-28">
        <div className="flex border-b text-xs">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`${basePath}?mode=${t.key}`}
              className={`flex-1 px-2 py-3 text-center font-medium cursor-pointer transition-colors ${
                mode === t.key
                  ? "bg-slate-800 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <div className="p-3 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-0.5">
            <li>
              <Link
                href={`${basePath}?mode=${mode}`}
                className={`block py-2 px-1 text-sm font-medium hover:text-red-600 cursor-pointer ${
                  !activeSlug ? "text-red-600" : ""
                }`}
              >
                全部分類
                {modeProductTotal !== undefined && (
                  <span className="ml-1 text-slate-400 font-normal tabular-nums">
                    ({modeProductTotal})
                  </span>
                )}
              </Link>
            </li>
            {tree.map((node) => (
              <CategoryItem
                key={node.id}
                node={node}
                activeSlug={activeSlug}
                basePath={basePath}
                mode={mode}
              />
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
