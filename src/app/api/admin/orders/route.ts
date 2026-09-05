import { NextRequest, NextResponse } from "next/server";
import type { Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const VALID_STATUSES: OrderStatus[] = [
  "NEW",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const search = params.get("search")?.trim();
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize") ?? "20") || 20));

  const where: Prisma.OrderWhereInput = {};
  if (status && VALID_STATUSES.includes(status as OrderStatus)) {
    where.status = status as OrderStatus;
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { items: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      phone: o.phone,
      totalAmount: o.totalAmount,
      deliveryMethod: o.deliveryMethod,
      status: o.status,
      createdAt: o.createdAt,
      itemsCount: o._count.items,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
