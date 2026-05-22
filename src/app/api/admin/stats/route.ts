import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/admin";
import { withAdmin } from "@/lib/admin-api";

export async function GET() {
  const result = await withAdmin(async () => NextResponse.json({ stats: getAdminStats() }));
  return result;
}
