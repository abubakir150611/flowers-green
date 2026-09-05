"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/catalog/product-card";
import { Skeleton, EmptyState } from "@/components/ui/card";
import type { ProductDTO } from "@/lib/types";

export function SearchView() {
  const { dict } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<ProductDTO[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setItems(null);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(trimmed)}&pageSize=24`)
        .then((res) => res.json())
        .then((json) => setItems(json.items))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search", {
      scroll: false,
    });
  };

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl text-graphite">{dict.nav.search}</h1>

      <form onSubmit={onSubmit} className="relative mt-6 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-faint" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.common.searchPlaceholder}
          className="pl-10"
        />
      </form>

      <div className="mt-8">
        {!query.trim() ? null : loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="mt-3 h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <EmptyState title={dict.catalog.noProducts} description={dict.catalog.noProductsHint} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
