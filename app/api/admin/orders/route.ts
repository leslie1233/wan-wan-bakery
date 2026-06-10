import { NextResponse } from "next/server";
import { requireAdminSession } from "../../../../lib/auth-helpers";
import { prisma } from "../../../../lib/db";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      customer: { select: { email: true, name: true } },
      items: true,
    },
  });

  return NextResponse.json({ orders });
}
