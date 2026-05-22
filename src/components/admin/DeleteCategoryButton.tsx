"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCategoryButton({
  categoryId,
  name,
  type,
}: {
  categoryId: string;
  name: string;
  type: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const del = async () => {
    if (!confirm(`確定刪除分類「${name}」？`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push(`/admin/categories?type=${type}`);
      router.refresh();
    } else {
      alert(data.error ?? "刪除失敗");
    }
  };

  return (
    <button
      type="button"
      onClick={del}
      disabled={loading}
      className="rounded-lg border border-red-200 text-red-600 px-4 py-2 text-sm hover:bg-red-50 cursor-pointer disabled:opacity-50"
    >
      {loading ? "刪除中…" : "刪除分類"}
    </button>
  );
}
