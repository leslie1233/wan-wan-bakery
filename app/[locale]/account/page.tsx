import { getCustomerProfile, getCustomerSession, countPreviousOrders } from "../../../lib/customer-auth";
import { getRewardsSettings } from "../../../lib/rewards-settings";
import AccountPageClient from "./AccountPageClient";

export default async function AccountPage() {
  const session = await getCustomerSession();
  const rewards = await getRewardsSettings();

  let initialCustomer = null;

  if (session) {
    const customer = await getCustomerProfile(session.customerId);

    if (customer) {
      const orderCount = await countPreviousOrders({ customerId: customer.id });

      initialCustomer = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        referralCode: customer.referralCode,
        loyaltyPoints: customer.loyaltyPoints,
        orderCount,
      };
    }
  }

  return (
    <AccountPageClient
      initialCustomer={initialCustomer}
      initialRewards={{
        firstOrderDiscountPercent: rewards.firstOrderDiscountPercent,
        referralDiscountPercent: rewards.referralDiscountPercent,
        pointsRedemptionRate: rewards.pointsRedemptionRate,
        pointsRedemptionValueCents: rewards.pointsRedemptionValueCents,
        referrerPointsReward: rewards.referrerPointsReward,
        pointsPerDollar: rewards.pointsPerDollar,
      }}
    />
  );
}
