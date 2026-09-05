import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { orderStatusSchema } from "@/lib/validation/schemas";
import { canTransition } from "@/lib/orders/status-transitions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });
  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  return NextResponse.json({ item: order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = orderStatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });

  const nextStatus = parsed.data.status;
  if (!canTransition(order.status, nextStatus)) {
    return NextResponse.json(
      { error: `Нельзя перевести заказ из статуса ${order.status} в ${nextStatus}` },
      { status: 400 }
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (nextStatus === "CANCELLED" && order.status !== "CANCELLED") {
      for (const item of order.items) {
        if (item.productId) {
          await tx.product
            .update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
            .catch(() => undefined);
        }
      }
    }
    return tx.order.update({ where: { id }, data: { status: nextStatus }, include: { items: true } });
  });

  return NextResponse.json({ item: updated });
}
