import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteProduct, updateProduct } from "@/lib/admin";
import {
  getProductCategoryIds,
  setProductCategories,
} from "@/lib/admin-categories";
import { getProductById } from "@/lib/products";
import { withAdmin } from "@/lib/admin-api";
import {
  getProductRichContent,
  richContentSchema,
  updateProductRichContent,
} from "@/lib/admin-product-rich";

const schema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  price: z.number().int().positive(),
  sku: z.string().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().optional().nullable(),
  brand: z.string().optional(),
  vehicleModels: z.string().optional(),
  imageUrl: z.string().optional(),
  badges: z.string().optional(),
  featured: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  richContent: richContentSchema.optional().nullable(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await withAdmin(async () => {
    const product = getProductById(id);
    if (!product) return NextResponse.json({ error: "找不到商品" }, { status: 404 });
    return NextResponse.json({
      product,
      categoryIds: getProductCategoryIds(id),
      richContent: getProductRichContent(id),
    });
  });
  return result;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await withAdmin(async () => {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "商品資料不完整" }, { status: 400 });
    }
    const { categoryIds, richContent, ...productData } = parsed.data;
    const product = updateProduct(id, productData);
    if (!product) return NextResponse.json({ error: "找不到商品" }, { status: 404 });
    if (categoryIds !== undefined) {
      setProductCategories(id, categoryIds);
    }
    if (richContent !== undefined) {
      updateProductRichContent(id, richContent);
    }
    return NextResponse.json({
      product,
      richContent: getProductRichContent(id),
    });
  });
  return result;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await withAdmin(async () => {
    if (!deleteProduct(id)) {
      return NextResponse.json({ error: "找不到商品" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  });
  return result;
}
