"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  max,
  onChange,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-graphite/15",
        size === "sm" ? "h-9" : "h-11"
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex h-full w-9 items-center justify-center text-graphite-soft transition-colors hover:text-green disabled:opacity-30 focus-ring"
        aria-label="Уменьшить количество"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-full w-9 items-center justify-center text-graphite-soft transition-colors hover:text-green disabled:opacity-30 focus-ring"
        aria-label="Увеличить количество"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
