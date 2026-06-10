import { NextResponse } from "next/server";
import { previewOrderPricing } from "../../../../lib/order-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pricing = await previewOrderPricing({
      items: body.items ?? [],
      locale: body.locale ?? "en",
      guestEmail: body.guestEmail,
      referralCode: body.referralCode,
      pointsToRedeem: body.pointsToRedeem,
    });

    return NextResponse.json({ pricing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Preview failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
