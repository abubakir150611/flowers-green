"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { Input } from "@/components/ui/input";
import { Card, Skeleton, EmptyState } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatMoney, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@prisma/client";

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  deliveryMethod: "DELIVERY" | "PICKUP";
  status: OrderStatus;
  createdAt: string;
};

const STATUS_FILTERS: (OrderStatus | "ALL")[] = [
  "ALL",
  "NEW",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const { locale, dict } = useI18n();
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<OrderRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    params.set("pageSize", "50");
    const timeout = setTimeout(() => {
      fetch(`/api/admin/orders?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => setItems(json.items))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [status, search]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-graphite">{dict.admin.orders.title}</h1>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              status === s ? "border-green bg-green text-ivory" : "border-graphite/15 text-graphite-soft hover:border-green"
            )}
          >
            {s === "ALL" ? dict.common.all : dict.orderStatus[s]}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.admin.orders.search}
          className="pl-10"
        />
      </div>

      <Card className="overflow-x-auto p-0">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <div className="p-8">
            <EmptyState title={dict.admin.orders.empty} />
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-graphite-faint">
                <th className="px-5 py-3">{dict.admin.orders.number}</th>
                <th className="px-5 py-3">{dict.admin.orders.customer}</th>
                <th className="px-5 py-3">{dict.admin.orders.phone}</th>
                <th className="px-5 py-3">{dict.admin.orders.amount}</th>
                <th className="px-5 py-3">{dict.admin.orders.method}</th>
                <th className="px-5 py-3">{dict.admin.orders.status}</th>
                <th className="px-5 py-3">{dict.admin.orders.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((order) => (
                <tr key={order.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-graphite hover:text-green">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-graphite-soft">{order.customerName}</td>
                  <td className="px-5 py-3 text-graphite-soft">{order.phone}</td>
                  <td className="px-5 py-3 font-medium text-graphite">{formatMoney(order.totalAmount, locale)}</td>
                  <td className="px-5 py-3 text-graphite-soft">{dict.deliveryMethod[order.deliveryMethod]}</td>
                  <td className="px-5 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-graphite-faint">{formatDate(order.createdAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
