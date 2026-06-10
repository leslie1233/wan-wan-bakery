import { NextResponse } from "next/server";
import {
  createCustomerSessionToken,
  loginCustomer,
  setCustomerSessionCookie,
} from "../../../../lib/customer-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const customer = await loginCustomer(body.email ?? "", body.password ?? "");

  if (!customer) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createCustomerSessionToken({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
  });

  await setCustomerSessionCookie(token);

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
}
