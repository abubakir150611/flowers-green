import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { serializeProduct } from "@/lib/db/serializers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true },
  });

  if (!product || !product.isPublished) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const similar = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isPublished: true,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { images: true, category: true },
  });

  return NextResponse.json({
    product: serializeProduct(product),
    similar: similar.map(serializeProduct),
  });
}
