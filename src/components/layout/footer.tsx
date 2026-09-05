"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { buildTelUrl, buildWhatsAppUrl } from "@/lib/settings";
import type { StoreSettings } from "@prisma/client";

export function Footer({ settings }: { settings: StoreSettings }) {
  const { dict, locale } = useI18n();
  const whatsappMessage =
    locale === "kg" ? settings.whatsappMessageKg : settings.whatsappMessageRu;

  return (
    <footer className="mt-24 border-t border-border bg-ivory-deep">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-xl text-graphite">{settings.storeName}</p>
          <p className="mt-3 max-w-xs text-sm text-graphite-soft">{settings.address}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-graphite">{dict.footer.navigation}</p>
          <ul className="space-y-2 text-sm text-graphite-soft">
            <li><Link href="/" className="hover:text-green focus-ring rounded">{dict.nav.home}</Link></li>
            <li><Link href="/catalog" className="hover:text-green focus-ring rounded">{dict.nav.catalog}</Link></li>
            <li><Link href="/about" className="hover:text-green focus-ring rounded">{dict.nav.about}</Link></li>
            <li><Link href="/delivery" className="hover:text-green focus-ring rounded">{dict.nav.delivery}</Link></li>
            <li><Link href="/contacts" className="hover:text-green focus-ring rounded">{dict.nav.contacts}</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-graphite">{dict.footer.contacts}</p>
          <ul className="space-y-2 text-sm text-graphite-soft">
            <li>
              <a href={buildTelUrl(settings.phone)} className="hover:text-green focus-ring rounded">
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={buildWhatsAppUrl(settings.whatsapp, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green focus-ring rounded"
              >
                WhatsApp
              </a>
            </li>
            <li>{settings.workingHours}</li>
            {settings.instagram && (
              <li>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green focus-ring rounded"
                >
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-graphite">{dict.footer.legal}</p>
          <ul className="space-y-2 text-sm text-graphite-soft">
            <li><Link href="/privacy" className="hover:text-green focus-ring rounded">{dict.footer.privacy}</Link></li>
            <li><Link href="/terms" className="hover:text-green focus-ring rounded">{dict.footer.terms}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-graphite-faint md:flex-row">
          <p>© {new Date().getFullYear()} {settings.storeName}. {dict.footer.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
