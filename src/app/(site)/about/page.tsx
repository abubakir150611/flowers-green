import type { Metadata } from "next";
import { Leaf, Truck, Gift, Sprout } from "lucide-react";
import { getStoreSettings } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.about.title, alternates: { canonical: "/about" } };
}

export default async function AboutPage() {
  const { dict } = await getServerDictionary();
  const settings = await getStoreSettings();

  const areas = [
    { icon: Leaf, label: "Цветы и букеты" },
    { icon: Sprout, label: "Комнатные растения" },
    { icon: Gift, label: "Подарки и мягкие игрушки" },
    { icon: Truck, label: "Доставка по Бишкеку" },
  ];

  return (
    <div className="container-page py-14 md:py-20">
      <h1 className="font-display text-3xl text-graphite sm:text-4xl">{dict.about.heading}</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-graphite-soft">
        {dict.home.aboutText}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((a) => (
          <Card key={a.label} className="p-6">
            <a.icon className="h-6 w-6 text-green" />
            <p className="mt-3 text-sm font-medium text-graphite">{a.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-10 max-w-xl p-6 text-sm text-graphite-soft">
        <p>
          {settings.storeName} находится по адресу {settings.address}. Режим работы: {settings.workingHours}.
        </p>
      </Card>

      <div className="mt-10">
        <ButtonLink href="/catalog">{dict.home.ctaButton}</ButtonLink>
      </div>
    </div>
  );
}
