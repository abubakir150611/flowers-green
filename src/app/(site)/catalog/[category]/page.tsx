import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { serializeCategory } from "@/lib/db/serializers";
import { CatalogView } from "@/components/catalog/catalog-view";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizedField } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const { locale } = await getServerDictionary();
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  const name = localizedField(locale, category.nameRu, category.nameKg);
  return {
    title: name,
    description: localizedField(locale, category.descriptionRu, category.descriptionKg) || name,
    alternates: { canonical: `/catalog/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;

  const [categories, category] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.category.findUnique({ where: { slug } }),
  ]);

  if (!category || !category.isActive) notFound();

  return (
    <div className="container-page py-10 md:py-14">
      <Suspense>
        <CatalogView
          categories={categories.map((c) => serializeCategory(c))}
          fixedCategorySlug={slug}
        />
      </Suspense>
    </div>
  );
}
