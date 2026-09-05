import type { Metadata } from "next";
import { FavoritesView } from "@/components/catalog/favorites-view";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.favorites.title, robots: { index: false } };
}

export default function FavoritesPage() {
  return <FavoritesView />;
}
