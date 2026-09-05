import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

const MAX_SIZE_BYTES = 8 * 1024 * 1024;

/**
 * Stores uploaded product/category/hero images on local disk under
 * /public/uploads. This is the simplest option for a single-instance Node
 * deployment (VPS, Docker). Serverless/edge hosts with an ephemeral or
 * read-only filesystem (e.g. Vercel) need a real object store (S3-compatible
 * bucket, Cloudinary, etc.) instead — swap this route's storage backend
 * accordingly, the rest of the admin UI only cares about the returned URL.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }

  if (!(file.type in ALLOWED_TYPES)) {
    return NextResponse.json({ error: "Недопустимый формат изображения" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Файл слишком большой (максимум 8МБ)" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  const filename = `${randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
