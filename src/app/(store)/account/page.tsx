import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export default async function AccountPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?redirect=/account");

  const user = getDb()
    .prepare("SELECT id, email, name, phone FROM users WHERE id = ?")
    .get(userId) as { id: string; email: string; name: string; phone: string | null };

  const wishCount = (
    getDb()
      .prepare("SELECT COUNT(*) as c FROM wishlist WHERE user_id = ?")
      .get(userId) as { c: number }
  ).c;

  const orderCount = (
    getDb()
      .prepare("SELECT COUNT(*) as c FROM orders WHERE user_id = ?")
      .get(userId) as { c: number }
  ).c;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">會員專區</h1>
      <p className="mt-2 text-slate-600">歡迎，{user.name}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="rounded-xl border bg-white p-6 hover:border-red-600 hover:shadow-md transition-all cursor-pointer"
        >
          <h2 className="font-bold text-lg">我的訂單</h2>
          <p className="mt-1 text-slate-600 text-sm">{orderCount} 筆訂單</p>
        </Link>
        <Link
          href="/account/wishlist"
          className="rounded-xl border bg-white p-6 hover:border-red-600 hover:shadow-md transition-all cursor-pointer"
        >
          <h2 className="font-bold text-lg">收藏 / 已儲存產品</h2>
          <p className="mt-1 text-slate-600 text-sm">{wishCount} 件商品</p>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border bg-slate-50 p-6 text-sm">
        <h2 className="font-semibold">帳戶資料</h2>
        <dl className="mt-3 space-y-2">
          <div>
            <dt className="text-slate-500">姓名</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">電郵</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">電話</dt>
            <dd>{user.phone || "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
