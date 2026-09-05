import { NextRequest, NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const period = Number(request.nextUrl.searchParams.get("period") ?? "30");
  const validPeriod = period === 7 || period === 90 ? period : 30;
  const data = await getAnalytics(validPeriod);
  return NextResponse.json(data);
}
