import { orderEvents, type NewOrderEvent } from "@/lib/realtime/order-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  let onNewOrder: (event: NewOrderEvent) => void;
  let heartbeat: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`: connected\n\n`));

      onNewOrder = (event) => {
        controller.enqueue(
          encoder.encode(`event: order:new\ndata: ${JSON.stringify(event)}\n\n`)
        );
      };
      orderEvents.on("order:new", onNewOrder);

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 25000);
    },
    cancel() {
      orderEvents.off("order:new", onNewOrder);
      clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
