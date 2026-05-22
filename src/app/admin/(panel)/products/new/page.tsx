import { listCategoriesAdmin } from "@/lib/admin-categories";
import { emptyRichContent } from "@/lib/product-content-types";
import { AdminProductEditor } from "@/components/admin/AdminProductEditor";

export default function AdminNewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">新增商品</h1>
      <p className="text-sm text-slate-500 mb-6">
        儲存後可繼續編輯說明頁、圖版與功能展示區塊。
      </p>
      <AdminProductEditor
        initialRich={emptyRichContent()}
        categoryOptions={listCategoriesAdmin()}
      />
    </div>
  );
}
