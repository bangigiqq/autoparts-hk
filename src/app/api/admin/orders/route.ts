import { NextResponse } from "next/server";
import { listAllOrders } from "@/lib/admin";
import { withAdmin } from "@/lib/admin-api";

export async function GET() {
  const result = await withAdmin(async () =>
    NextResponse.json({ orders: listAllOrders() })
  );
  return result;
}
