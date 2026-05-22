"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { MegaMenu } from "./MegaMenu";
import type { CategoryNode } from "@/lib/categories";

export function HeaderWithMenu({
  functionTree,
  brandTree,
  monitorTree,
  categoryCounts,
  productTotals,
}: {
  functionTree: CategoryNode[];
  brandTree: CategoryNode[];
  monitorTree: CategoryNode[];
  categoryCounts?: { function: number; brand: number; monitor: number; total: number };
  productTotals?: { function: number; brand: number; monitor: number };
}) {
  const [megaOpen, setMegaOpen] = useState(false);
  const headerWrapRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  const updateHeight = useCallback(() => {
    if (headerWrapRef.current) {
      setHeaderHeight(headerWrapRef.current.offsetHeight);
    }
  }, []);

  useLayoutEffect(() => {
    updateHeight();
    const el = headerWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    window.addEventListener("resize", updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [updateHeight, megaOpen]);

  const toggleMega = () => setMegaOpen((o) => !o);
  const closeMega = () => setMegaOpen(false);

  return (
    <div ref={headerWrapRef} className="sticky top-0 z-50">
      <Header
        onOpenMegaMenu={toggleMega}
        megaOpen={megaOpen}
        categoryCount={categoryCounts?.total ?? functionTree.length + brandTree.length}
      />
      <MegaMenu
        open={megaOpen}
        onClose={closeMega}
        topOffset={headerHeight}
        functionTree={functionTree}
        brandTree={brandTree}
        monitorTree={monitorTree}
        productTotals={productTotals}
      />
    </div>
  );
}
