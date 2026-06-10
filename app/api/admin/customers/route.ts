import { NextResponse } from "next/server";
import { requireAdminSession } from "../../../../lib/auth-helpers";
import { prisma } from "../../../../lib/db";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      referralCode: true,
      loyaltyPoints: true,
      createdAt: true,
      _count: { select: { orders: true, referrals: true } },
    },
  });

  return NextResponse.json({ customers });
}
