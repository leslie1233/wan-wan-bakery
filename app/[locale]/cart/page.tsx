"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CartPromotionNote from "../../../components/CartPromotionNote";
import { useCart } from "../../../components/CartProvider";
import { useDictionary, useLocale } from "../../../components/LocaleProvider";
import { useSiteSettings } from "../../../components/SiteSettingsProvider";
import WhatsAppLink from "../../../components/WhatsAppLink";
import { calculateCartPricing } from "../../../lib/cart-pricing";
import type { PromotionView } from "../../../lib/catalog-types";
import { formatPrice } from "../../../lib/format";
import { localePath } from "../../../lib/i18n/paths";
import { buildWhatsAppUrl } from "../../../lib/whatsapp";
import { cartOrderMessage } from "../../../lib/whatsapp-messages";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { locale } = useLocale();
  const dict = useDictionary();
  const contact = useSiteSettings();
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [promotion, setPromotion] = useState<PromotionView | null>(null);
  const [copiedPayNow, setCopiedPayNow] = useState(false);

  useEffect(() => {
    fetch(`/api/promotions?locale=${locale}`)
      .then((response) => response.json())
      .then((data) => setPromotion(data.promotion))
      .catch(() => setPromotion(null));
  }, [locale]);

  const pricing = useMemo(
    () =>
      calculateCartPricing(
        items,
        promotion?.tiers ?? [],
        promotion?.active ?? false
      ),
    [items, promotion]
  );

  const whatsapp =
    items.length > 0
      ? buildWhatsAppUrl(
          cartOrderMessage(
            dict,
            pricing.lines.map((line) => ({
              name: line.name,
              quantity: line.quantity,
              unitCents: line.unitCents,
              lineSubtotalCents: line.lineSubtotalCents,
            })),
            promotion?.tiers.map((tier) => ({
              minQuantity: tier.minQuantity,
              label: tier.label,
              discountPercent: tier.discountPercent,
            })) ?? [],
            {
              subtotalCents: pricing.subtotalCents,
              discountCents: pricing.discountCents,
              totalCents: pricing.totalCents,
              paynowNumber: contact.paynowNumber,
            },
            pickupDate,
            notes
          ),
          contact.whatsappNumber
        )
      : "#";

  async function copyPayNowNumber() {
    try {
      await navigator.clipboard.writeText(contact.paynowNumber);
      setCopiedPayNow(true);
      window.setTimeout(() => setCopiedPayNow(false), 1800);
    } catch {
      setCopiedPayNow(false);
    }
  }

  return (
    <main className="container section page-main content-page">
      <h1>{dict.cart.title}</h1>

      {items.length === 0 ? (
        <div className="contact-box">
          <p>{dict.cart.empty}</p>
          <div className="cta">
            <Link className="button" href={localePath(locale, "/products")}>
              {dict.cart.viewProducts}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {pricing.lines.map((line) => (
              <article key={line.slug} className="cart-item">
                <div className="cart-item-main">
                  <h2>{line.name}</h2>
                  <p className="cart-item-price">
                    {line.unitCents > 0
                      ? `${dict.cart.unitPrice}: ${formatPrice(line.unitCents)}`
                      : dict.cart.contactForPrice}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <label>
                    {dict.cart.qty}
                    <input
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(event) =>
                        updateQuantity(line.slug, Number(event.target.value))
                      }
                    />
                  </label>
                  <p className="cart-line-total">
                    {line.unitCents > 0
                      ? `${dict.cart.lineTotal}: ${formatPrice(line.lineSubtotalCents)}`
                      : null}
                  </p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => removeItem(line.slug)}
                  >
                    {dict.cart.remove}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <CartPromotionNote promotion={promotion} pricing={pricing} />

          {pricing.hasPricedItems ? (
            <div className="cart-summary">
              <h2>{dict.cart.orderSummary}</h2>
              <dl className="cart-summary-rows">
                <div>
                  <dt>{dict.cart.subtotal}</dt>
                  <dd>{formatPrice(pricing.subtotalCents)}</dd>
                </div>
                {pricing.discountCents > 0 ? (
                  <div className="cart-summary-discount">
                    <dt>
                      {dict.cart.discount}
                      {pricing.discountPercent > 0
                        ? ` (${pricing.discountPercent}%)`
                        : ""}
                    </dt>
                    <dd>-{formatPrice(pricing.discountCents)}</dd>
                  </div>
                ) : null}
                <div className="cart-summary-total">
                  <dt>{dict.cart.total}</dt>
                  <dd>{formatPrice(pricing.totalCents)}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="section-intro">{dict.cart.pricingNote}</p>
          )}

          <div className="paynow-box">
            <h2>{dict.cart.payNowTitle}</h2>
            <p>{dict.cart.payNowText}</p>
            <p className="paynow-number">
              <strong>{dict.cart.payNowNumber}:</strong> {contact.paynowNumber}
            </p>
            {pricing.hasPricedItems ? (
              <p className="paynow-amount">
                <strong>{dict.cart.total}:</strong> {formatPrice(pricing.totalCents)}
              </p>
            ) : null}
            <div className="cta paynow-actions">
              <button type="button" className="button secondary" onClick={copyPayNowNumber}>
                {copiedPayNow ? dict.cart.payNowCopied : dict.cart.copyPayNow}
              </button>
            </div>
          </div>

          <div className="checkout-form">
            <label>
              {dict.cart.pickupDate}
              <input
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
              />
            </label>
            <label>
              {dict.cart.notes}
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={dict.cart.notesPlaceholder}
              />
            </label>
          </div>

          <div className="cta">
            <WhatsAppLink
              href={whatsapp}
              className="button"
              eventLabel="cart_checkout_whatsapp"
            >
              {dict.cart.sendOrder}
            </WhatsAppLink>
            <button type="button" className="button secondary" onClick={clearCart}>
              {dict.cart.clearCart}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
