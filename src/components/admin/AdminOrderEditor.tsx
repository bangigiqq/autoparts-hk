"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUSES, orderStatusLabel } from "@/lib/order-status";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/format";

export function AdminOrderEditor({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [fpsRef, setFpsRef] = useState(order.fpsRef ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, fpsRef }),
    });
    setSaving(false);
    if (!res.ok) {
      setMsg("更新失敗");
      return;
    }
    setMsg("已儲存");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold text-slate-900">更新訂單</h2>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">訂單狀態</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {orderStatusLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">轉數快參考編號</span>
          <input
            value={fpsRef}
            onChange={(e) => setFpsRef(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="FPS 參考編號"
          />
        </label>
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
        >
          {saving ? "儲存中…" : "儲存變更"}
        </button>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">訂單明細</h2>
        <dl className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">訂單編號</dt>
            <dd className="font-medium">#{order.orderNumber}</dd>
          </div>
          <div>
            <dt className="text-slate-500">總額</dt>
            <dd className="font-medium text-red-600">{formatPrice(order.total)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">收件人</dt>
            <dd>{order.shippingName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">電話</dt>
            <dd>{order.shippingPhone ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">地址</dt>
            <dd>{order.shippingAddress ?? "—"}</dd>
          </div>
        </dl>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">商品</th>
              <th className="py-2">數量</th>
              <th className="py-2">單價</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2">{item.productName}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">{formatPrice(item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
