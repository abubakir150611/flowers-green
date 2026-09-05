import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { serializeCategory } from "@/lib/db/serializers";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isPublished: true } } } } },
  });

  return NextResponse.json({ items: categories.map(serializeCategory) });
}
