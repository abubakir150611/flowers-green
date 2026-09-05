import { ButtonLink } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { Card } from "@/components/ui/card";
import { Leaf, Truck, PackageCheck, CreditCard, Phone, MapPin, Clock } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { StoreSettings } from "@prisma/client";
import { buildMapsUrl, buildTelUrl, buildWhatsAppUrl } from "@/lib/settings";
import type { Locale } from "@/lib/i18n/config";
import { localizedField } from "@/lib/format";

export function AboutSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="container-page py-14 md:py-20">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl text-graphite sm:text-3xl">{dict.home.aboutTitle}</h2>
        <p className="mt-4 text-base leading-relaxed text-graphite-soft">{dict.home.aboutText}</p>
      </FadeIn>
    </section>
  );
}

export function BenefitsSection({ dict }: { dict: Dictionary }) {
  const benefits = [
    { icon: Leaf, title: dict.home.benefit1Title, text: dict.home.benefit1Text },
    { icon: Truck, title: dict.home.benefit2Title, text: dict.home.benefit2Text },
    { icon: PackageCheck, title: dict.home.benefit3Title, text: dict.home.benefit3Text },
    { icon: CreditCard, title: dict.home.benefit4Title, text: dict.home.benefit4Text },
  ];

  return (
    <section className="bg-ivory-deep/60 py-14 md:py-20">
      <div className="container-page">
        <h2 className="mb-8 font-display text-2xl text-graphite sm:text-3xl">{dict.home.benefitsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <FadeIn key={b.title} delay={i * 0.05}>
              <Card className="h-full p-6">
                <b.icon className="h-6 w-6 text-green" />
                <p className="mt-4 font-medium text-graphite">{b.title}</p>
                <p className="mt-1.5 text-sm text-graphite-soft">{b.text}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeliverySection({ dict }: { dict: Dictionary }) {
  return (
    <section className="container-page py-14 md:py-20">
      <FadeIn>
        <Card className="grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <h2 className="font-display text-2xl text-graphite sm:text-3xl">{dict.home.deliveryTitle}</h2>
            <p className="mt-3 max-w-md text-graphite-soft">{dict.home.deliveryText}</p>
            <ButtonLink href="/delivery" variant="outline" className="mt-6">
              {dict.home.deliveryCta}
            </ButtonLink>
          </div>
          <div className="flex items-center gap-3 text-graphite-soft md:justify-end">
            <Truck className="h-10 w-10 text-green" />
            <PackageCheck className="h-10 w-10 text-green" />
          </div>
        </Card>
      </FadeIn>
    </section>
  );
}

export function GiftsSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-ivory-deep/60 py-14 md:py-20">
      <div className="container-page text-center">
        <FadeIn className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl text-graphite sm:text-3xl">{dict.home.giftsTitle}</h2>
          <p className="mt-3 text-graphite-soft">{dict.home.giftsText}</p>
          <ButtonLink href="/catalog/podarochnye-nabory" className="mt-6">
            {dict.common.seeAll}
          </ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}

export function CTASection({ dict }: { dict: Dictionary }) {
  return (
    <section className="container-page py-14 md:py-20">
      <FadeIn>
        <div className="rounded-xl bg-green px-8 py-14 text-center text-ivory md:py-20">
          <h2 className="font-display text-2xl sm:text-3xl">{dict.home.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-ivory/85">{dict.home.ctaSubtitle}</p>
          <ButtonLink
            href="/catalog"
            size="lg"
            className="mt-7 bg-ivory text-green hover:bg-ivory/90"
          >
            {dict.home.ctaButton}
          </ButtonLink>
        </div>
      </FadeIn>
    </section>
  );
}

export function ContactsSection({
  settings,
  dict,
  locale,
}: {
  settings: StoreSettings;
  dict: Dictionary;
  locale: Locale;
}) {
  const whatsappMessage = localizedField(locale, settings.whatsappMessageRu, settings.whatsappMessageKg);

  return (
    <section className="container-page pb-20">
      <FadeIn>
        <Card className="grid gap-8 p-8 md:grid-cols-3 md:p-12">
          <div>
            <h2 className="font-display text-2xl text-graphite">{dict.home.contactsTitle}</h2>
            <p className="mt-2 text-sm text-graphite-faint">
              {settings.ratingValue.toFixed(1)} / 5 · {settings.ratingCount} {dict.contacts.ratingsCount} · {settings.reviewsCount} {dict.contacts.reviewsCount}
            </p>
          </div>
          <div className="space-y-2 text-sm text-graphite-soft">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />{settings.address}</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-green" />{settings.workingHours}</p>
          </div>
          <div className="flex flex-col gap-2.5 md:items-end">
            <ButtonLink href={buildTelUrl(settings.phone)} variant="outline" className="w-full md:w-auto">
              <Phone className="h-4 w-4" /> {settings.phone}
            </ButtonLink>
            <ButtonLink
              href={buildWhatsAppUrl(settings.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              {dict.common.whatsapp}
            </ButtonLink>
            <ButtonLink
              href={buildMapsUrl(settings.address, settings.mapUrl)}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              className="w-full md:w-auto"
            >
              {dict.common.route}
            </ButtonLink>
          </div>
        </Card>
      </FadeIn>
    </section>
  );
}
