"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useToast } from "@/components/ui/toast";
import { Card, Skeleton } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatMoney, formatDate } from "@/lib/format";
import type { OrderStatus } from "@prisma/client";

type OrderItemRow = { id: string; productName: string; price: number; quantity: number; total: number };
type OrderDetail = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string | null;
  comment: string;
  deliveryMethod: "DELIVERY" | "PICKUP";
  status: OrderStatus;
  itemsAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItemRow[];
};

const NEXT_ACTIONS: Partial<Record<OrderStatus, { status: OrderStatus; labelKey: keyof Dictionary["admin"]["orders"] }[]>> = {
  NEW: [{ status: "CONFIRMED", labelKey: "confirm" }, { status: "CANCELLED", labelKey: "cancel" }],
  CONFIRMED: [{ status: "PROCESSING", labelKey: "startProcessing" }, { status: "CANCELLED", labelKey: "cancel" }],
  PROCESSING: [{ status: "READY", labelKey: "markReady" }, { status: "CANCELLED", labelKey: "cancel" }],
  READY: [
    { status: "DELIVERING", labelKey: "sendDelivering" },
    { status: "COMPLETED", labelKey: "complete" },
    { status: "CANCELLED", labelKey: "cancel" },
  ],
  DELIVERING: [{ status: "COMPLETED", labelKey: "complete" }, { status: "CANCELLED", labelKey: "cancel" }],
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const { locale, dict } = useI18n();
  const { show } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    fetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((json) => setOrder(json.item))
      .catch(() => setOrder(null));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async (status: OrderStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) {
        show(json.error ?? dict.toast.saveError, "error");
        return;
      }
      setOrder(json.item);
      show(dict.toast.statusUpdated, "success");
    } finally {
      setUpdating(false);
    }
  };

  if (!order) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const actions = NEXT_ACTIONS[order.status] ?? [];

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="focus-ring flex w-fit items-center gap-1.5 text-sm text-graphite-soft hover:text-green">
        <ArrowLeft className="h-4 w-4" />
        {dict.admin.orders.title}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-graphite">#{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg text-graphite">{dict.admin.orders.productsTitle}</h2>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="text-graphite">{item.productName}</p>
                  <p className="text-graphite-faint">{item.quantity} × {formatMoney(item.price, locale)}</p>
                </div>
                <p className="font-medium text-graphite">{formatMoney(item.total, locale)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-graphite-soft">
              <span>{dict.cart.itemsAmount}</span>
              <span>{formatMoney(order.itemsAmount, locale)}</span>
            </div>
            <div className="flex justify-between text-graphite-soft">
              <span>{dict.cart.deliveryAmount}</span>
              <span>{formatMoney(order.deliveryAmount, locale)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-graphite">
              <span>{dict.cart.total}</span>
              <span>{formatMoney(order.totalAmount, locale)}</span>
            </div>
          </div>

          {actions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button
                  key={action.status}
                  size="sm"
                  variant={action.status === "CANCELLED" ? "danger" : "primary"}
                  disabled={updating}
                  onClick={() => updateStatus(action.status)}
                >
                  {dict.admin.orders[action.labelKey]}
                </Button>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.admin.orders.customer}</p>
            <p className="mt-1 font-medium text-graphite">{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.admin.orders.phone}</p>
            <p className="mt-1 text-graphite">{order.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.admin.orders.method}</p>
            <p className="mt-1 text-graphite">{dict.deliveryMethod[order.deliveryMethod]}</p>
          </div>
          {order.address && (
            <div>
              <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.checkout.address}</p>
              <p className="mt-1 text-graphite">{order.address}</p>
            </div>
          )}
          {order.comment && (
            <div>
              <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.checkout.comment}</p>
              <p className="mt-1 text-graphite">{order.comment}</p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-graphite-faint">{dict.admin.orders.date}</p>
            <p className="mt-1 text-graphite">{formatDate(order.createdAt, locale)}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
