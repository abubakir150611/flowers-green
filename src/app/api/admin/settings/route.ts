import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getStoreSettings } from "@/lib/settings";
import { storeSettingsInputSchema } from "@/lib/validation/schemas";

export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json({ item: settings });
}

export async function PUT(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = storeSettingsInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const settings = await prisma.storeSettings.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });

  return NextResponse.json({ item: settings });
}
