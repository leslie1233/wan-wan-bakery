import { NextResponse } from "next/server";
import {
  createCustomerSessionToken,
  registerCustomer,
  setCustomerSessionCookie,
} from "../../../../lib/customer-auth";
import { sendWelcomeEmail } from "../../../../lib/email";
import { getRewardsSettings } from "../../../../lib/rewards-settings";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await registerCustomer({
      email: body.email ?? "",
      password: body.password ?? "",
      name: body.name ?? "",
      phone: body.phone ?? "",
      referralCode: body.referralCode ?? "",
    });

    const token = await createCustomerSessionToken({
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
    });

    await setCustomerSessionCookie(token);

    const rewards = await getRewardsSettings();
    await sendWelcomeEmail(
      {
        name: customer.name,
        email: customer.email,
        referralCode: customer.referralCode,
      },
      rewards.fromEmail
    );

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        referralCode: customer.referralCode,
        loyaltyPoints: customer.loyaltyPoints,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
