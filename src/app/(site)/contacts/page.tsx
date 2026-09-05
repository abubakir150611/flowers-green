import type { Metadata } from "next";
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react";
import { getStoreSettings, buildMapsUrl, buildTelUrl, buildWhatsAppUrl } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizedField } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.contacts.title, alternates: { canonical: "/contacts" } };
}

export default async function ContactsPage() {
  const { locale, dict } = await getServerDictionary();
  const settings = await getStoreSettings();
  const whatsappMessage = localizedField(locale, settings.whatsappMessageRu, settings.whatsappMessageKg);

  return (
    <div className="container-page py-14 md:py-20">
      <OrganizationJsonLd settings={settings} />
      <h1 className="font-display text-3xl text-graphite sm:text-4xl">{dict.contacts.title}</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <Card className="p-7">
          <p className="font-display text-xl text-graphite">{settings.storeName}</p>
          <div className="mt-4 space-y-3 text-sm text-graphite-soft">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />
              {settings.address}
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-green" />
              {settings.phone}
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-green" />
              {settings.workingHours}
            </p>
            <p className="flex items-center gap-2.5">
              <Star className="h-4 w-4 shrink-0 text-green" />
              {settings.ratingValue.toFixed(1)} / 5 · {settings.ratingCount} {dict.contacts.ratingsCount} · {settings.reviewsCount} {dict.contacts.reviewsCount}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={buildTelUrl(settings.phone)}>{dict.common.call}</ButtonLink>
            <ButtonLink
              href={buildWhatsAppUrl(settings.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              {dict.common.whatsapp}
            </ButtonLink>
            <ButtonLink
              href={buildMapsUrl(settings.address, settings.mapUrl)}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
            >
              <Navigation className="h-4 w-4" />
              {dict.common.route}
            </ButtonLink>
          </div>
        </Card>

        <Card className="p-7">
          <p className="font-medium text-graphite">{dict.contacts.landmarks}</p>
          <ul className="mt-3 space-y-2 text-sm text-graphite-soft">
            <li>{dict.contacts.landmark1}</li>
            <li>{dict.contacts.landmark2}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
