import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { serializeProduct } from "@/lib/db/serializers";
import { productInputSchema } from "@/lib/validation/schemas";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = params.get("search")?.trim();
  const categoryId = params.get("categoryId")?.trim();
  const status = params.get("status"); // "published" | "hidden" | undefined
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize") ?? "20") || 20));

  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.OR = [
      { nameRu: { contains: search, mode: "insensitive" } },
      { nameKg: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (status === "published") where.isPublished = true;
  if (status === "hidden") where.isPublished = false;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
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

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = productInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { images, ...data } = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        characteristics: data.characteristics ?? Prisma.JsonNull,
        images: { create: images.map((img, i) => ({ ...img, sortOrder: img.sortOrder ?? i })) },
      },
      include: { images: true, category: true },
    });
    return NextResponse.json({ item: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta?.target as string[] | undefined)?.join(", ") ?? "поле";
      return NextResponse.json(
        { error: `Значение уже используется: ${target}` },
        { status: 409 }
      );
    }
    console.error("[admin/products] create failed", error);
    return NextResponse.json({ error: "Не удалось создать товар" }, { status: 500 });
  }
}
