import { NextResponse } from "next/server";
import { getOrderById, updateFpsRef } from "@/lib/orders";
import { getSessionUserId } from "@/lib/auth";
import { z } from "zod";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getSessionUserId();
  const order = getOrderById(id, userId);
  if (!order) return NextResponse.json({ error: "找不到訂單" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const schema = z.object({ fpsRef: z.string().min(3) });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "請輸入有效的轉數快參考編號" }, { status: 400 });
  }

  const order = getOrderById(id);
  if (!order) return NextResponse.json({ error: "找不到訂單" }, { status: 404 });

  updateFpsRef(id, parsed.data.fpsRef);
  return NextResponse.json({ ok: true });
}
