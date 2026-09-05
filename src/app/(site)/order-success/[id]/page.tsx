import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getStoreSettings, buildTelUrl } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { formatMoney } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.orderSuccess.title, robots: { index: false } };
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dict } = await getServerDictionary();
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({ where: { id } }),
    getStoreSettings(),
  ]);

  if (!order) notFound();

  return (
    <div className="container-page flex flex-col items-center py-16 text-center md:py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-green">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-graphite">{dict.orderSuccess.title}</h1>
      <p className="mt-2 text-graphite-soft">{dict.orderSuccess.subtitle}</p>

      <Card className="mt-8 w-full max-w-md p-6 text-left">
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-graphite-faint">{dict.orderSuccess.orderNumber}</span>
            <span className="font-semibold text-graphite">#{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-graphite-faint">{dict.orderSuccess.deliveryMethod}</span>
            <span className="text-graphite">{dict.deliveryMethod[order.deliveryMethod]}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
            <span className="text-graphite">{dict.orderSuccess.total}</span>
            <span className="text-graphite">{formatMoney(order.totalAmount)}</span>
          </div>
        </div>
      </Card>

      <div className="mt-6 max-w-md rounded-md bg-ivory-deep p-4 text-sm text-graphite-soft">
        <p>{dict.orderSuccess.contactTitle}</p>
        <p className="mt-1">
          {dict.orderSuccess.contact}:{" "}
          <a href={buildTelUrl(settings.phone)} className="font-medium text-green">
            {settings.phone}
          </a>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">{dict.orderSuccess.backHome}</ButtonLink>
        <ButtonLink href="/catalog" variant="outline">
          {dict.orderSuccess.continueShopping}
        </ButtonLink>
      </div>
    </div>
  );
}
