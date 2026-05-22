"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const del = async () => {
    if (!confirm(`確定刪除「${name}」？此操作無法復原。`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      alert("刪除失敗");
    }
  };

  return (
    <button
      type="button"
      onClick={del}
      disabled={loading}
      className="rounded-lg border border-red-200 text-red-600 px-4 py-2 text-sm hover:bg-red-50 cursor-pointer disabled:opacity-50"
    >
      {loading ? "刪除中…" : "刪除商品"}
    </button>
  );
}
