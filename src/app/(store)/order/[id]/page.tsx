import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/format";
import { FpsRefForm } from "@/components/FpsRefForm";

export default async function OrderReceivedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;
  const order = getOrderById(id);
  if (!order) notFound();

  const isFps = order.paymentMethod.includes("FPS") || order.paymentMethod.includes("轉數快");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-green-700">
          {placed ? "已收到訂單" : "訂單詳情"}
        </h1>
        <p className="mt-2 text-slate-600">謝謝，我們已經收到您的訂單。</p>

        <ul className="mt-6 space-y-2 text-sm">
          <li>
            訂單編號：<strong>{order.orderNumber}</strong>
          </li>
          <li>
            日期：<strong>{formatDate(order.createdAt)}</strong>
          </li>
          <li>
            總計：<strong className="text-red-600">{formatPrice(order.total)}</strong>
          </li>
          <li>
            付款方式：<strong>{order.paymentMethod}</strong>
          </li>
        </ul>

        {isFps && (
          <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-5 text-sm">
            <p className="font-medium text-amber-900">轉數快 FPS 付款指引</p>
            <ul className="mt-2 space-y-1 text-amber-800">
              <li>「轉數快」識別碼：<strong>105594857</strong></li>
              <li>「轉數快」電話號碼：<strong>54495722</strong></li>
            </ul>
            <p className="mt-3">
              匯款後請在下方提交參考編號，並將截圖發送至 WhatsApp：
              <a
                href="https://wa.me/85254495722"
                className="text-red-600 font-medium ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                54495722
              </a>
            </p>
            <p className="mt-4 font-medium">提交「轉數快 FPS」參考編號：</p>
            <FpsRefForm orderId={order.id} initialRef={order.fpsRef} />
          </div>
        )}

        <h2 className="mt-10 text-lg font-bold border-b pb-2">訂單詳細資料</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">商品</th>
              <th className="py-2 text-right">總計</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-3">
                  {item.productName}
                  <span className="text-slate-500"> × {item.quantity}</span>
                </td>
                <td className="py-3 text-right">
                  {formatPrice(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="text-sm">
            <tr>
              <td className="py-2 text-slate-500">小計</td>
              <td className="py-2 text-right">{formatPrice(order.subtotal)}</td>
            </tr>
            <tr>
              <td className="py-2 text-slate-500">運送：{order.shippingMethod}</td>
              <td className="py-2 text-right">{formatPrice(order.shipping)}</td>
            </tr>
            <tr className="font-bold text-base">
              <td className="py-2">總計</td>
              <td className="py-2 text-right text-red-600">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-8 text-sm text-slate-600">
          如有任何問題，請 WhatsApp: (+852) 54495722
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/products"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:border-red-600 cursor-pointer"
          >
            繼續購物
          </Link>
          <Link
            href="/account/orders"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 cursor-pointer"
          >
            我的訂單
          </Link>
        </div>
      </div>
    </div>
  );
}
