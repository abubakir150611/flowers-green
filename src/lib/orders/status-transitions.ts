import type { OrderStatus } from "@prisma/client";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "NEW",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "DELIVERING",
  "COMPLETED",
];

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["READY", "CANCELLED"],
  READY: ["DELIVERING", "COMPLETED", "CANCELLED"],
  DELIVERING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}
