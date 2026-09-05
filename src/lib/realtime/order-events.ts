import { EventEmitter } from "node:events";

export type NewOrderEvent = {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  createdAt: string;
};

const globalForEvents = globalThis as unknown as { fgOrderEvents?: EventEmitter };

/**
 * Single-process pub/sub used to push "new order" events to connected admin
 * SSE clients in real time. Fine for a single Node instance; a multi-instance
 * deployment should swap this for Redis pub/sub or similar.
 */
export const orderEvents: EventEmitter =
  globalForEvents.fgOrderEvents ??
  (globalForEvents.fgOrderEvents = new EventEmitter().setMaxListeners(50));

export function emitNewOrder(event: NewOrderEvent) {
  orderEvents.emit("order:new", event);
}
