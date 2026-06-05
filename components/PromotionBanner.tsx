import { promotionTiers, promotionTitle } from "../data/promotions";

type PromotionBannerProps = {
  standalone?: boolean;
};

export default function PromotionBanner({
  standalone = false,
}: PromotionBannerProps) {
  const card = (
    <div className="promotion-card">
      <p className="promotion-eyebrow">Special offer</p>
      <h2>{promotionTitle}</h2>
      <p className="promotion-intro">
        Order more and save. Discount applies to total quantity across your order.
      </p>
      <ul className="promotion-list">
        {promotionTiers.map((tier) => (
          <li key={tier.minQuantity}>
            <strong>{tier.label}</strong>
          </li>
        ))}
      </ul>
    </div>
  );

  if (standalone) {
    return (
      <section className="container section promotion-section">{card}</section>
    );
  }

  return <div className="promotion-section">{card}</div>;
}
