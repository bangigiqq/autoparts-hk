import { NextResponse } from "next/server";
import { z } from "zod";
import { createCategory, listCategoriesAdmin } from "@/lib/admin-categories";
import { withAdmin } from "@/lib/admin-api";

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  nameJa: z.string().optional().nullable(),
  parentId: z.string().nullable(),
  type: z.enum(["function", "brand", "monitor"]),
  sortOrder: z.number().int(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? undefined;
  const result = await withAdmin(async () =>
    NextResponse.json({ categories: listCategoriesAdmin(type) })
  );
  return result;
}

export async function POST(req: Request) {
  const result = await withAdmin(async () => {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "分類資料不完整" }, { status: 400 });
    }
    try {
      const category = createCategory(parsed.data);
      return NextResponse.json({ category });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "建立失敗";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  });
  return result;
}
