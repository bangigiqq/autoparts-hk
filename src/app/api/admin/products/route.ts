import { NextResponse } from "next/server";
import { z } from "zod";
import { createProduct, listAllProducts } from "@/lib/admin";
import { setProductCategories } from "@/lib/admin-categories";
import { withAdmin } from "@/lib/admin-api";
import { richContentSchema, updateProductRichContent } from "@/lib/admin-product-rich";

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

export async function GET() {
  const result = await withAdmin(async () =>
    NextResponse.json({ products: listAllProducts() })
  );
  return result;
}

export async function POST(req: Request) {
  const result = await withAdmin(async () => {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "商品資料不完整" }, { status: 400 });
    }
    try {
      const { categoryIds, richContent, ...productData } = parsed.data;
      const product = createProduct(productData);
      if (categoryIds?.length) {
        setProductCategories(product.id, categoryIds);
      }
      if (richContent) {
        updateProductRichContent(product.id, richContent);
      }
      return NextResponse.json({ product });
    } catch {
      return NextResponse.json({ error: "網址代稱可能重複" }, { status: 400 });
    }
  });
  return result;
}
