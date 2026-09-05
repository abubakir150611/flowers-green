"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/toast";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/card";
import { formatMoney, localizedField } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ShoppingBag } from "lucide-react";

type DeliveryMethod = "DELIVERY" | "PICKUP";

export function CheckoutForm({
  deliveryPrice,
  minimumOrder,
  pickupAddress,
  pickupPhone,
}: {
  deliveryPrice: number;
  minimumOrder: number;
  pickupAddress: string;
  pickupPhone: string;
}) {
  const { locale, dict } = useI18n();
  const { show } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("DELIVERY");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  const itemsAmount = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );
  const deliveryAmount = deliveryMethod === "DELIVERY" ? deliveryPrice : 0;
  const total = itemsAmount + deliveryAmount;

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title={dict.checkout.emptyCart}
          action={<ButtonLink href="/catalog">{dict.cart.goToCatalog}</ButtonLink>}
        />
      </div>
    );
  }

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = dict.validation.nameMin;
    if (!/^[+0-9()\s-]{6,32}$/.test(phone.trim())) next.phone = dict.validation.phoneInvalid;
    if (deliveryMethod === "DELIVERY" && address.trim().length === 0) {
      next.address = dict.validation.addressRequired;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          comment,
          deliveryMethod,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        show(json.error ?? dict.toast.genericError, "error");
        setSubmitting(false);
        return;
      }
      clear();
      show(dict.toast.orderSuccess, "success");
      router.push(`/order-success/${json.id}`);
    } catch {
      show(dict.toast.genericError, "error");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-display text-xl text-graphite">{dict.checkout.contactInfo}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">{dict.checkout.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.checkout.namePlaceholder}
                required
              />
              <FieldError>{errors.name}</FieldError>
            </div>
            <div>
              <Label htmlFor="phone">{dict.checkout.phone}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={dict.checkout.phonePlaceholder}
                required
              />
              <FieldError>{errors.phone}</FieldError>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl text-graphite">{dict.checkout.deliveryMethod}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["DELIVERY", "PICKUP"] as const).map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setDeliveryMethod(method)}
                className={cn(
                  "focus-ring rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors",
                  deliveryMethod === method
                    ? "border-green bg-green-soft text-green-deep"
                    : "border-graphite/15 text-graphite hover:border-green/50"
                )}
              >
                {method === "DELIVERY" ? dict.checkout.delivery : dict.checkout.pickup}
              </button>
            ))}
          </div>

          {deliveryMethod === "DELIVERY" ? (
            <div className="mt-4">
              <Label htmlFor="address">{dict.checkout.address}</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={dict.checkout.addressPlaceholder}
                required
              />
              <FieldError>{errors.address}</FieldError>
            </div>
          ) : (
            <div className="mt-4 rounded-md bg-ivory-deep p-4 text-sm text-graphite-soft">
              <p className="font-medium text-graphite">{dict.checkout.pickupAddressTitle}</p>
              <p className="mt-1 whitespace-pre-line">{pickupAddress}</p>
              <p className="mt-2">{dict.checkout.pickupPhone}: {pickupPhone}</p>
            </div>
          )}

          <div className="mt-4">
            <Label htmlFor="comment">{dict.checkout.comment}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={dict.checkout.commentPlaceholder}
            />
          </div>
        </section>
      </div>

      <div className="h-fit rounded-lg border border-border bg-paper p-6">
        <h2 className="mb-4 font-display text-lg text-graphite">{dict.checkout.orderSummary}</h2>
        <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {lines.map((line) => (
            <div key={line.productId} className="flex items-center gap-3">
              <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-ivory-deep">
                {line.image && (
                  <Image src={line.image} alt="" fill sizes="40px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 text-xs">
                <p className="line-clamp-1 text-graphite">{localizedField(locale, line.nameRu, line.nameKg)}</p>
                <p className="text-graphite-faint">{line.quantity} × {formatMoney(line.price, locale)}</p>
              </div>
              <p className="text-xs font-medium text-graphite">{formatMoney(line.price * line.quantity, locale)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-graphite-soft">
            <span>{dict.checkout.items}</span>
            <span>{formatMoney(itemsAmount, locale)}</span>
          </div>
          <div className="flex justify-between text-graphite-soft">
            <span>{dict.checkout.deliveryCost}</span>
            <span>{formatMoney(deliveryAmount, locale)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-graphite">
            <span>{dict.checkout.total}</span>
            <span>{formatMoney(total, locale)}</span>
          </div>
        </div>

        {minimumOrder > 0 && total < minimumOrder && (
          <p className="mt-3 text-xs text-rose">
            {dict.checkout.minimumOrderNotice}: {formatMoney(minimumOrder, locale)}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
          {submitting ? dict.checkout.submitting : dict.checkout.submit}
        </Button>
      </div>
    </form>
  );
}
