import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/catalog/product-card";
import type { ProductDTO } from "@/lib/types";

export function ProductsSection({
  title,
  subtitle,
  href,
  hrefLabel,
  products,
  tone = "default",
}: {
  title: string;
  subtitle?: string;
  href: string;
  hrefLabel: string;
  products: ProductDTO[];
  tone?: "default" | "muted";
}) {
  if (products.length === 0) return null;

  return (
    <section className={tone === "muted" ? "bg-ivory-deep/60 py-14 md:py-20" : "py-14 md:py-20"}>
      <div className="container-page">
        <SectionHeading title={title} subtitle={subtitle} href={href} hrefLabel={hrefLabel} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
