"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useFavoritesStore } from "@/store/favorites";
import { ProductCard } from "@/components/catalog/product-card";
import { Skeleton, EmptyState } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import type { ProductDTO } from "@/lib/types";

export function FavoritesView() {
  const { dict } = useI18n();
  const [mounted, setMounted] = useState(false);
  const ids = useFavoritesStore((s) => s.ids);
  const [items, setItems] = useState<ProductDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products?ids=${ids.join(",")}&pageSize=48`)
      .then((res) => res.json())
      .then((json) => setItems(json.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [ids, mounted]);

  if (!mounted) return null;

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl text-graphite">{dict.favorites.title}</h1>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="mt-3 h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-8 w-8" />}
            title={dict.favorites.empty}
            description={dict.favorites.emptyHint}
            action={<ButtonLink href="/catalog">{dict.favorites.goToCatalog}</ButtonLink>}
          />
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
