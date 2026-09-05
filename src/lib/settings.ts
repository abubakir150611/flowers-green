import { prisma } from "@/lib/db/prisma";
import type { StoreSettings } from "@prisma/client";

const DEFAULTS: Omit<StoreSettings, "id" | "updatedAt"> = {
  storeName: "FLOWERSGREEN",
  phone: "+996 507-55-66-03",
  whatsapp: "+996 507-55-66-03",
  address: "ул. Исы Ахунбаева, 173/1, 720044, Бишкек, Первомайский район, 1-2 этаж",
  workingHours: "Ежедневно 10:00–21:00",
  deliveryPrice: 0,
  minimumOrder: 0,
  instagram: null,
  whatsappMessageRu: "Здравствуйте! Я хочу узнать о товарах Flowersgreen.",
  whatsappMessageKg: "Салам! Мен Flowersgreen товарлары жөнүндө билгим келет.",
  ratingValue: 4.8,
  ratingCount: 68,
  reviewsCount: 26,
  heroTitleRu: "Цветы, которые говорят за вас",
  heroTitleKg: "Сиз үчүн сүйлөгөн гүлдөр",
  heroSubtitleRu: "Свежие цветы, букеты и подарки с доставкой по Бишкеку",
  heroSubtitleKg: "Бишкек боюнча жеткирүү менен жаңы гүлдөр, букеттер жана белектер",
  heroImage: null,
  deliveryTextRu: "",
  deliveryTextKg: "",
  mapUrl: null,
};

/**
 * Returns the singleton store settings row, creating it with sane defaults
 * on first access so the app never has to special-case "no settings yet".
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  const existing = await prisma.storeSettings.findUnique({ where: { id: "main" } });
  if (existing) return existing;

  return prisma.storeSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main", ...DEFAULTS },
  });
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digits}?${params.toString()}`;
}

export function buildMapsUrl(address: string, mapUrl?: string | null): string {
  if (mapUrl) return mapUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function buildTelUrl(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}
