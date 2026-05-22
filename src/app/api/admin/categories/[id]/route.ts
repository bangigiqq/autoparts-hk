import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteCategory,
  getCategoryAdmin,
  updateCategory,
} from "@/lib/admin-categories";
import { withAdmin } from "@/lib/admin-api";

const schema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  nameJa: z.string().optional().nullable(),
  parentId: z.string().nullable(),
  sortOrder: z.number().int(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await withAdmin(async () => {
    const category = getCategoryAdmin(id);
    if (!category) {
      return NextResponse.json({ error: "找不到分類" }, { status: 404 });
    }
    return NextResponse.json({ category });
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
      return NextResponse.json({ error: "分類資料不完整" }, { status: 400 });
    }
    try {
      const category = updateCategory(id, parsed.data);
      return NextResponse.json({ category });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "更新失敗";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  });
  return result;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await withAdmin(async () => {
    try {
      deleteCategory(id);
      return NextResponse.json({ ok: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "刪除失敗";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  });
  return result;
}
