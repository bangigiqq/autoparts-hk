"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeBannerFeaturedToggle({
  initialEnabled,
}: {
  initialEnabled: boolean;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);

  const toggle = async (next: boolean) => {
    setEnabled(next);
    setSaving(true);
    const res = await fetch("/api/admin/banners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ includeFeaturedProducts: next }),
    });
    setSaving(false);
    if (!res.ok) {
      setEnabled(!next);
      const data = await res.json();
      alert(data.error ?? "儲存失敗");
      return;
    }
    router.refresh();
  };

  return (
    <label className="flex items-start gap-3 rounded-xl border bg-white p-4 cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        disabled={saving}
        onChange={(e) => toggle(e.target.checked)}
        className="mt-1 rounded"
      />
      <span>
        <span className="font-medium text-slate-900 block">
          自動加入精選商品輪播
        </span>
        <span className="text-sm text-slate-500">
          啟用後，首頁輪播會在自訂廣告之後追加最多 4 張精選商品廣告（無法在此頁單獨編輯）
        </span>
        {saving && (
          <span className="text-xs text-slate-400 block mt-1">儲存中…</span>
        )}
      </span>
    </label>
  );
}
