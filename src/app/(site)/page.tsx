import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { getStoreSettings } from "@/lib/settings";
import { getServerDictionary } from "@/lib/i18n/server";
import { serializeCategory, serializeProduct } from "@/lib/db/serializers";
import { Hero } from "@/components/home/hero";
import { CategoriesSection } from "@/components/home/categories-section";
import { ProductsSection } from "@/components/home/products-section";
import {
  AboutSection,
  BenefitsSection,
  DeliverySection,
  GiftsSection,
  CTASection,
  ContactsSection,
} from "@/components/home/marketing-sections";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.seo.homeTitle,
    description: dict.seo.homeDescription,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const { locale, dict } = await getServerDictionary();
  const [settings, categories, popular, newest] = await Promise.all([
    getStoreSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { isPublished: true } } } } },
    }),
    prisma.product.findMany({
      where: { isPublished: true, featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { images: true, category: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true, isNew: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { images: true, category: true },
    }),
  ]);

  return (
    <>
      <OrganizationJsonLd settings={settings} />
      <Hero settings={settings} locale={locale} dict={dict} />
      <CategoriesSection categories={categories.map(serializeCategory)} dict={dict} />
      <ProductsSection
        title={dict.home.popularTitle}
        subtitle={dict.home.popularSubtitle}
        href="/catalog?sort=popular"
        hrefLabel={dict.common.seeAll}
        products={popular.map(serializeProduct)}
      />
      <ProductsSection
        title={dict.home.newTitle}
        subtitle={dict.home.newSubtitle}
        href="/catalog?sort=new"
        hrefLabel={dict.common.seeAll}
        products={newest.map(serializeProduct)}
        tone="muted"
      />
      <AboutSection dict={dict} />
      <BenefitsSection dict={dict} />
      <DeliverySection dict={dict} />
      <GiftsSection dict={dict} />
      <CTASection dict={dict} />
      <ContactsSection settings={settings} dict={dict} locale={locale} />
    </>
  );
}
