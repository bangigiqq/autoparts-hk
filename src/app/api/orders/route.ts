import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, getOrdersForUser } from "@/lib/orders";
import { getProductById } from "@/lib/products";
import { getSessionUserId } from "@/lib/auth";

const schema = z.object({
  items: z.array(
    z.object({ productId: z.string(), quantity: z.number().int().positive() })
  ),
  shippingMethod: z.string(),
  paymentMethod: z.string(),
  shippingName: z.string().min(1),
  shippingPhone: z.string().min(1),
  shippingAddress: z.string().min(1),
  guestEmail: z.string().email().optional(),
});

const SHIPPING_RATES: Record<string, number> = {
  pickup: 0,
  hk_local: 50,
  macau_post: 200,
};

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "訂單資料不完整" }, { status: 400 });
  }

  const userId = await getSessionUserId();
  const shipping = SHIPPING_RATES[parsed.data.shippingMethod] ?? 50;

  const orderItems: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[] = [];

  for (const item of parsed.data.items) {
    const product = getProductById(item.productId);
    if (!product) {
      return NextResponse.json({ error: `商品不存在: ${item.productId}` }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `${product.name} 庫存不足` }, { status: 400 });
    }
    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  const { orderId, orderNumber, total } = createOrder({
    userId,
    guestEmail: parsed.data.guestEmail,
    items: orderItems,
    shipping,
    shippingMethod: parsed.data.shippingMethod,
    paymentMethod: parsed.data.paymentMethod,
    shippingName: parsed.data.shippingName,
    shippingPhone: parsed.data.shippingPhone,
    shippingAddress: parsed.data.shippingAddress,
  });

  return NextResponse.json({ orderId, orderNumber, total });
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "請先登入" }, { status: 401 });
  const orders = getOrdersForUser(userId);
  return NextResponse.json({ orders });
}
