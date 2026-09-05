import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { serializeProduct } from "@/lib/db/serializers";
import { productInputSchema } from "@/lib/validation/schemas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: serializeProduct(product) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = productInputSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { images, characteristics, ...data } = parsed.data;

  try {
    const product = await prisma.$transaction(async (tx) => {
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
      }
      return tx.product.update({
        where: { id },
        data: {
          ...data,
          ...(characteristics !== undefined
            ? { characteristics: characteristics ?? Prisma.JsonNull }
            : {}),
          ...(images
            ? {
                images: {
                  create: images.map((img, i) => ({ ...img, sortOrder: img.sortOrder ?? i })),
                },
              }
            : {}),
        },
        include: { images: true, category: true },
      });
    });
    return NextResponse.json({ item: serializeProduct(product) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta?.target as string[] | undefined)?.join(", ") ?? "поле";
      return NextResponse.json(
        { error: `Значение уже используется: ${target}` },
        { status: 409 }
      );
    }
    console.error("[admin/products] update failed", error);
    return NextResponse.json({ error: "Не удалось сохранить товар" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }
    console.error("[admin/products] delete failed", error);
    return NextResponse.json({ error: "Не удалось удалить товар" }, { status: 500 });
  }
}
