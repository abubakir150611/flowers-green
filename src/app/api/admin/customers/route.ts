import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = params.get("search")?.trim();
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize") ?? "20") || 20));

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { orders: { select: { totalAmount: true, createdAt: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  const items = customers.map((c) => {
    const ordersCount = c.orders.length;
    const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lastOrder = c.orders.reduce<Date | null>(
      (latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest),
      null
    );
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      ordersCount,
      totalSpent,
      lastOrder,
      createdAt: c.createdAt,
    };
  });

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
