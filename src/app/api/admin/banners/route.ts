import { NextResponse } from "next/server";
import { z } from "zod";
import { withAdmin } from "@/lib/admin-api";
import {
  createHomeBanner,
  getHomeIncludeFeaturedProducts,
  listAllHomeBannersAdmin,
  setHomeIncludeFeaturedProducts,
} from "@/lib/home-banners-db";

const bannerSchema = z.object({
  id: z.string().optional(),
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

const settingsSchema = z.object({
  includeFeaturedProducts: z.boolean(),
});

export async function GET() {
  const result = await withAdmin(async () =>
    NextResponse.json({
      banners: listAllHomeBannersAdmin(),
      includeFeaturedProducts: getHomeIncludeFeaturedProducts(),
    })
  );
  return result;
}

export async function POST(req: Request) {
  const result = await withAdmin(async () => {
    const body = await req.json();
    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "廣告資料不完整" }, { status: 400 });
    }
    try {
      const banner = createHomeBanner(parsed.data);
      return NextResponse.json({ banner });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "建立失敗";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  });
  return result;
}

export async function PATCH(req: Request) {
  const result = await withAdmin(async () => {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "設定資料不完整" }, { status: 400 });
    }
    setHomeIncludeFeaturedProducts(parsed.data.includeFeaturedProducts);
    return NextResponse.json({
      includeFeaturedProducts: getHomeIncludeFeaturedProducts(),
    });
  });
  return result;
}
