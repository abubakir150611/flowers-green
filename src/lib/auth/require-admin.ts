import { NextResponse } from "next/server";
import { getServerSession } from "./session";

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}
