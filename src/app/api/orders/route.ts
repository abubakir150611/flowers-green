import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation/schemas";
import { createOrder, OrderCreationError } from "@/lib/orders/create-order";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { sendPushToAllSubscribers } from "@/lib/push/send";
import { emitNewOrder } from "@/lib/realtime/order-events";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`order:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      { status: 429 }
    );
  }

  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const order = await createOrder(parsed.data);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    void sendPushToAllSubscribers({
      title: "🔔 Новый заказ!",
      body: `Заказ ${order.orderNumber} · Клиент: ${order.customerName} · Сумма: ${order.totalAmount.toLocaleString("ru-RU")} сом`,
      url: `${siteUrl}/admin/orders/${order.id}`,
      tag: `order-${order.id}`,
    }).catch((err) => console.error("[push] failed to notify admins", err));

    emitNewOrder({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
    });

    return NextResponse.json(
      {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        itemsAmount: order.itemsAmount,
        deliveryAmount: order.deliveryAmount,
        deliveryMethod: order.deliveryMethod,
        status: order.status,
        createdAt: order.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof OrderCreationError) {
      const status = error.code === "BELOW_MINIMUM" ? 400 : 409;
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status }
      );
    }
    console.error("[orders] create failed", error);
    return NextResponse.json({ error: "Не удалось оформить заказ" }, { status: 500 });
  }
}
