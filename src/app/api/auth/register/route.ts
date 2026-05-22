import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "資料格式不正確" }, { status: 400 });
  }

  const { email, password, name, phone } = parsed.data;
  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "此電郵已註冊" }, { status: 409 });
  }

  const id = randomUUID();
  const passwordHash = await hashPassword(password);
  db.prepare(
    "INSERT INTO users (id, email, password_hash, name, phone) VALUES (?, ?, ?, ?, ?)"
  ).run(id, email.toLowerCase(), passwordHash, name, phone ?? null);

  await createSession(id);
  return NextResponse.json({ ok: true, user: { id, email, name } });
}
