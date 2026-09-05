import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/catalog/search-view";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.nav.search, robots: { index: false } };
}

export default async function SearchPage() {
  return (
    <Suspense>
      <SearchView />
    </Suspense>
  );
}
