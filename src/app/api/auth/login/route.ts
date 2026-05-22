import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "請輸入電郵及密碼" }, { status: 400 });
  }

  const db = getDb();
  const user = db
    .prepare("SELECT id, email, password_hash, name, phone FROM users WHERE email = ?")
    .get(parsed.data.email.toLowerCase()) as
    | { id: string; email: string; password_hash: string; name: string; phone: string | null }
    | undefined;

  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    return NextResponse.json({ error: "電郵或密碼錯誤" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
  });
}
