"use client";

import { useDictionary } from "./LocaleProvider";

type PromotionBannerProps = {
  standalone?: boolean;
};

export default function PromotionBanner({
  standalone = false,
}: PromotionBannerProps) {
  const dict = useDictionary();

  const card = (
    <div className="promotion-card">
      <p className="promotion-eyebrow">{dict.promotion.eyebrow}</p>
      <h2>{dict.promotion.title}</h2>
      <p className="promotion-intro">{dict.promotion.intro}</p>
      <ul className="promotion-list">
        <li>
          <strong>{dict.promotion.tier5}</strong>
        </li>
        <li>
          <strong>{dict.promotion.tier10}</strong>
        </li>
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
