import { NextResponse } from "next/server";
import { listUsers } from "@/lib/admin";
import { withAdmin } from "@/lib/admin-api";

export async function GET() {
  const result = await withAdmin(async () =>
    NextResponse.json({ users: listUsers() })
  );
  return result;
}
