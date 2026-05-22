import Link from "next/link";
import { HomeBannerFeaturedToggle } from "@/components/admin/HomeBannerFeaturedToggle";
import {
  getHomeIncludeFeaturedProducts,
  listAllHomeBannersAdmin,
} from "@/lib/home-banners-db";

export default function AdminBannersPage() {
  const banners = listAllHomeBannersAdmin();
  const includeFeatured = getHomeIncludeFeaturedProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">首頁廣告</h1>
          <p className="text-sm text-slate-500 mt-1">
            管理首頁輪播橫幅的標題、連結、背景與排序
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + 新增廣告
        </Link>
      </div>

      <div className="mb-6 max-w-xl">
        <HomeBannerFeaturedToggle initialEnabled={includeFeatured} />
      </div>

      <p className="text-sm text-slate-500 mb-4">
        共 {banners.length} 則廣告 ·{" "}
        <Link href="/" target="_blank" className="text-red-600 hover:underline">
          前台預覽 ↗
        </Link>
      </p>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">排序</th>
              <th className="px-4 py-3">標題</th>
              <th className="px-4 py-3">連結</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 tabular-nums">{b.sortOrder}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">{b.title}</span>
                  {b.subtitle && (
                    <span className="block text-xs text-slate-400 line-clamp-1">
                      {b.subtitle}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs max-w-[200px] truncate">
                  {b.href}
                </td>
                <td className="px-4 py-3">
                  {b.enabled ? (
                    <span className="text-emerald-600 text-xs font-medium">啟用</span>
                  ) : (
                    <span className="text-slate-400 text-xs">停用</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/banners/${b.id}`}
                    className="text-red-600 hover:underline"
                  >
                    編輯
                  </Link>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  尚無廣告，請新增第一則
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
