import { NextResponse } from "next/server";
import { requireAdminSession } from "../../../../lib/auth-helpers";
import { prisma } from "../../../../lib/db";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.rewardsSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const settings = await prisma.rewardsSettings.upsert({
    where: { id: "default" },
    update: {
      active: Boolean(body.active),
      ownerEmail: String(body.ownerEmail ?? "").trim(),
      fromEmail: String(body.fromEmail ?? "").trim(),
      firstOrderDiscountPercent: Number(body.firstOrderDiscountPercent) || 0,
      referralDiscountPercent: Number(body.referralDiscountPercent) || 0,
      referrerPointsReward: Number(body.referrerPointsReward) || 0,
      pointsPerDollar: Number(body.pointsPerDollar) || 0,
      pointsRedemptionRate: Number(body.pointsRedemptionRate) || 100,
      pointsRedemptionValueCents: Number(body.pointsRedemptionValueCents) || 0,
    },
    create: {
      id: "default",
      active: Boolean(body.active),
      ownerEmail: String(body.ownerEmail ?? "sdksdk77@hotmail.com").trim(),
      fromEmail: String(body.fromEmail ?? "Wan Wan Bakery <orders@wanwanbakery.com>").trim(),
      firstOrderDiscountPercent: Number(body.firstOrderDiscountPercent) || 10,
      referralDiscountPercent: Number(body.referralDiscountPercent) || 10,
      referrerPointsReward: Number(body.referrerPointsReward) || 500,
      pointsPerDollar: Number(body.pointsPerDollar) || 1,
      pointsRedemptionRate: Number(body.pointsRedemptionRate) || 100,
      pointsRedemptionValueCents: Number(body.pointsRedemptionValueCents) || 500,
    },
  });

  return NextResponse.json({ settings });
}
