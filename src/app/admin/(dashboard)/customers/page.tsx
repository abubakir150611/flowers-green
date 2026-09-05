"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { Input } from "@/components/ui/input";
import { Card, Skeleton, EmptyState } from "@/components/ui/card";
import { formatMoney, formatDate } from "@/lib/format";

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string | null;
};

export default function AdminCustomersPage() {
  const { locale, dict } = useI18n();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CustomerRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    params.set("pageSize", "60");
    const timeout = setTimeout(() => {
      fetch(`/api/admin/customers?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => setItems(json.items))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-graphite">{dict.admin.customers.title}</h1>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.admin.customers.name}
          className="pl-10"
        />
      </div>

      <Card className="overflow-x-auto p-0">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <div className="p-8">
            <EmptyState title={dict.admin.customers.empty} />
          </div>
        ) : (
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-graphite-faint">
                <th className="px-5 py-3">{dict.admin.customers.name}</th>
                <th className="px-5 py-3">{dict.admin.customers.phone}</th>
                <th className="px-5 py-3">{dict.admin.customers.ordersCount}</th>
                <th className="px-5 py-3">{dict.admin.customers.totalSpent}</th>
                <th className="px-5 py-3">{dict.admin.customers.lastOrder}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((customer) => (
                <tr key={customer.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3 font-medium text-graphite">{customer.name}</td>
                  <td className="px-5 py-3 text-graphite-soft">{customer.phone}</td>
                  <td className="px-5 py-3 text-graphite-soft">{customer.ordersCount}</td>
                  <td className="px-5 py-3 font-medium text-graphite">{formatMoney(customer.totalSpent, locale)}</td>
                  <td className="px-5 py-3 text-graphite-faint">
                    {customer.lastOrder ? formatDate(customer.lastOrder, locale) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
