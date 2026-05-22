import Link from "next/link";
import { listAllOrders } from "@/lib/admin";
import { formatPrice, formatDate } from "@/lib/format";
import { orderStatusClass, orderStatusLabel } from "@/lib/order-status";

export default function AdminOrdersPage() {
  const orders = listAllOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">訂單管理</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">編號</th>
              <th className="px-4 py-3">客戶</th>
              <th className="px-4 py-3">金額</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3">日期</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">#{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <p>{o.customerName ?? "—"}</p>
                  <p className="text-xs text-slate-400">{o.customerEmail ?? ""}</p>
                </td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusClass(o.status)}`}
                  >
                    {orderStatusLabel(o.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-red-600 hover:underline"
                  >
                    詳情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-slate-500">尚無訂單</p>
        )}
      </div>
    </div>
  );
}
