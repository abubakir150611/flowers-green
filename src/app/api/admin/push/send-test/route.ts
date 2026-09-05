import { NextResponse } from "next/server";
import { sendPushToAllSubscribers } from "@/lib/push/send";

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const result = await sendPushToAllSubscribers({
    title: "Flowersgreen Admin",
    body: "Тестовое уведомление. Push-подписка работает корректно.",
    url: `${siteUrl}/admin`,
    tag: "test-notification",
  });
  return NextResponse.json(result);
}
