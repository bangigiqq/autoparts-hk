"use client";

import { useState } from "react";

export function FpsRefForm({ orderId, initialRef }: { orderId: string; initialRef: string | null }) {
  const [fpsRef, setFpsRef] = useState(initialRef ?? "");
  const [saved, setSaved] = useState(!!initialRef);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fpsRef }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "提交失敗");
      return;
    }
    setSaved(true);
  };

  if (saved && fpsRef) {
    return (
      <p className="text-green-700 font-medium">
        已提交轉數快參考編號：<span className="font-mono">{fpsRef}</span>
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-wrap gap-2">
      <input
        type="text"
        value={fpsRef}
        onChange={(e) => setFpsRef(e.target.value)}
        placeholder="輸入 FPS 參考編號"
        className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-4 py-2 text-sm"
        required
      />
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
      >
        提交參考編號
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
