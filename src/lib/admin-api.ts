import { NextResponse } from "next/server";
import { requireAdmin } from "./auth";

export async function withAdmin<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  try {
    await requireAdmin();
    return await handler();
  } catch {
    return NextResponse.json({ error: "需要管理員權限" }, { status: 403 });
  }
}
