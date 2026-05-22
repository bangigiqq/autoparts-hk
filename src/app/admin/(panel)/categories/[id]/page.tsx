import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import {
  CATEGORY_TYPE_LABELS,
  getCategoryAdmin,
  getParentOptions,
} from "@/lib/admin-categories";
import { getCategoryById } from "@/lib/categories";

const ROOT_IDS = new Set(["fn-root", "br-root", "mon-root"]);

export default async function AdminEditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = getCategoryById(id);
  const meta = getCategoryAdmin(id);
  if (!category || !meta) notFound();

  const type = category.type as "function" | "brand" | "monitor";
  const parentOptions = getParentOptions(type);
  const isRoot = ROOT_IDS.has(id);

  return (
    <div>
      <Link
        href={`/admin/categories?type=${type}`}
        className="text-sm text-slate-500 hover:text-red-600"
      >
        ← 返回{CATEGORY_TYPE_LABELS[type]}列表
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">編輯分類</h1>
        {!isRoot && (
          <DeleteCategoryButton
            categoryId={id}
            name={category.name}
            type={type}
          />
        )}
      </div>

      <div className="mb-4 flex gap-4 text-sm text-slate-600">
        <span>子分類：{meta.childCount}</span>
        <span>關聯商品：{meta.productCount}</span>
        <Link
          href={`/products?cat=${category.slug}`}
          target="_blank"
          className="text-red-600 hover:underline"
        >
          前台預覽 ↗
        </Link>
      </div>

      <AdminCategoryForm
        categoryId={id}
        initial={category}
        parentOptions={parentOptions}
        defaultType={type}
      />
    </div>
  );
}
