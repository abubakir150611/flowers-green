export type ProductImageDTO = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type ProductDTO = {
  id: string;
  nameRu: string;
  nameKg: string;
  slug: string;
  brand: string | null;
  categoryId: string;
  categorySlug: string;
  categoryNameRu: string;
  categoryNameKg: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  sku: string;
  descriptionRu: string;
  descriptionKg: string;
  compositionRu: string;
  compositionKg: string;
  careRu: string;
  careKg: string;
  characteristics: Record<string, string> | null;
  images: ProductImageDTO[];
  isPublished: boolean;
  featured: boolean;
  isNew: boolean;
  createdAt: string;
};

export type CategoryDTO = {
  id: string;
  nameRu: string;
  nameKg: string;
  slug: string;
  descriptionRu: string;
  descriptionKg: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
};

export type CartLine = {
  productId: string;
  slug: string;
  nameRu: string;
  nameKg: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
};
