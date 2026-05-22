"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

const SHIPPING: Record<string, { label: string; price: number }> = {
  pickup: { label: "屯門門市自取", price: 0 },
  hk_local: { label: "香港本地郵寄", price: 50 },
  macau_post: { label: "澳門郵寄", price: 200 },
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; phone: string | null } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    guestEmail: "",
    shippingMethod: "hk_local",
    paymentMethod: "fps",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setForm((f) => ({
            ...f,
            shippingName: d.user.name,
            shippingPhone: d.user.phone || "",
            guestEmail: d.user.email,
          }));
        }
      });
  }, []);

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  const shipping = SHIPPING[form.shippingMethod]?.price ?? 50;
  const total = subtotal + shipping;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...form,
        paymentMethod: form.paymentMethod === "fps" ? "「轉數快FPS」付款" : form.paymentMethod,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "下單失敗");
      return;
    }
    clearCart();
    router.push(`/order/${data.orderId}?placed=1`);
  };

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">結帳</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">送貨資料</h2>
          <input
            required
            placeholder="收件人姓名"
            value={form.shippingName}
            onChange={(e) => setForm({ ...form, shippingName: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          <input
            required
            placeholder="聯絡電話"
            value={form.shippingPhone}
            onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          <textarea
            required
            placeholder="送貨地址"
            rows={3}
            value={form.shippingAddress}
            onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          {!user && (
            <input
              type="email"
              required
              placeholder="電郵（訪客訂單用）"
              value={form.guestEmail}
              onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
              className="w-full rounded-lg border px-4 py-2"
            />
          )}

          <h2 className="font-semibold text-lg pt-4">運送方式</h2>
          {Object.entries(SHIPPING).map(([key, { label, price }]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="shipping"
                checked={form.shippingMethod === key}
                onChange={() => setForm({ ...form, shippingMethod: key })}
              />
              {label} — {price === 0 ? "免費" : formatPrice(price)}
            </label>
          ))}

          <h2 className="font-semibold text-lg pt-4">付款方式</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={form.paymentMethod === "fps"}
              onChange={() => setForm({ ...form, paymentMethod: "fps" })}
            />
            「轉數快 FPS」付款
          </label>
          <p className="text-xs text-slate-500 pl-6">
            識別碼：105594857 · 電話：54495722 · 付款後請於訂單頁提交參考編號
          </p>
        </div>

        <div>
          <div className="rounded-xl border bg-white p-6 sticky top-24">
            <h2 className="font-semibold">訂單摘要</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-2">
                  <span className="line-clamp-1">
                    {i.name} × {i.quantity}
                  </span>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <dt>小計</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>運費</dt>
                <dd>{formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between text-lg font-bold text-red-600">
                <dt>總計</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "處理中…" : "確認下單"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
