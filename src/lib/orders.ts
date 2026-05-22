import { randomUUID } from "crypto";
import { getDb } from "./db";
import type { Order } from "@/types";

export function nextOrderNumber(): number {
  const db = getDb();
  const row = db.prepare("SELECT last_num FROM order_seq WHERE id = 1").get() as {
    last_num: number;
  };
  const next = row.last_num + 1;
  db.prepare("UPDATE order_seq SET last_num = ? WHERE id = 1").run(next);
  return next;
}

export function createOrder(input: {
  userId?: string | null;
  guestEmail?: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
  shipping: number;
  shippingMethod: string;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
}) {
  const db = getDb();
  const subtotal = input.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total = subtotal + input.shipping;
  const orderId = randomUUID();
  const orderNumber = nextOrderNumber();

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO orders (id, order_number, user_id, guest_email, subtotal, shipping, total,
        payment_method, shipping_name, shipping_phone, shipping_address, shipping_method, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
    ).run(
      orderId,
      orderNumber,
      input.userId ?? null,
      input.guestEmail ?? null,
      subtotal,
      input.shipping,
      total,
      input.paymentMethod,
      input.shippingName,
      input.shippingPhone,
      input.shippingAddress,
      input.shippingMethod
    );

    const insertItem = db.prepare(
      `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    for (const item of input.items) {
      insertItem.run(
        randomUUID(),
        orderId,
        item.productId,
        item.productName,
        item.quantity,
        item.unitPrice
      );
    }
  });

  tx();
  return { orderId, orderNumber, total };
}

export function getOrderById(orderId: string, userId?: string | null): Order | null {
  const db = getDb();
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as
    | import("./db").OrderRow
    | undefined;
  if (!order) return null;
  if (userId && order.user_id && order.user_id !== userId) return null;

  const items = db
    .prepare(
      `SELECT product_name, quantity, unit_price FROM order_items WHERE order_id = ?`
    )
    .all(orderId) as { product_name: string; quantity: number; unit_price: number }[];

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    paymentMethod: order.payment_method,
    fpsRef: order.fps_ref,
    shippingName: order.shipping_name,
    shippingPhone: order.shipping_phone,
    shippingAddress: order.shipping_address,
    shippingMethod: order.shipping_method,
    createdAt: order.created_at,
    items: items.map((i) => ({
      productName: i.product_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
    })),
  };
}

export function getOrdersForUser(userId: string): Order[] {
  const db = getDb();
  const orders = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as import("./db").OrderRow[];

  return orders.map((order) => {
    const items = db
      .prepare(
        `SELECT product_name, quantity, unit_price FROM order_items WHERE order_id = ?`
      )
      .all(order.id) as { product_name: string; quantity: number; unit_price: number }[];

    return {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.payment_method,
      fpsRef: order.fps_ref,
      shippingName: order.shipping_name,
      shippingPhone: order.shipping_phone,
      shippingAddress: order.shipping_address,
      shippingMethod: order.shipping_method,
      createdAt: order.created_at,
      items: items.map((i) => ({
        productName: i.product_name,
        quantity: i.quantity,
        unitPrice: i.unit_price,
      })),
    };
  });
}

export function updateFpsRef(orderId: string, fpsRef: string) {
  const db = getDb();
  db.prepare("UPDATE orders SET fps_ref = ? WHERE id = ?").run(fpsRef, orderId);
}
