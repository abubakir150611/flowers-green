"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Card, EmptyState, Skeleton } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

type AnalyticsData = {
  sales: number;
  ordersCount: number;
  avgOrder: number;
  dailySales: { date: string; amount: number }[];
  topProducts: { productId: string | null; nameRu: string; nameKg: string; quantity: number; revenue: number }[];
  topCategories: { nameRu: string; nameKg: string; revenue: number }[];
};

const PERIODS = [7, 30, 90] as const;

export default function AdminAnalyticsPage() {
  const { locale, dict } = useI18n();
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [period]);

  const maxDaily = data ? Math.max(1, ...data.dailySales.map((d) => d.amount)) : 1;
  const periodLabel = { 7: dict.admin.analytics.period7, 30: dict.admin.analytics.period30, 90: dict.admin.analytics.period90 };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-graphite">{dict.admin.analytics.title}</h1>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                period === p ? "border-green bg-green text-ivory" : "border-graphite/15 text-graphite-soft hover:border-green"
              )}
            >
              {periodLabel[p]}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.admin.analytics.sales}</p>
              <p className="mt-2 font-display text-2xl text-graphite">{formatMoney(data.sales, locale)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.admin.analytics.ordersCount}</p>
              <p className="mt-2 font-display text-2xl text-graphite">{data.ordersCount}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.admin.analytics.avgOrder}</p>
              <p className="mt-2 font-display text-2xl text-graphite">{formatMoney(data.avgOrder, locale)}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="mb-4 font-display text-lg text-graphite">{dict.admin.dashboard.salesChart}</h2>
            {data.dailySales.length === 0 ? (
              <EmptyState title={dict.admin.analytics.noData} />
            ) : (
              <div className="flex h-40 items-end gap-1">
                {data.dailySales.map((d) => (
                  <div key={d.date} className="group relative flex-1">
                    <div
                      className="w-full rounded-t bg-green transition-all"
                      style={{ height: `${Math.max(4, (d.amount / maxDaily) * 100)}%` }}
                      title={`${d.date}: ${formatMoney(d.amount, locale)}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="mb-4 font-display text-lg text-graphite">{dict.admin.analytics.topProducts}</h2>
              {data.topProducts.length === 0 ? (
                <EmptyState title={dict.admin.analytics.noData} />
              ) : (
                <ul className="space-y-2.5 text-sm">
                  {data.topProducts.map((p, i) => (
                    <li key={p.productId ?? i} className="flex items-center justify-between">
                      <span className="text-graphite">{p.nameRu}</span>
                      <span className="font-medium text-graphite-soft">{formatMoney(p.revenue, locale)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="p-5">
              <h2 className="mb-4 font-display text-lg text-graphite">{dict.admin.analytics.topCategories}</h2>
              {data.topCategories.length === 0 ? (
                <EmptyState title={dict.admin.analytics.noData} />
              ) : (
                <ul className="space-y-2.5 text-sm">
                  {data.topCategories.map((c, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="text-graphite">{c.nameRu}</span>
                      <span className="font-medium text-graphite-soft">{formatMoney(c.revenue, locale)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
