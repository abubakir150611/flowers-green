import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { generateOrderNumber } from "./order-number";
import type { CheckoutInput } from "@/lib/validation/schemas";
import { getStoreSettings } from "@/lib/settings";

export class OrderCreationError extends Error {
  constructor(
    message: string,
    public code: "OUT_OF_STOCK" | "PRODUCT_UNAVAILABLE" | "BELOW_MINIMUM" | "EMPTY_CART",
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}

const MAX_ORDER_NUMBER_ATTEMPTS = 5;

export async function createOrder(input: CheckoutInput) {
  const settings = await getStoreSettings();

  const dedupedItems = new Map<string, number>();
  for (const item of input.items) {
    dedupedItems.set(item.productId, (dedupedItems.get(item.productId) ?? 0) + item.quantity);
  }
  if (dedupedItems.size === 0) {
    throw new OrderCreationError("Cart is empty", "EMPTY_CART");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ORDER_NUMBER_ATTEMPTS; attempt++) {
    const orderNumber = generateOrderNumber();

    try {
      return await prisma.$transaction(async (tx) => {
        const productIds = [...dedupedItems.keys()];
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });

        const productById = new Map(products.map((p) => [p.id, p]));
        let itemsAmount = 0;
        const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

        for (const [productId, quantity] of dedupedItems) {
          const product = productById.get(productId);
          if (!product || !product.isPublished) {
            throw new OrderCreationError(
              `Product unavailable: ${productId}`,
              "PRODUCT_UNAVAILABLE",
              { productId }
            );
          }

          const decremented = await tx.product.updateMany({
            where: { id: productId, stock: { gte: quantity } },
            data: { stock: { decrement: quantity } },
          });

          if (decremented.count === 0) {
            throw new OrderCreationError(
              `Not enough stock for ${product.nameRu}`,
              "OUT_OF_STOCK",
              { productId, productName: product.nameRu, available: product.stock }
            );
          }

          const lineTotal = product.price * quantity;
          itemsAmount += lineTotal;
          orderItemsData.push({
            productId: product.id,
            productName: product.nameRu,
            price: product.price,
            quantity,
            total: lineTotal,
          });
        }

        const deliveryAmount = input.deliveryMethod === "DELIVERY" ? settings.deliveryPrice : 0;
        const totalAmount = itemsAmount + deliveryAmount;

        if (settings.minimumOrder > 0 && totalAmount < settings.minimumOrder) {
          throw new OrderCreationError(
            "Order total is below the minimum",
            "BELOW_MINIMUM",
            { minimumOrder: settings.minimumOrder, totalAmount }
          );
        }

        const customer = await tx.customer.upsert({
          where: { phone: input.phone },
          update: { name: input.name },
          create: { phone: input.phone, name: input.name },
        });

        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId: customer.id,
            customerName: input.name,
            phone: input.phone,
            address: input.deliveryMethod === "DELIVERY" ? input.address : null,
            comment: input.comment ?? "",
            deliveryMethod: input.deliveryMethod,
            itemsAmount,
            deliveryAmount,
            totalAmount,
            items: { createMany: { data: orderItemsData } },
          },
          include: { items: true },
        });

        return order;
      });
    } catch (error) {
      if (error instanceof OrderCreationError) throw error;
      const isUniqueOrderNumberClash =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        (error.meta.target as string[]).includes("orderNumber");

      if (isUniqueOrderNumberClash) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Failed to generate a unique order number");
}
