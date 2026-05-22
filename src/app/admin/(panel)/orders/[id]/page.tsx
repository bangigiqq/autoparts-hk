import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/lib/admin";
import { AdminOrderEditor } from "@/components/admin/AdminOrderEditor";
import { orderStatusLabel } from "@/lib/order-status";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getAdminOrder(id);
  if (!order) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/orders" className="text-sm text-slate-500 hover:text-red-600">
          ← 返回訂單列表
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          訂單 #{order.orderNumber}
          <span className="ml-3 text-base font-normal text-slate-500">
            {orderStatusLabel(order.status)}
          </span>
        </h1>
      </div>
      <AdminOrderEditor order={order} />
    </div>
  );
}
