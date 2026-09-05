"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const TONE: Record<string, "green" | "rose" | "graphite" | "ivory"> = {
  NEW: "ivory",
  CONFIRMED: "graphite",
  PROCESSING: "graphite",
  READY: "green",
  DELIVERING: "green",
  COMPLETED: "green",
  CANCELLED: "rose",
};

export function OrderStatusBadge({ status }: { status: keyof Dictionary["orderStatus"] }) {
  const { dict } = useI18n();
  return <Badge tone={TONE[status] ?? "graphite"}>{dict.orderStatus[status]}</Badge>;
}
