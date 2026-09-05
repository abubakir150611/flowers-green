"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/admin", icon: LayoutDashboard, key: "dashboard" as const, exact: true },
  { href: "/admin/orders", icon: ShoppingCart, key: "orders" as const },
  { href: "/admin/products", icon: Package, key: "products" as const },
  { href: "/admin/categories", icon: FolderTree, key: "categories" as const },
  { href: "/admin/customers", icon: Users, key: "customers" as const },
  { href: "/admin/analytics", icon: BarChart3, key: "analytics" as const },
  { href: "/admin/settings", icon: Settings, key: "settings" as const },
];

export function AdminSidebar({
  adminName,
  adminEmail,
  mobileOpen,
  onCloseMobile,
}: {
  adminName: string;
  adminEmail: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <p className="font-display text-lg text-graphite">FLOWERSGREEN</p>
        <p className="text-xs text-graphite-faint">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-green text-ivory" : "text-graphite-soft hover:bg-black/[0.04] hover:text-graphite"
              )}
            >
              <item.icon className="h-4 w-4" />
              {dict.admin.sidebar[item.key]}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-5 py-4">
        <p className="truncate text-sm font-medium text-graphite">{adminName}</p>
        <p className="truncate text-xs text-graphite-faint">{adminEmail}</p>
        <button
          onClick={logout}
          className="focus-ring mt-3 flex items-center gap-2 text-sm text-graphite-soft hover:text-rose"
        >
          <LogOut className="h-4 w-4" />
          {dict.admin.logout}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-border bg-paper lg:block">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-graphite/40" onClick={onCloseMobile} />
          <div className="absolute inset-y-0 left-0 w-72 bg-paper shadow-lift">
            <button
              onClick={onCloseMobile}
              className="focus-ring absolute right-3 top-3 rounded-full p-1.5 text-graphite-faint hover:bg-black/[0.04]"
              aria-label={dict.common.close}
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
