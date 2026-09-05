import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.checkout.title, robots: { index: false } };
}

export default async function CheckoutPage() {
  const { dict } = await getServerDictionary();
  const settings = await getStoreSettings();

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="mb-8 font-display text-3xl text-graphite">{dict.checkout.title}</h1>
      <CheckoutForm
        deliveryPrice={settings.deliveryPrice}
        minimumOrder={settings.minimumOrder}
        pickupAddress={settings.address}
        pickupPhone={settings.phone}
      />
    </div>
  );
}
