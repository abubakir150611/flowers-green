import type { StoreSettings } from "@prisma/client";
import type { ProductDTO } from "@/lib/types";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd({ settings }: { settings: StoreSettings }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FloristShop",
        name: settings.storeName,
        image: settings.heroImage ? `${siteUrl}${settings.heroImage}` : undefined,
        telephone: settings.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressLocality: "Бишкек",
          addressCountry: "KG",
        },
        openingHours: settings.workingHours,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: settings.ratingValue,
          reviewCount: settings.ratingCount,
        },
        url: siteUrl,
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: ProductDTO }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.nameRu,
        sku: product.sku,
        image: product.images.map((i) => `${siteUrl}${i.url}`),
        description: product.descriptionRu || product.nameRu,
        offers: {
          "@type": "Offer",
          priceCurrency: "KGS",
          price: product.price,
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${siteUrl}/product/${product.slug}`,
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${siteUrl}${item.url}`,
        })),
      }}
    />
  );
}
