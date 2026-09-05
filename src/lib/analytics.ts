import { prisma } from "@/lib/db/prisma";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

const ACTIVE_STATUSES = ["NEW", "CONFIRMED", "PROCESSING", "READY", "DELIVERING"] as const;
const REVENUE_STATUSES = ["CONFIRMED", "PROCESSING", "READY", "DELIVERING", "COMPLETED"] as const;

export async function getDashboardStats() {
  const todayStart = startOfDay(new Date());
  const weekStart = daysAgo(7);
  const monthStart = daysAgo(30);

  const [
    todayOrders,
    todayRevenueAgg,
    newCustomersToday,
    todaySoldItemsAgg,
    weekOrdersCount,
    monthRevenueAgg,
    monthOrdersCount,
    activeOrdersCount,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: todayStart }, status: { in: [...REVENUE_STATUSES] } },
      _sum: { totalAmount: true },
    }),
    prisma.customer.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.orderItem.aggregate({
      where: { order: { createdAt: { gte: todayStart } } },
      _sum: { quantity: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: monthStart }, status: { in: [...REVENUE_STATUSES] } },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: monthStart }, status: { in: [...REVENUE_STATUSES] } },
    }),
    prisma.order.count({ where: { status: { in: [...ACTIVE_STATUSES] } } }),
    prisma.product.findMany({
      where: { isPublished: true, stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 8,
      select: { id: true, nameRu: true, nameKg: true, stock: true, sku: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const monthRevenue = monthRevenueAgg._sum.totalAmount ?? 0;
  const avgOrder = monthOrdersCount > 0 ? Math.round(monthRevenue / monthOrdersCount) : 0;

  const topItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { createdAt: { gte: monthStart } }, productId: { not: null } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });
  const topProductIds = topItems.map((t) => t.productId).filter((id): id is string => !!id);
  const topProductRecords = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, nameRu: true, nameKg: true, categoryId: true, category: { select: { nameRu: true, nameKg: true } } },
  });
  const topProducts = topItems.map((t) => {
    const p = topProductRecords.find((r) => r.id === t.productId);
    return {
      productId: t.productId,
      nameRu: p?.nameRu ?? "—",
      nameKg: p?.nameKg ?? "—",
      quantity: t._sum.quantity ?? 0,
    };
  });

  const categoryTotals = new Map<string, { nameRu: string; nameKg: string; quantity: number }>();
  for (const record of topProductRecords) {
    const item = topItems.find((t) => t.productId === record.id);
    if (!item) continue;
    const existing = categoryTotals.get(record.categoryId);
    const qty = item._sum.quantity ?? 0;
    if (existing) existing.quantity += qty;
    else
      categoryTotals.set(record.categoryId, {
        nameRu: record.category.nameRu,
        nameKg: record.category.nameKg,
        quantity: qty,
      });
  }
  const topCategories = [...categoryTotals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  return {
    todayOrders,
    todayRevenue: todayRevenueAgg._sum.totalAmount ?? 0,
    newCustomersToday,
    todaySoldItems: todaySoldItemsAgg._sum.quantity ?? 0,
    weekOrdersCount,
    monthRevenue,
    avgOrder,
    activeOrdersCount,
    lowStockProducts,
    recentOrders,
    topProducts,
    topCategories,
  };
}

export async function getAnalytics(periodDays: 7 | 30 | 90) {
  const start = daysAgo(periodDays);

  const [salesAgg, ordersCount, items] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: start }, status: { in: [...REVENUE_STATUSES] } },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.order.findMany({
      where: { createdAt: { gte: start }, status: { in: [...REVENUE_STATUSES] } },
      select: { totalAmount: true, createdAt: true },
    }),
  ]);

  const sales = salesAgg._sum.totalAmount ?? 0;
  const avgOrder = ordersCount > 0 ? Math.round(sales / ordersCount) : 0;

  const byDay = new Map<string, number>();
  for (const order of items) {
    const key = order.createdAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + order.totalAmount);
  }
  const dailySales = [...byDay.entries()]
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const topItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { createdAt: { gte: start } }, productId: { not: null } },
    _sum: { quantity: true, total: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 8,
  });
  const topProductIds = topItems.map((t) => t.productId).filter((id): id is string => !!id);
  const topProductRecords = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, nameRu: true, nameKg: true, categoryId: true, category: { select: { nameRu: true, nameKg: true } } },
  });
  const topProducts = topItems.map((t) => {
    const p = topProductRecords.find((r) => r.id === t.productId);
    return {
      productId: t.productId,
      nameRu: p?.nameRu ?? "—",
      nameKg: p?.nameKg ?? "—",
      quantity: t._sum.quantity ?? 0,
      revenue: t._sum.total ?? 0,
    };
  });

  const categoryTotals = new Map<string, { nameRu: string; nameKg: string; revenue: number }>();
  for (const record of topProductRecords) {
    const item = topItems.find((t) => t.productId === record.id);
    if (!item) continue;
    const existing = categoryTotals.get(record.categoryId);
    const revenue = item._sum.total ?? 0;
    if (existing) existing.revenue += revenue;
    else
      categoryTotals.set(record.categoryId, {
        nameRu: record.category.nameRu,
        nameKg: record.category.nameKg,
        revenue,
      });
  }
  const topCategories = [...categoryTotals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return { sales, ordersCount, avgOrder, dailySales, topProducts, topCategories };
}
