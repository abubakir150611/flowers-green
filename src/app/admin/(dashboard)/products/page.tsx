"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { Input } from "@/components/ui/input";
import { Card, Skeleton, EmptyState } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatMoney, localizedField } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

export default function AdminProductsPage() {
  const { locale, dict } = useI18n();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<ProductDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    params.set("pageSize", "60");
    const timeout = setTimeout(() => {
      fetch(`/api/admin/products?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => setItems(json.items))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-graphite">{dict.admin.products.title}</h1>
        <ButtonLink href="/admin/products/new">
          <Plus className="h-4 w-4" />
          {dict.admin.products.add}
        </ButtonLink>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.admin.products.search}
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
            <EmptyState title={dict.admin.products.empty} />
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-graphite-faint">
                <th className="px-5 py-3">{dict.admin.products.name}</th>
                <th className="px-5 py-3">{dict.admin.products.category}</th>
                <th className="px-5 py-3">{dict.admin.products.price}</th>
                <th className="px-5 py-3">{dict.admin.products.stock}</th>
                <th className="px-5 py-3">{dict.admin.products.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((product) => (
                <tr key={product.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                      <div className="relative h-10 w-9 shrink-0 overflow-hidden rounded bg-ivory-deep">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt="" fill sizes="36px" className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-graphite hover:text-green">
                        {localizedField(locale, product.nameRu, product.nameKg)}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-graphite-soft">
                    {localizedField(locale, product.categoryNameRu, product.categoryNameKg)}
                  </td>
                  <td className="px-5 py-3 font-medium text-graphite">{formatMoney(product.price, locale)}</td>
                  <td className="px-5 py-3 text-graphite-soft">{product.stock}</td>
                  <td className="px-5 py-3">
                    <Badge tone={product.isPublished ? "green" : "graphite"}>
                      {product.isPublished ? dict.admin.products.published : dict.admin.products.hidden}
                    </Badge>
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
