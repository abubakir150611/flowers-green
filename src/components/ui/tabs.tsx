"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export type TabItem = {
  key: string;
  label: string;
  content: React.ReactNode;
};

export function Tabs({ items, defaultKey }: { items: TabItem[]; defaultKey?: string }) {
  const [active, setActive] = useState(defaultKey ?? items[0]?.key);
  const activeItem = items.find((i) => i.key === active) ?? items[0];

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b border-border no-scrollbar"
      >
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={active === item.key}
            onClick={() => setActive(item.key)}
            className={cn(
              "focus-ring shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              active === item.key
                ? "border-green text-green"
                : "border-transparent text-graphite-soft hover:text-graphite"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="py-6" role="tabpanel">
        {activeItem?.content}
      </div>
    </div>
  );
}
