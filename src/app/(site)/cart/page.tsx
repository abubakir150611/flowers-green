import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { CartView } from "@/components/cart/cart-view";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.cart.title, robots: { index: false } };
}

export default async function CartPage() {
  const settings = await getStoreSettings();
  return <CartView deliveryPrice={settings.deliveryPrice} minimumOrder={settings.minimumOrder} />;
}
