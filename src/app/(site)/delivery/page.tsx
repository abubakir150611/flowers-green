import type { Metadata } from "next";
import { Truck, PackageCheck, Clock, MapPin, Phone, CreditCard, ShieldCheck } from "lucide-react";
import { getStoreSettings, buildTelUrl, buildWhatsAppUrl } from "@/lib/settings";
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
      <p className="mt-2 text-sm text-graphite-soft max-w-2xl">
        Подробные условия доставки курьером по Бишкеку, самовывоза и способов оплаты заказов
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="p-7">
          <Truck className="h-6 w-6 text-green" />
          <h2 className="mt-3 font-display text-xl text-graphite">{dict.delivery.deliverySection}</h2>
          <p className="mt-2 text-sm leading-relaxed text-graphite-soft">
            {deliveryText || "Быстрая и бережная доставка свежих цветов и букетов курьером по Бишкеку."}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-graphite-soft">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-green" />
              <span>Время доставки: в течение 1–2 часов или к выбранному времени</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green" />
              <span>Транспортировка в защитной упаковке и с контролем температуры</span>
            </li>
          </ul>
          {settings.deliveryPrice > 0 ? (
            <p className="mt-4 rounded bg-ivory-deep p-3 text-sm font-medium text-graphite">
              {dict.cart.deliveryAmount}: {settings.deliveryPrice.toLocaleString("ru-RU")} {dict.common.som}
            </p>
          ) : (
            <p className="mt-4 rounded bg-ivory-deep p-3 text-sm font-medium text-green-deep">
              Бесплатная доставка по Бишкеку
            </p>
          )}
          {settings.minimumOrder > 0 && (
            <p className="mt-2 text-xs text-graphite-faint">
              Минимальная сумма заказа: {settings.minimumOrder.toLocaleString("ru-RU")} {dict.common.som}
            </p>
          )}
        </Card>

        <Card className="p-7">
          <PackageCheck className="h-6 w-6 text-green" />
          <h2 className="mt-3 font-display text-xl text-graphite">{dict.delivery.pickupSection}</h2>
          <p className="mt-2 text-sm leading-relaxed text-graphite-soft">
            Заберите ваш букет лично в нашем фирменном магазине без платы за доставку.
          </p>
          <div className="mt-4 space-y-3 text-sm text-graphite-soft">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />
              <span><strong>Адрес:</strong> {settings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-green" />
              <span><strong>График:</strong> {settings.workingHours}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-green" />
              <span><strong>Телефон:</strong> {settings.phone}</span>
            </p>
          </div>
        </Card>
      </div>

      <section className="mt-10">
        <Card className="p-7">
          <CreditCard className="h-6 w-6 text-green" />
          <h2 className="mt-3 font-display text-xl text-graphite">Способы оплаты</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-graphite-soft">
            <div className="rounded border border-border p-4">
              <p className="font-medium text-graphite">Наличными при получении</p>
              <p className="mt-1 text-xs">Курьеру при доставке или в магазине при самовывозе.</p>
            </div>
            <div className="rounded border border-border p-4">
              <p className="font-medium text-graphite">Банковской картой</p>
              <p className="mt-1 text-xs">Оплата картой Visa / Mastercard / Элкарт через терминал курьера или в магазине.</p>
            </div>
            <div className="rounded border border-border p-4">
              <p className="font-medium text-graphite">Мобильный банкинг / QR</p>
              <p className="mt-1 text-xs">Перевод по QR-коду (MBank, Optima, Elsom и др.) после подтверждения заказа менеджером.</p>
            </div>
          </div>
        </Card>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={buildTelUrl(settings.phone)}>{dict.common.call}</ButtonLink>
        <ButtonLink
          href={buildWhatsAppUrl(settings.whatsapp, localizedField(locale, settings.whatsappMessageRu, settings.whatsappMessageKg))}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
        >
          {dict.common.whatsapp}
        </ButtonLink>
        <ButtonLink href="/catalog" variant="ghost">{dict.home.ctaButton}</ButtonLink>
      </div>
    </div>
  );
}
