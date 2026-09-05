import { prisma } from "@/lib/db/prisma";
import { serializeCategory } from "@/lib/db/serializers";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-graphite">Новый товар</h1>
      <ProductForm categories={categories.map((c) => serializeCategory(c))} />
    </div>
  );
}
