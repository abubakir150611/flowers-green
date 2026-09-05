import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import { serializeCategory } from "@/lib/db/serializers";
import { CatalogView } from "@/components/catalog/catalog-view";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.catalog.title,
    description: dict.seo.homeDescription,
    alternates: { canonical: "/catalog" },
  };
}

export default async function CatalogPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container-page py-10 md:py-14">
      <Suspense>
        <CatalogView categories={categories.map((c) => serializeCategory(c))} />
      </Suspense>
    </div>
  );
}
