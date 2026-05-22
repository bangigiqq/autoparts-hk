import { NextResponse } from "next/server";
import { z } from "zod";
import { withAdmin } from "@/lib/admin-api";
import {
  deleteHomeBanner,
  getHomeBannerRecord,
  updateHomeBanner,
} from "@/lib/home-banners-db";

const schema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  cta: z.string().min(1),
  href: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  gradient: z.string().min(1),
  accent: z.string().optional().nullable(),
  sortOrder: z.number().int(),
  enabled: z.boolean(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await withAdmin(async () => {
    const banner = getHomeBannerRecord(id);
    if (!banner) {
      return NextResponse.json({ error: "找不到廣告" }, { status: 404 });
    }
    return NextResponse.json({ banner });
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
      return NextResponse.json({ error: "廣告資料不完整" }, { status: 400 });
    }
    try {
      const banner = updateHomeBanner(id, parsed.data);
      return NextResponse.json({ banner });
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
      deleteHomeBanner(id);
      return NextResponse.json({ ok: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "刪除失敗";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  });
  return result;
}
