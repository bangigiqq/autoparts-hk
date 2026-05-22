import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { getProductById } from "@/lib/products";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT w.product_id, p.slug, p.name, p.price, p.image_url
       FROM wishlist w JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ? ORDER BY w.created_at DESC`
    )
    .all(userId) as {
    product_id: string;
    slug: string;
    name: string;
    price: number;
    image_url: string | null;
  }[];

  return NextResponse.json({
    items: rows.map((r) => ({
      productId: r.product_id,
      slug: r.slug,
      name: r.name,
      price: r.price,
      imageUrl: r.image_url,
    })),
  });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId || !getProductById(productId)) {
    return NextResponse.json({ error: "商品不存在" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    "INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)"
  ).run(userId, productId);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "缺少 productId" }, { status: 400 });

  const db = getDb();
  db.prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?").run(
    userId,
    productId
  );
  return NextResponse.json({ ok: true });
}
