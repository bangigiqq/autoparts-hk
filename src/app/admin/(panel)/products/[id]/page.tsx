import { notFound } from "next/navigation";
import {
  getProductCategoryIds,
  listCategoriesAdmin,
} from "@/lib/admin-categories";
import { getProductRichContent } from "@/lib/admin-product-rich";
import { getProductById } from "@/lib/products";
import { AdminProductEditor } from "@/components/admin/AdminProductEditor";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">編輯商品</h1>
          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{product.name}</p>
        </div>
        <DeleteProductButton productId={product.id} name={product.name} />
      </div>
      <AdminProductEditor
        productId={product.id}
        initial={product}
        initialRich={getProductRichContent(id)}
        categoryOptions={listCategoriesAdmin()}
        initialCategoryIds={getProductCategoryIds(product.id)}
      />
    </div>
  );
}
