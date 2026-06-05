import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "wan-wan-bakery",
    timestamp: new Date().toISOString(),
  });
}
