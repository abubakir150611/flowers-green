"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { formatMoney, localizedField } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { ProductDTO } from "@/lib/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { locale, dict } = useI18n();
  const { show } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.ids.includes(product.id));
  const [hovering, setHovering] = useState(false);

  const name = localizedField(locale, product.nameRu, product.nameKg);
  const mainImage = product.images[0]?.url ?? "/images/placeholder.svg";
  const altImage = product.images[1]?.url ?? mainImage;
  const outOfStock = product.stock <= 0;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(100 - (product.price / product.oldPrice) * 100)
      : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        nameRu: product.nameRu,
        nameKg: product.nameKg,
        price: product.price,
        image: mainImage,
        stock: product.stock,
      },
      1
    );
    show(dict.toast.addedToCart, "success");
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(product.id);
    show(isFavorite ? dict.toast.removedFromFavorites : dict.toast.addedToFavorites, "success");
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group focus-ring block overflow-hidden rounded-lg"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ivory-deep">
        <Image
          src={hovering ? altImage : mainImage}
          alt={product.images[0]?.alt || name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.isNew && <Badge tone="green">{dict.product.new}</Badge>}
          {product.featured && <Badge tone="ivory">{dict.product.popular}</Badge>}
          {discount && <Badge tone="rose">-{discount}%</Badge>}
        </div>

        <button
          onClick={handleFavorite}
          className={cn(
            "absolute right-2.5 top-2.5 rounded-full bg-paper/90 p-2 shadow-soft transition-colors focus-ring",
            isFavorite ? "text-rose" : "text-graphite-soft hover:text-rose"
          )}
          aria-label={isFavorite ? dict.product.removeFromFavorites : dict.product.addToFavorites}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>

        {outOfStock ? (
          <div className="absolute inset-x-2.5 bottom-2.5 rounded-md bg-graphite/85 px-3 py-2 text-center text-xs font-medium text-ivory">
            {dict.product.outOfStock}
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="absolute inset-x-2.5 bottom-2.5 flex translate-y-1 items-center justify-center gap-2 rounded-md bg-graphite px-3 py-2.5 text-xs font-medium text-ivory opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-ring sm:opacity-0"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {dict.product.addToCart}
          </button>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-graphite-faint">
          {localizedField(locale, product.categoryNameRu, product.categoryNameKg)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-graphite">{name}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-graphite">{formatMoney(product.price, locale)}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-graphite-faint line-through">
              {formatMoney(product.oldPrice, locale)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-graphite/15 py-2 text-xs font-medium text-graphite transition-colors hover:border-green hover:text-green disabled:opacity-40 focus-ring sm:hidden"
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        {outOfStock ? dict.product.outOfStock : dict.product.addToCart}
      </button>
    </Link>
  );
}
