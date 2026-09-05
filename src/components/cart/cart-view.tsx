"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/toast";
import { Button, ButtonLink } from "@/components/ui/button";
import { QuantityStepper } from "@/components/catalog/quantity-stepper";
import { EmptyState } from "@/components/ui/card";
import { formatMoney, localizedField } from "@/lib/format";

export function CartView({
  deliveryPrice,
  minimumOrder,
}: {
  deliveryPrice: number;
  minimumOrder: number;
}) {
  const { locale, dict } = useI18n();
  const { show } = useToast();
  const [mounted, setMounted] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title={dict.cart.empty}
          description={dict.cart.emptyHint}
          action={<ButtonLink href="/catalog">{dict.cart.goToCatalog}</ButtonLink>}
        />
      </div>
    );
  }

  const itemsAmount = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const belowMinimum = minimumOrder > 0 && itemsAmount + deliveryPrice < minimumOrder;

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl text-graphite">{dict.cart.title}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border">
          {lines.map((line) => (
            <div key={line.productId} className="flex gap-4 py-5">
              <Link href={`/product/${line.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-ivory-deep">
                {line.image && (
                  <Image src={line.image} alt={localizedField(locale, line.nameRu, line.nameKg)} fill sizes="80px" className="object-cover" />
                )}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/product/${line.slug}`} className="text-sm font-medium text-graphite hover:text-green focus-ring rounded">
                    {localizedField(locale, line.nameRu, line.nameKg)}
                  </Link>
                  <p className="mt-1 text-sm text-graphite-faint">{formatMoney(line.price, locale)}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <QuantityStepper
                    value={line.quantity}
                    max={line.stock}
                    onChange={(q) => {
                      setQuantity(line.productId, q);
                      show(dict.toast.quantityUpdated, "success");
                    }}
                    size="sm"
                  />
                  <button
                    onClick={() => {
                      removeItem(line.productId);
                      show(dict.toast.removedFromCart, "success");
                    }}
                    className="focus-ring rounded p-1.5 text-graphite-faint hover:text-rose"
                    aria-label={dict.common.remove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="w-20 shrink-0 text-right text-sm font-medium text-graphite">
                {formatMoney(line.price * line.quantity, locale)}
              </p>
            </div>
          ))}

          <div className="pt-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clear();
                show(dict.toast.cartCleared, "success");
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {dict.cart.clear}
            </Button>
          </div>
        </div>

        <div className="h-fit rounded-lg border border-border bg-paper p-6">
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-graphite-soft">
              <span>{dict.cart.itemsAmount}</span>
              <span>{formatMoney(itemsAmount, locale)}</span>
            </div>
            <div className="flex justify-between text-graphite-soft">
              <span>{dict.cart.deliveryAmount}</span>
              <span>{deliveryPrice > 0 ? formatMoney(deliveryPrice, locale) : dict.common.from + " 0"}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold text-graphite">
              <span>{dict.cart.total}</span>
              <span>{formatMoney(itemsAmount + deliveryPrice, locale)}</span>
            </div>
          </div>

          {belowMinimum && (
            <p className="mt-3 text-xs text-rose">
              {dict.checkout.minimumOrderNotice}: {formatMoney(minimumOrder, locale)}
            </p>
          )}

          <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
            {dict.cart.checkout}
          </ButtonLink>
          <ButtonLink href="/catalog" variant="ghost" className="mt-2 w-full">
            {dict.cart.continueShopping}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
