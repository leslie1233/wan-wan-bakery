import type { PromotionView } from "../lib/catalog-types";

type PromotionBannerProps = {
  promotion: PromotionView;
  standalone?: boolean;
};

export default function PromotionBanner({
  promotion,
  standalone = false,
}: PromotionBannerProps) {
  if (!promotion.active) {
    return null;
  }

  const card = (
    <div className="promotion-card">
      <p className="promotion-eyebrow">{promotion.eyebrow}</p>
      <h2>{promotion.title}</h2>
      <p className="promotion-intro">{promotion.intro}</p>
      <ul className="promotion-list">
        {promotion.tiers.map((tier) => (
          <li key={`${tier.minQuantity}-${tier.discountPercent}`}>
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
