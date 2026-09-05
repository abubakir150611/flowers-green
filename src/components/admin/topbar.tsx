"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { useAdminRealtime } from "./realtime-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function AdminTopbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { newOrdersCount, clearNewOrders } = useAdminRealtime();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-paper px-4 lg:px-8">
      <button
        onClick={onOpenMobile}
        className="focus-ring rounded-md p-2 text-graphite hover:bg-black/[0.04] lg:hidden"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
      <LanguageSwitcher />
      <Link
        href="/admin/orders"
        onClick={clearNewOrders}
        className="focus-ring relative rounded-full p-2 text-graphite hover:bg-black/[0.04]"
        aria-label="Orders notifications"
      >
        <Bell className="h-5 w-5" />
        {newOrdersCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold text-ivory">
            {newOrdersCount}
          </span>
        )}
      </Link>
    </header>
  );
}
