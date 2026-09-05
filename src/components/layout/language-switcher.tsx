"use client";

import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const router = useRouter();

  const choose = (next: Locale) => {
    setLocale(next);
    router.refresh();
  };

  return (
    <div className={cn("flex items-center gap-0.5 text-sm font-medium", className)}>
      <button
        onClick={() => choose("ru")}
        className={cn(
          "focus-ring rounded px-1.5 py-1 transition-colors",
          locale === "ru" ? "text-green" : "text-graphite-faint hover:text-graphite"
        )}
        aria-pressed={locale === "ru"}
      >
        RU
      </button>
      <span className="text-graphite-faint">|</span>
      <button
        onClick={() => choose("kg")}
        className={cn(
          "focus-ring rounded px-1.5 py-1 transition-colors",
          locale === "kg" ? "text-green" : "text-graphite-faint hover:text-graphite"
        )}
        aria-pressed={locale === "kg"}
      >
        KG
      </button>
    </div>
  );
}
