"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Wallet,
  UserPlus,
  Package,
  CalendarRange,
  TrendingUp,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { StatCard } from "@/components/admin/stat-card";
import { Card, Skeleton, EmptyState } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatMoney, formatDate, localizedField } from "@/lib/format";
import type { OrderStatus } from "@prisma/client";

type DashboardData = {
  todayOrders: number;
  todayRevenue: number;
  newCustomersToday: number;
  todaySoldItems: number;
  weekOrdersCount: number;
  monthRevenue: number;
  avgOrder: number;
  activeOrdersCount: number;
  lowStockProducts: { id: string; nameRu: string; nameKg: string; stock: number; sku: string }[];
  recentOrders: { id: string; orderNumber: string; customerName: string; totalAmount: number; status: OrderStatus; createdAt: string }[];
  topProducts: { productId: string | null; nameRu: string; nameKg: string; quantity: number }[];
  topCategories: { nameRu: string; nameKg: string; quantity: number }[];
};

export default function AdminDashboardPage() {
  const { locale, dict } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-graphite">{dict.admin.dashboard.title}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={dict.admin.dashboard.todayOrders} value={data.todayOrders} icon={ShoppingBag} />
        <StatCard label={dict.admin.dashboard.todayRevenue} value={formatMoney(data.todayRevenue, locale)} icon={Wallet} />
        <StatCard label={dict.admin.dashboard.newCustomers} value={data.newCustomersToday} icon={UserPlus} />
        <StatCard label={dict.admin.dashboard.soldItems} value={data.todaySoldItems} icon={Package} />
        <StatCard label={dict.admin.dashboard.weekOrders} value={data.weekOrdersCount} icon={CalendarRange} />
        <StatCard label={dict.admin.dashboard.monthRevenue} value={formatMoney(data.monthRevenue, locale)} icon={TrendingUp} />
        <StatCard label={dict.admin.dashboard.avgOrder} value={formatMoney(data.avgOrder, locale)} icon={Activity} />
        <StatCard label={dict.admin.dashboard.activeOrders} value={data.activeOrdersCount} icon={ShoppingBag} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg text-graphite">{dict.admin.dashboard.recentOrders}</h2>
          {data.recentOrders.length === 0 ? (
            <EmptyState title={dict.admin.dashboard.noData} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {data.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-2.5 pr-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-graphite hover:text-green">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-3 text-graphite-soft">{order.customerName}</td>
                      <td className="py-2.5 pr-3 text-graphite-faint">{formatDate(order.createdAt, locale)}</td>
                      <td className="py-2.5 pr-3 font-medium text-graphite">{formatMoney(order.totalAmount, locale)}</td>
                      <td className="py-2.5"><OrderStatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg text-graphite">
            <AlertTriangle className="h-4 w-4 text-rose" />
            {dict.admin.dashboard.lowStock}
          </h2>
          {data.lowStockProducts.length === 0 ? (
            <EmptyState title={dict.admin.dashboard.noData} />
          ) : (
            <ul className="space-y-2.5 text-sm">
              {data.lowStockProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <Link href={`/admin/products/${p.id}`} className="text-graphite hover:text-green">
                    {localizedField(locale, p.nameRu, p.nameKg)}
                  </Link>
                  <span className="font-medium text-rose">{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-display text-lg text-graphite">{dict.admin.dashboard.topProducts}</h2>
          {data.topProducts.length === 0 ? (
            <EmptyState title={dict.admin.dashboard.noData} />
          ) : (
            <ul className="space-y-2.5 text-sm">
              {data.topProducts.map((p, i) => (
                <li key={p.productId ?? i} className="flex items-center justify-between">
                  <span className="text-graphite">{localizedField(locale, p.nameRu, p.nameKg)}</span>
                  <span className="font-medium text-graphite-soft">× {p.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-display text-lg text-graphite">{dict.admin.dashboard.topCategories}</h2>
          {data.topCategories.length === 0 ? (
            <EmptyState title={dict.admin.dashboard.noData} />
          ) : (
            <ul className="space-y-2.5 text-sm">
              {data.topCategories.map((c, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-graphite">{localizedField(locale, c.nameRu, c.nameKg)}</span>
                  <span className="font-medium text-graphite-soft">× {c.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
