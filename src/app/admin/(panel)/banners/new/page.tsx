import Link from "next/link";
import { AdminBannerForm } from "@/components/admin/AdminBannerForm";

export default function AdminNewBannerPage() {
  return (
    <div>
      <Link
        href="/admin/banners"
        className="text-sm text-slate-500 hover:text-red-600"
      >
        ← 返回廣告列表
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mt-2 mb-6">新增首頁廣告</h1>
      <AdminBannerForm />
    </div>
  );
}
