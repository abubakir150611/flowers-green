import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { serializeCategory } from "@/lib/db/serializers";
import { categoryInputSchema } from "@/lib/validation/schemas";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ items: categories.map(serializeCategory) });
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = categoryInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.create({ data: parsed.data });
    return NextResponse.json({ item: serializeCategory(category) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Такой slug уже используется" }, { status: 409 });
    }
    console.error("[admin/categories] create failed", error);
    return NextResponse.json({ error: "Не удалось создать категорию" }, { status: 500 });
  }
}
