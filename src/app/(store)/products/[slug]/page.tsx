import { notFound } from "next/navigation";
import { getProductBySlug, getReviews, getProductCategoryBreadcrumb } from "@/lib/products";
import { getRichContent } from "@/lib/product-content";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const reviews = getReviews(product.id);
  const relatedCategories = getProductCategoryBreadcrumb(product.id);
  const richContent = getRichContent(product.id);

  return (
    <ProductDetailClient
      product={product}
      reviews={reviews}
      relatedCategories={relatedCategories}
      richContent={richContent}
    />
  );
}
