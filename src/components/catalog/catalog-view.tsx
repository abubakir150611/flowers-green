"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { localizedField } from "@/lib/format";
import { ProductCard } from "@/components/catalog/product-card";
import { Skeleton } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

type ApiResponse = {
  items: ProductDTO[];
  total: number;
  page: number;
  totalPages: number;
};

export function CatalogView({
  categories,
  fixedCategorySlug,
}: {
  categories: CategoryDTO[];
  fixedCategorySlug?: string;
}) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = fixedCategorySlug ?? searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "popular";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const inStock = searchParams.get("inStock") === "1";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      if (!("page" in updates)) next.delete("page");
      const query = next.toString();
      const base = fixedCategorySlug ? `/catalog/${fixedCategorySlug}` : "/catalog";
      router.push(query ? `${base}?${query}` : base, { scroll: false });
    },
    [router, searchParams, fixedCategorySlug]
  );

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "1");
    params.set("page", String(page));
    params.set("pageSize", "12");

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((json: ApiResponse) => setData(json))
      .catch(() => setData({ items: [], total: 0, page: 1, totalPages: 1 }))
      .finally(() => setLoading(false));
  }, [category, sort, minPrice, maxPrice, inStock, page]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === category),
    [categories, category]
  );

  const filtersContent = (
    <div className="space-y-6">
      {!fixedCategorySlug && (
        <div>
          <Label>{dict.catalog.allCategories}</Label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParams({ category: null })}
              className={cn(
                "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                !category ? "border-green bg-green text-ivory" : "border-graphite/15 text-graphite-soft hover:border-green"
              )}
            >
              {dict.common.all}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => updateParams({ category: c.slug })}
                className={cn(
                  "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  category === c.slug
                    ? "border-green bg-green text-ivory"
                    : "border-graphite/15 text-graphite-soft hover:border-green"
                )}
              >
                {localizedField(locale, c.nameRu, c.nameKg)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>{dict.catalog.priceRange}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder={dict.common.from}
            defaultValue={minPrice}
            onBlur={(e) => updateParams({ minPrice: e.target.value })}
          />
          <span className="text-graphite-faint">—</span>
          <Input
            type="number"
            min={0}
            placeholder="max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParams({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-graphite">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => updateParams({ inStock: e.target.checked ? "1" : null })}
          className="h-4 w-4 rounded border-graphite/30 accent-green"
        />
        {dict.catalog.inStockOnly}
      </label>

      <Button variant="ghost" size="sm" onClick={() => router.push(fixedCategorySlug ? `/catalog/${fixedCategorySlug}` : "/catalog")}>
        {dict.catalog.reset}
      </Button>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-graphite">
            {activeCategory ? localizedField(locale, activeCategory.nameRu, activeCategory.nameKg) : dict.catalog.title}
          </h1>
          {data && (
            <p className="mt-1 text-sm text-graphite-faint">
              {dict.catalog.foundProducts}: {data.total}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="focus-ring flex items-center gap-2 rounded-md border border-graphite/15 px-3.5 py-2.5 text-sm font-medium text-graphite lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {dict.catalog.filters}
          </button>
          <Select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="w-auto"
            aria-label={dict.catalog.sort}
          >
            <option value="popular">{dict.catalog.sortPopular}</option>
            <option value="new">{dict.catalog.sortNew}</option>
            <option value="price_asc">{dict.catalog.sortPriceAsc}</option>
            <option value="price_desc">{dict.catalog.sortPriceDesc}</option>
            <option value="name">{dict.catalog.sortName}</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filtersContent}</aside>

        <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title={dict.catalog.filters}>
          {filtersContent}
          <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
            {dict.catalog.apply}
          </Button>
        </Modal>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="mt-3 h-4 w-2/3" />
                  <Skeleton className="mt-2 h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={<X className="h-8 w-8" />}
              title={dict.catalog.noProducts}
              description={dict.catalog.noProductsHint}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: String(page - 1) })}
                    className="focus-ring rounded-md border border-graphite/15 p-2 text-graphite disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 text-sm text-graphite-soft">
                    {page} / {data.totalPages}
                  </span>
                  <button
                    disabled={page >= data.totalPages}
                    onClick={() => updateParams({ page: String(page + 1) })}
                    className="focus-ring rounded-md border border-graphite/15 p-2 text-graphite disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CatalogBackLink({ label }: { label: string }) {
  return (
    <Link href="/catalog" className="focus-ring text-sm text-graphite-soft hover:text-green">
      ← {label}
    </Link>
  );
}
