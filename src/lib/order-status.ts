export const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "待付款",
  paid: "已付款",
  processing: "處理中",
  shipped: "已發貨",
  completed: "已完成",
  cancelled: "已取消",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status;
}

export function orderStatusClass(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    paid: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-slate-200 text-slate-600",
  };
  return map[status] ?? "bg-slate-100 text-slate-700";
}
