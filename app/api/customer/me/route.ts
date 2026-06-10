import { NextResponse } from "next/server";
import {
  countPreviousOrders,
  getCustomerProfile,
  getCustomerSession,
} from "../../../../lib/customer-auth";
import { getRewardsSettings } from "../../../../lib/rewards-settings";

export async function GET() {
  const session = await getCustomerSession();

  if (!session) {
    return NextResponse.json({ customer: null });
  }

  const customer = await getCustomerProfile(session.customerId);

  if (!customer) {
    return NextResponse.json({ customer: null });
  }

  const orderCount = await countPreviousOrders({ customerId: customer.id });
  const rewards = await getRewardsSettings();

  return NextResponse.json({
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      referralCode: customer.referralCode,
      loyaltyPoints: customer.loyaltyPoints,
      orderCount,
      memberSince: customer.createdAt.toISOString(),
    },
    rewards: {
      firstOrderDiscountPercent: rewards.firstOrderDiscountPercent,
      referralDiscountPercent: rewards.referralDiscountPercent,
      pointsRedemptionRate: rewards.pointsRedemptionRate,
      pointsRedemptionValueCents: rewards.pointsRedemptionValueCents,
      referrerPointsReward: rewards.referrerPointsReward,
      pointsPerDollar: rewards.pointsPerDollar,
    },
  });
}
