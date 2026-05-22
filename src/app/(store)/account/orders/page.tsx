import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/format";

export default async function OrdersPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?redirect=/account/orders");

  const orders = getOrdersForUser(userId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/account" className="hover:text-red-600">
          會員專區
        </Link>
        <span className="mx-2">/</span>
        <span>我的訂單</span>
      </nav>
      <h1 className="text-2xl font-bold">我的訂單</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-slate-600">暫無訂單記錄。</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border bg-white p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold">訂單 #{o.orderNumber}</p>
                  <p className="text-sm text-slate-500">{formatDate(o.createdAt)}</p>
                </div>
                <p className="font-bold text-red-600">{formatPrice(o.total)}</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {o.items.map((i) => `${i.productName}×${i.quantity}`).join("、")}
              </p>
              <p className="mt-1 text-xs">
                狀態：{o.status} · {o.paymentMethod}
                {o.fpsRef ? ` · FPS: ${o.fpsRef}` : ""}
              </p>
              <Link
                href={`/order/${o.id}`}
                className="mt-3 inline-block text-sm text-red-600 font-medium hover:underline"
              >
                查看詳情 →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
