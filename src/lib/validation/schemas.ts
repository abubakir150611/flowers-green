import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const phoneSchema = z
  .string()
  .trim()
  .min(6)
  .max(32)
  .regex(/^[+0-9()\s-]+$/, "invalid phone");

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: phoneSchema,
    address: z.string().trim().max(500).optional().default(""),
    comment: z.string().trim().max(1000).optional().default(""),
    deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
    items: z.array(checkoutItemSchema).min(1).max(50),
  })
  .refine(
    (data) => data.deliveryMethod === "PICKUP" || data.address.trim().length > 0,
    { message: "address required for delivery", path: ["address"] }
  );

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "CONFIRMED",
    "PROCESSING",
    "READY",
    "DELIVERING",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export const categoryInputSchema = z.object({
  nameRu: z.string().trim().min(1).max(200),
  nameKg: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, digits and hyphens"),
  descriptionRu: z.string().trim().max(2000).optional().default(""),
  descriptionKg: z.string().trim().max(2000).optional().default(""),
  image: z.string().trim().max(2000).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const productImageInputSchema = z.object({
  url: z.string().trim().min(1).max(2000),
  alt: z.string().trim().max(300).optional().default(""),
  sortOrder: z.number().int().optional().default(0),
});

export const productInputSchema = z.object({
  nameRu: z.string().trim().min(1).max(300),
  nameKg: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, digits and hyphens"),
  brand: z.string().trim().max(200).optional().nullable(),
  categoryId: z.string().min(1),
  price: z.number().int().min(0).max(10_000_000),
  oldPrice: z.number().int().min(0).max(10_000_000).optional().nullable(),
  stock: z.number().int().min(0).max(1_000_000),
  sku: z.string().trim().min(1).max(100),
  descriptionRu: z.string().trim().max(5000).optional().default(""),
  descriptionKg: z.string().trim().max(5000).optional().default(""),
  compositionRu: z.string().trim().max(2000).optional().default(""),
  compositionKg: z.string().trim().max(2000).optional().default(""),
  careRu: z.string().trim().max(2000).optional().default(""),
  careKg: z.string().trim().max(2000).optional().default(""),
  characteristics: z.record(z.string(), z.string()).optional().nullable(),
  images: z.array(productImageInputSchema).max(20).optional().default([]),
  isPublished: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(false),
});

export const storeSettingsInputSchema = z.object({
  storeName: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(60),
  whatsapp: z.string().trim().min(1).max(60),
  address: z.string().trim().min(1).max(500),
  workingHours: z.string().trim().min(1).max(200),
  deliveryPrice: z.number().int().min(0).max(1_000_000),
  minimumOrder: z.number().int().min(0).max(1_000_000),
  instagram: z.string().trim().max(500).optional().nullable(),
  whatsappMessageRu: z.string().trim().max(500).optional().default(""),
  whatsappMessageKg: z.string().trim().max(500).optional().default(""),
  heroTitleRu: z.string().trim().max(300).optional().default(""),
  heroTitleKg: z.string().trim().max(300).optional().default(""),
  heroSubtitleRu: z.string().trim().max(500).optional().default(""),
  heroSubtitleKg: z.string().trim().max(500).optional().default(""),
  heroImage: z.string().trim().max(2000).optional().nullable(),
  deliveryTextRu: z.string().trim().max(4000).optional().default(""),
  deliveryTextKg: z.string().trim().max(4000).optional().default(""),
  mapUrl: z.string().trim().max(2000).optional().nullable(),
});
