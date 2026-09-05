import { customAlphabet } from "nanoid";

const digits = customAlphabet("0123456789", 6);

/** Generates an order number in the FG-XXXXXX format. Uniqueness is enforced
 * by the database's unique constraint; callers should retry on collision. */
export function generateOrderNumber(): string {
  return `FG-${digits()}`;
}
