import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminOrder, updateOrderFpsRef, updateOrderStatus } from "@/lib/admin";
import { withAdmin } from "@/lib/admin-api";

const schema = z.object({
  status: z.string().optional(),
  fpsRef: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await withAdmin(async () => {
    const order = getAdminOrder(id);
    if (!order) return NextResponse.json({ error: "找不到訂單" }, { status: 404 });
    return NextResponse.json({ order });
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
      return NextResponse.json({ error: "資料無效" }, { status: 400 });
    }
    if (parsed.data.status) {
      if (!updateOrderStatus(id, parsed.data.status)) {
        return NextResponse.json({ error: "找不到訂單" }, { status: 404 });
      }
    }
    if (parsed.data.fpsRef !== undefined) {
      updateOrderFpsRef(id, parsed.data.fpsRef);
    }
    const order = getAdminOrder(id);
    return NextResponse.json({ order });
  });
  return result;
}
