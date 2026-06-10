import { prisma } from "./db";

export type RewardsSettingsView = {
  active: boolean;
  ownerEmail: string;
  fromEmail: string;
  firstOrderDiscountPercent: number;
  referralDiscountPercent: number;
  referrerPointsReward: number;
  pointsPerDollar: number;
  pointsRedemptionRate: number;
  pointsRedemptionValueCents: number;
};

const defaultRewardsSettings: RewardsSettingsView = {
  active: true,
  ownerEmail: "sdksdk77@hotmail.com",
  fromEmail: "Wan Wan Bakery <orders@wanwanbakery.com>",
  firstOrderDiscountPercent: 10,
  referralDiscountPercent: 10,
  referrerPointsReward: 500,
  pointsPerDollar: 1,
  pointsRedemptionRate: 100,
  pointsRedemptionValueCents: 500,
};

export async function getRewardsSettings(): Promise<RewardsSettingsView> {
  try {
    const settings = await prisma.rewardsSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return defaultRewardsSettings;
    }

    return {
      active: settings.active,
      ownerEmail: settings.ownerEmail,
      fromEmail: settings.fromEmail,
      firstOrderDiscountPercent: settings.firstOrderDiscountPercent,
      referralDiscountPercent: settings.referralDiscountPercent,
      referrerPointsReward: settings.referrerPointsReward,
      pointsPerDollar: settings.pointsPerDollar,
      pointsRedemptionRate: settings.pointsRedemptionRate,
      pointsRedemptionValueCents: settings.pointsRedemptionValueCents,
    };
  } catch {
    return defaultRewardsSettings;
  }
}

export function pointsToDiscountCents(
  points: number,
  settings: Pick<
    RewardsSettingsView,
    "pointsRedemptionRate" | "pointsRedemptionValueCents"
  >
): number {
  if (points <= 0 || settings.pointsRedemptionRate <= 0) {
    return 0;
  }

  const blocks = Math.floor(points / settings.pointsRedemptionRate);
  return blocks * settings.pointsRedemptionValueCents;
}

export function discountCentsToPoints(
  discountCents: number,
  settings: Pick<
    RewardsSettingsView,
    "pointsRedemptionRate" | "pointsRedemptionValueCents"
  >
): number {
  if (discountCents <= 0 || settings.pointsRedemptionValueCents <= 0) {
    return 0;
  }

  const blocks = Math.floor(discountCents / settings.pointsRedemptionValueCents);
  return blocks * settings.pointsRedemptionRate;
}

export function calculatePointsEarned(
  totalCents: number,
  settings: Pick<RewardsSettingsView, "pointsPerDollar">
): number {
  if (totalCents <= 0 || settings.pointsPerDollar <= 0) {
    return 0;
  }

  return Math.floor(totalCents / 100) * settings.pointsPerDollar;
}
