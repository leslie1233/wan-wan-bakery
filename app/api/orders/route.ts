import { NextResponse } from "next/server";
import { createOrder } from "../../../lib/order-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOrder({
      items: body.items ?? [],
      locale: body.locale ?? "en",
      pickupDate: body.pickupDate,
      notes: body.notes,
      guestEmail: body.guestEmail,
      guestName: body.guestName,
      guestPhone: body.guestPhone,
      referralCode: body.referralCode,
      pointsToRedeem: body.pointsToRedeem,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
