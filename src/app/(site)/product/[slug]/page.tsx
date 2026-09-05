import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { serializeProduct } from "@/lib/db/serializers";
import { getServerDictionary } from "@/lib/i18n/server";
import { localizedField, formatMoney } from "@/lib/format";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductActions } from "@/components/catalog/product-actions";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getServerDictionary();
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isPublished) return {};
  const name = localizedField(locale, product.nameRu, product.nameKg);
  const description = localizedField(locale, product.descriptionRu, product.descriptionKg) || name;
  return {
    title: name,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: { title: name, description },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, dict } = await getServerDictionary();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true },
  });

  if (!product || !product.isPublished) notFound();

  const similar = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isPublished: true, id: { not: product.id } },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { images: true, category: true },
  });

  const dto = serializeProduct(product);
  const name = localizedField(locale, dto.nameRu, dto.nameKg);
  const description = localizedField(locale, dto.descriptionRu, dto.descriptionKg);
  const composition = localizedField(locale, dto.compositionRu, dto.compositionKg);
  const care = localizedField(locale, dto.careRu, dto.careKg);
  const discount = dto.oldPrice && dto.oldPrice > dto.price
    ? Math.round(100 - (dto.price / dto.oldPrice) * 100)
    : null;

  const tabs = [
    {
      key: "description",
      label: dict.product.tabDescription,
      content: <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-graphite-soft">{description || dict.product.noDescription}</p>,
    },
    {
      key: "characteristics",
      label: dict.product.tabCharacteristics,
      content: dto.characteristics && Object.keys(dto.characteristics).length > 0 ? (
        <dl className="grid max-w-md grid-cols-2 gap-y-2 text-sm">
          {Object.entries(dto.characteristics).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-graphite-faint">{key}</dt>
              <dd className="text-graphite">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-graphite-faint">{dict.product.noCharacteristics}</p>
      ),
    },
    {
      key: "composition",
      label: dict.product.tabComposition,
      content: <p className="max-w-2xl text-sm leading-relaxed text-graphite-soft">{composition || dict.product.noComposition}</p>,
    },
    {
      key: "care",
      label: dict.product.tabCare,
      content: <p className="max-w-2xl text-sm leading-relaxed text-graphite-soft">{care || dict.product.noCare}</p>,
    },
    {
      key: "delivery",
      label: dict.product.tabDelivery,
      content: <p className="max-w-2xl text-sm leading-relaxed text-graphite-soft">{dict.product.deliveryTabText}</p>,
    },
    {
      key: "reviews",
      label: dict.product.tabReviews,
      content: <p className="text-sm text-graphite-faint">{dict.product.noReviews}</p>,
    },
  ];

  return (
    <div className="container-page py-10 md:py-14">
      <ProductJsonLd product={dto} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.product.breadcrumbHome, url: "/" },
          { name: dict.product.breadcrumbCatalog, url: "/catalog" },
          { name, url: `/product/${slug}` },
        ]}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-graphite-faint" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-green focus-ring rounded">{dict.product.breadcrumbHome}</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-green focus-ring rounded">{dict.product.breadcrumbCatalog}</Link>
        <span>/</span>
        <Link href={`/catalog/${dto.categorySlug}`} className="hover:text-green focus-ring rounded">
          {localizedField(locale, dto.categoryNameRu, dto.categoryNameKg)}
        </Link>
        <span>/</span>
        <span className="text-graphite">{name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={dto.images} alt={name} />

        <div>
          <p className="text-xs uppercase tracking-wide text-graphite-faint">
            {localizedField(locale, dto.categoryNameRu, dto.categoryNameKg)}
          </p>
          <h1 className="mt-1.5 font-display text-3xl text-graphite">{name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {dto.isNew && <Badge tone="green">{dict.product.new}</Badge>}
            {dto.featured && <Badge tone="ivory">{dict.product.popular}</Badge>}
            {discount && <Badge tone="rose">-{discount}%</Badge>}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-graphite">{formatMoney(dto.price, locale)}</span>
            {dto.oldPrice && dto.oldPrice > dto.price && (
              <span className="text-lg text-graphite-faint line-through">
                {formatMoney(dto.oldPrice, locale)}
              </span>
            )}
          </div>

          <p className={`mt-2 text-sm font-medium ${dto.stock > 0 ? "text-green" : "text-rose"}`}>
            {dto.stock > 5
              ? dict.product.inStock
              : dto.stock > 0
                ? `${dict.product.lowStock} (${dto.stock})`
                : dict.product.outOfStock}
          </p>

          <div className="mt-6">
            <ProductActions product={dto} />
          </div>

          <p className="mt-6 text-xs text-graphite-faint">
            {dict.product.sku}: {dto.sku}
          </p>
        </div>
      </div>

      <div className="mt-14">
        <Tabs items={tabs} />
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl text-graphite">{dict.product.similarTitle}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={serializeProduct(p)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
