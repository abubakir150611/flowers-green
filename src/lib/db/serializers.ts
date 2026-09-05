import type { Category, Product, ProductImage } from "@prisma/client";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category;
};

export function serializeProduct(p: ProductWithRelations): ProductDTO {
  return {
    id: p.id,
    nameRu: p.nameRu,
    nameKg: p.nameKg,
    slug: p.slug,
    brand: p.brand,
    categoryId: p.categoryId,
    categorySlug: p.category.slug,
    categoryNameRu: p.category.nameRu,
    categoryNameKg: p.category.nameKg,
    price: p.price,
    oldPrice: p.oldPrice,
    stock: p.stock,
    sku: p.sku,
    descriptionRu: p.descriptionRu,
    descriptionKg: p.descriptionKg,
    compositionRu: p.compositionRu,
    compositionKg: p.compositionKg,
    careRu: p.careRu,
    careKg: p.careKg,
    characteristics: (p.characteristics as Record<string, string> | null) ?? null,
    images: [...p.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({ id: img.id, url: img.url, alt: img.alt, sortOrder: img.sortOrder })),
    isPublished: p.isPublished,
    featured: p.featured,
    isNew: p.isNew,
    createdAt: p.createdAt.toISOString(),
  };
}

export function serializeCategory(
  c: Category & { _count?: { products: number } }
): CategoryDTO {
  return {
    id: c.id,
    nameRu: c.nameRu,
    nameKg: c.nameKg,
    slug: c.slug,
    descriptionRu: c.descriptionRu,
    descriptionKg: c.descriptionKg,
    image: c.image,
    isActive: c.isActive,
    sortOrder: c.sortOrder,
    productCount: c._count?.products,
  };
}
