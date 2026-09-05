import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { serializeProduct } from "@/lib/db/serializers";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category")?.trim();
  const search = params.get("search")?.trim();
  const ids = params.get("ids")?.trim();
  const sort = params.get("sort") ?? "popular";
  const minPrice = params.get("minPrice") ? Number(params.get("minPrice")) : undefined;
  const maxPrice = params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined;
  const inStock = params.get("inStock") === "1";
  const featured = params.get("featured") === "1";
  const isNew = params.get("isNew") === "1";
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const pageSize = Math.min(48, Math.max(1, Number(params.get("pageSize") ?? "12") || 12));

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (ids) {
    where.id = { in: ids.split(",").map((id) => id.trim()).filter(Boolean) };
  }
  if (category) {
    where.category = { slug: category, isActive: true };
  }
  if (search) {
    where.OR = [
      { nameRu: { contains: search, mode: "insensitive" } },
      { nameKg: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }
  if (inStock) {
    where.stock = { gt: 0 };
  }
  if (featured) where.featured = true;
  if (isNew) where.isNew = true;

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ featured: "desc" }, { createdAt: "desc" }];
  switch (sort) {
    case "new":
      orderBy = [{ isNew: "desc" }, { createdAt: "desc" }];
      break;
    case "price_asc":
      orderBy = [{ price: "asc" }];
      break;
    case "price_desc":
      orderBy = [{ price: "desc" }];
      break;
    case "name":
      orderBy = [{ nameRu: "asc" }];
      break;
    default:
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { images: true, category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map(serializeProduct),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
