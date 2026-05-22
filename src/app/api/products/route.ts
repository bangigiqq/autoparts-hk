import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const products = getProducts({
    category: searchParams.get("category") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    search: searchParams.get("q") ?? undefined,
    featured: searchParams.get("featured") === "1",
  });
  return NextResponse.json({ products });
}
