import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return new Response("ok", { status: 200 });
}
