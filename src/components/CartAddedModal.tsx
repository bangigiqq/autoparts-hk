"use client";

import Link from "next/link";
import { useEffect } from "react";

export function CartAddedModal({
  open,
  onClose,
  productName,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        aria-label="關閉"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl modal-panel p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 cart-check-pop">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 id="cart-modal-title" className="mt-4 text-xl font-bold text-slate-900">
          已加入購物車
        </h2>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{productName}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 py-3 font-medium hover:bg-slate-50 cursor-pointer"
          >
            繼續購物
          </button>
          <Link
            href="/cart"
            className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 cursor-pointer"
            onClick={onClose}
          >
            前往購物車
          </Link>
        </div>
      </div>
    </div>
  );
}
