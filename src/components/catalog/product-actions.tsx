"use client";

import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/catalog/quantity-stepper";
import { cn } from "@/lib/cn";
import type { ProductDTO } from "@/lib/types";

export function ProductActions({ product }: { product: ProductDTO }) {
  const { dict } = useI18n();
  const { show } = useToast();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.ids.includes(product.id));
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        nameRu: product.nameRu,
        nameKg: product.nameKg,
        price: product.price,
        image: product.images[0]?.url ?? null,
        stock: product.stock,
      },
      quantity
    );
    show(dict.toast.addedToCart, "success");
  };

  const handleFavorite = () => {
    toggleFavorite(product.id);
    show(isFavorite ? dict.toast.removedFromFavorites : dict.toast.addedToFavorites, "success");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {!outOfStock && (
        <QuantityStepper value={quantity} max={product.stock} onChange={setQuantity} />
      )}
      <Button onClick={handleAdd} disabled={outOfStock} size="lg" className="flex-1">
        <ShoppingBag className="h-4 w-4" />
        {outOfStock ? dict.product.outOfStock : dict.product.addToCart}
      </Button>
      <button
        onClick={handleFavorite}
        className={cn(
          "focus-ring flex h-14 w-14 shrink-0 items-center justify-center rounded-md border transition-colors",
          isFavorite ? "border-rose text-rose" : "border-graphite/15 text-graphite-soft hover:border-rose hover:text-rose"
        )}
        aria-label={isFavorite ? dict.product.removeFromFavorites : dict.product.addToFavorites}
      >
        <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
      </button>
    </div>
  );
}
