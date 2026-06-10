"use client";

import AccountPanel from "../../../components/AccountPanel";
import { useDictionary, useLocale } from "../../../components/LocaleProvider";
import { localePath } from "../../../lib/i18n/paths";
import Link from "next/link";

type AccountPageClientProps = {
  initialCustomer: {
    id: string;
    email: string;
    name: string;
    phone: string;
    referralCode: string;
    loyaltyPoints: number;
    orderCount: number;
  } | null;
  initialRewards: {
    firstOrderDiscountPercent: number;
    referralDiscountPercent: number;
    pointsRedemptionRate: number;
    pointsRedemptionValueCents: number;
    referrerPointsReward: number;
    pointsPerDollar: number;
  } | null;
};

export default function AccountPageClient({
  initialCustomer,
  initialRewards,
}: AccountPageClientProps) {
  const dict = useDictionary();
  const { locale } = useLocale();

  return (
    <main className="container section page-main content-page">
      <h1>{dict.account.title}</h1>
      <AccountPanel initialCustomer={initialCustomer} initialRewards={initialRewards} />

      <div className="account-benefits section">
        <h2>{dict.account.benefitsTitle}</h2>
        <ul>
          <li>{dict.account.benefitPoints}</li>
          <li>{dict.account.benefitFirstOrder}</li>
          <li>{dict.account.benefitReferral}</li>
          <li>{dict.account.benefitEmail}</li>
        </ul>
        <div className="cta">
          <Link className="button" href={localePath(locale, "/products")}>
            {dict.account.shopNow}
          </Link>
        </div>
      </div>
    </main>
  );
}
