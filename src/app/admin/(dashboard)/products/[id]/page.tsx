import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { serializeCategory, serializeProduct } from "@/lib/db/serializers";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: true, category: true } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-graphite">{product.nameRu}</h1>
        <DeleteProductButton productId={product.id} />
      </div>
      <ProductForm categories={categories.map((c) => serializeCategory(c))} product={serializeProduct(product)} />
    </div>
  );
}
