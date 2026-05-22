import Link from "next/link";
import { AdminCategoryForm } from "@/components/admin/AdminCategoryForm";
import {
  CATEGORY_TYPE_LABELS,
  getParentOptions,
} from "@/lib/admin-categories";

export default async function AdminNewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: typeParam } = await searchParams;
  const type =
    typeParam === "brand" || typeParam === "monitor" ? typeParam : "function";
  const parentOptions = getParentOptions(type);

  return (
    <div>
      <Link
        href={`/admin/categories?type=${type}`}
        className="text-sm text-slate-500 hover:text-red-600"
      >
        ← 返回{CATEGORY_TYPE_LABELS[type]}列表
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mt-2 mb-6">
        新增{CATEGORY_TYPE_LABELS[type]}
      </h1>
      <AdminCategoryForm parentOptions={parentOptions} defaultType={type} />
    </div>
  );
}
