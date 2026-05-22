import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBannerForm } from "@/components/admin/AdminBannerForm";
import { DeleteBannerButton } from "@/components/admin/DeleteBannerButton";
import { getHomeBannerRecord } from "@/lib/home-banners-db";

export default async function AdminEditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = getHomeBannerRecord(id);
  if (!banner) notFound();

  return (
    <div>
      <Link
        href="/admin/banners"
        className="text-sm text-slate-500 hover:text-red-600"
      >
        ← 返回廣告列表
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">編輯廣告</h1>
        <DeleteBannerButton bannerId={id} title={banner.title} />
      </div>

      <div className="mb-4">
        <Link href="/" target="_blank" className="text-sm text-red-600 hover:underline">
          前台首頁預覽 ↗
        </Link>
      </div>

      <AdminBannerForm bannerId={id} initial={banner} />
    </div>
  );
}
