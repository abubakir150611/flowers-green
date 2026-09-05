import type { Metadata } from "next";
import { Truck, PackageCheck, Clock, MapPin, Phone } from "lucide-react";
import { getStoreSettings, buildTelUrl } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizedField } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.delivery.title, alternates: { canonical: "/delivery" } };
}

export default async function DeliveryPage() {
  const { locale, dict } = await getServerDictionary();
  const settings = await getStoreSettings();
  const deliveryText = localizedField(locale, settings.deliveryTextRu, settings.deliveryTextKg);

  return (
    <div className="container-page py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite sm:text-4xl">{dict.delivery.title}</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="p-7">
          <Truck className="h-6 w-6 text-green" />
          <h2 className="mt-3 font-display text-xl text-graphite">{dict.delivery.deliverySection}</h2>
          <p className="mt-2 text-sm leading-relaxed text-graphite-soft">
            {deliveryText || dict.home.deliveryText}
          </p>
          {settings.deliveryPrice > 0 && (
            <p className="mt-3 text-sm font-medium text-graphite">
              {dict.cart.deliveryAmount}: {settings.deliveryPrice.toLocaleString("ru-RU")} {dict.common.som}
            </p>
          )}
        </Card>

        <Card className="p-7">
          <PackageCheck className="h-6 w-6 text-green" />
          <h2 className="mt-3 font-display text-xl text-graphite">{dict.delivery.pickupSection}</h2>
          <p className="mt-3 flex items-start gap-2 text-sm text-graphite-soft">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />
            {settings.address}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-graphite-soft">
            <Clock className="h-4 w-4 shrink-0 text-green" />
            {settings.workingHours}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-graphite-soft">
            <Phone className="h-4 w-4 shrink-0 text-green" />
            {settings.phone}
          </p>
        </Card>
      </div>

      <div className="mt-10 flex gap-3">
        <ButtonLink href={buildTelUrl(settings.phone)}>{dict.common.call}</ButtonLink>
        <ButtonLink href="/catalog" variant="outline">{dict.home.ctaButton}</ButtonLink>
      </div>
    </div>
  );
}
