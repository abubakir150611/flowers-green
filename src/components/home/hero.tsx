import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedField } from "@/lib/format";
import type { StoreSettings } from "@prisma/client";

export function Hero({
  settings,
  locale,
  dict,
}: {
  settings: StoreSettings;
  locale: Locale;
  dict: Dictionary;
}) {
  const title = localizedField(locale, settings.heroTitleRu, settings.heroTitleKg) || dict.home.heroCta;
  const subtitle = localizedField(locale, settings.heroSubtitleRu, settings.heroSubtitleKg);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-24">
        <FadeIn>
          <h1 className="font-display text-4xl leading-[1.1] text-graphite sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base text-graphite-soft md:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/catalog" size="lg">
              {dict.home.heroCta}
            </ButtonLink>
            <ButtonLink href="/about" variant="outline" size="lg">
              {dict.home.heroSecondaryCta}
            </ButtonLink>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-[5/4]">
          <Image
            src={settings.heroImage || "/images/hero/hero.svg"}
            alt={settings.storeName}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </FadeIn>
      </div>
    </section>
  );
}
