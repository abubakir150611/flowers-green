"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalCount: () => number;
  totalAmount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === item.productId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, Math.max(item.stock, 1));
            return {
              lines: state.lines.map((l) =>
                l.productId === item.productId ? { ...l, quantity: nextQty, stock: item.stock } : l
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              { ...item, quantity: Math.min(quantity, Math.max(item.stock, 1)) },
            ],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) }));
      },
      setQuantity: (productId, quantity) => {
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId
                ? { ...l, quantity: Math.max(1, Math.min(quantity, Math.max(l.stock, 1))) }
                : l
            )
            .filter((l) => l.quantity > 0),
        }));
      },
      clear: () => set({ lines: [] }),
      totalCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      totalAmount: () => get().lines.reduce((sum, l) => sum + l.quantity * l.price, 0),
    }),
    { name: "fg-cart" }
  )
);
