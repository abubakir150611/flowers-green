import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/components/ui/toast";
import { LOCALE_COOKIE, defaultLocale, isLocale } from "@/lib/i18n/config";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "FLOWERSGREEN — цветочный магазин в Бишкеке",
    template: "%s | FLOWERSGREEN",
  },
  description:
    "Flowersgreen — цветы, букеты, комнатные растения и подарки в Бишкеке. Доставка по городу или самовывоз.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const initialLocale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html
      lang={initialLocale}
      className={`${playfair.variable} ${manrope.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-graphite antialiased">
        <I18nProvider initialLocale={initialLocale}>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
