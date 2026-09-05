import type { Locale } from "@/lib/i18n/config";

export function formatMoney(amount: number, locale: Locale = "ru"): string {
  const formatted = new Intl.NumberFormat(locale === "kg" ? "ky-KG" : "ru-RU").format(amount);
  return `${formatted} сом`;
}

export function formatDate(date: Date | string, locale: Locale = "ru"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "kg" ? "ky-KG" : "ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function localizedField<T extends string>(
  locale: Locale,
  ru: T,
  kg: T
): T {
  return locale === "kg" ? kg : ru;
}
