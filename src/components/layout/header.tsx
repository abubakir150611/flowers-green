"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/cn";

export function Header({ storeName }: { storeName: string }) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalCount());
  const favCount = useFavoritesStore((s) => s.ids.length);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const navLinks = [
    { href: "/", label: dict.nav.home },
    { href: "/catalog", label: dict.nav.catalog },
    { href: "/about", label: dict.nav.about },
    { href: "/delivery", label: dict.nav.delivery },
    { href: "/contacts", label: dict.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ivory/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-graphite focus-ring rounded md:text-2xl"
        >
          {storeName}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors focus-ring rounded",
                pathname === link.href
                  ? "text-green"
                  : "text-graphite-soft hover:text-graphite"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <LanguageSwitcher className="hidden md:flex" />
          <Link
            href="/search"
            className="focus-ring rounded-full p-2 text-graphite hover:bg-black/[0.04]"
            aria-label={dict.nav.search}
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/favorites"
            className="focus-ring relative hidden rounded-full p-2 text-graphite hover:bg-black/[0.04] md:inline-flex"
            aria-label={dict.nav.favorites}
          >
            <Heart className="h-5 w-5" />
            {mounted && favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold text-ivory">
                {favCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="focus-ring relative rounded-full p-2 text-graphite hover:bg-black/[0.04]"
            aria-label={dict.nav.cart}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green px-1 text-[10px] font-semibold text-ivory">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="focus-ring rounded-full p-2 text-graphite hover:bg-black/[0.04] md:hidden"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-border bg-ivory md:hidden"
          >
            <nav className="container-page flex flex-col gap-1 py-3" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-3 text-base font-medium focus-ring",
                    pathname === link.href ? "text-green" : "text-graphite"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/favorites" className="flex items-center justify-between rounded-md px-3 py-3 text-base font-medium text-graphite focus-ring">
                {dict.nav.favorites}
                {mounted && favCount > 0 && (
                  <span className="rounded-full bg-rose px-2 py-0.5 text-xs font-semibold text-ivory">
                    {favCount}
                  </span>
                )}
              </Link>
              <div className="mt-2 border-t border-border px-3 pt-3">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
