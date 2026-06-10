"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CartPromotionNote from "../../../components/CartPromotionNote";
import { useCart } from "../../../components/CartProvider";
import { useDictionary, useLocale } from "../../../components/LocaleProvider";
import { useSiteSettings } from "../../../components/SiteSettingsProvider";
import WhatsAppLink from "../../../components/WhatsAppLink";
import type { CartPricing } from "../../../lib/cart-pricing";
import { calculateCartPricing } from "../../../lib/cart-pricing";
import type { PromotionView } from "../../../lib/catalog-types";
import { formatPrice } from "../../../lib/format";
import { localePath } from "../../../lib/i18n/paths";
import { buildWhatsAppUrl } from "../../../lib/whatsapp";
import { cartOrderMessage } from "../../../lib/whatsapp-messages";

type CustomerInfo = {
  id: string;
  email: string;
  name: string;
  phone: string;
  referralCode: string;
  loyaltyPoints: number;
  orderCount: number;
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { locale } = useLocale();
  const dict = useDictionary();
  const contact = useSiteSettings();
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [promotion, setPromotion] = useState<PromotionView | null>(null);
  const [copiedPayNow, setCopiedPayNow] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [serverPricing, setServerPricing] = useState<CartPricing | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  useEffect(() => {
    fetch(`/api/promotions?locale=${locale}`)
      .then((response) => response.json())
      .then((data) => setPromotion(data.promotion))
      .catch(() => setPromotion(null));
  }, [locale]);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.customer) {
          setCustomer(data.customer);
          setGuestName(data.customer.name);
          setGuestEmail(data.customer.email);
          setGuestPhone(data.customer.phone ?? "");
        }
      })
      .catch(() => setCustomer(null));
  }, []);

  useEffect(() => {
    if (!items.length) {
      setServerPricing(null);
      return;
    }

    const timer = window.setTimeout(() => {
      fetch("/api/orders/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          locale,
          guestEmail: customer ? undefined : guestEmail,
          referralCode,
          pointsToRedeem: customer ? pointsToRedeem : 0,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.pricing) {
            setServerPricing(data.pricing);
          }
        })
        .catch(() => setServerPricing(null));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [items, locale, guestEmail, referralCode, pointsToRedeem, customer]);

  const fallbackPricing = useMemo(
    () =>
      calculateCartPricing(
        items,
        promotion?.tiers ?? [],
        promotion?.active ?? false
      ),
    [items, promotion]
  );

  const pricing = serverPricing ?? fallbackPricing;

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
              bulkDiscountCents: pricing.bulkDiscountCents,
              firstOrderDiscountCents: pricing.firstOrderDiscountCents,
              referralDiscountCents: pricing.referralDiscountCents,
              pointsRedeemedCents: pricing.pointsRedeemedCents,
              pointsRedeemed: pricing.pointsRedeemed,
              totalCents: pricing.totalCents,
              pointsEarned: pricing.pointsEarned,
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

  async function handleCheckout() {
    setCheckoutLoading(true);
    setCheckoutError("");
    setOrderSuccess("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          locale,
          pickupDate,
          notes,
          guestEmail: customer ? undefined : guestEmail,
          guestName: customer ? undefined : guestName,
          guestPhone: customer ? undefined : guestPhone,
          referralCode,
          pointsToRedeem: customer ? pointsToRedeem : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckoutError(data.error ?? dict.cart.checkoutError);
        return;
      }

      setOrderSuccess(
        dict.cart.orderPlaced.replace("{{orderNumber}}", data.orderNumber)
      );

      if (data.emailsSent?.customerSent) {
        setOrderSuccess((current) => `${current} ${dict.cart.emailSent}`);
      }

      window.open(whatsapp, "_blank", "noopener,noreferrer");
      clearCart();

      if (customer) {
        const profileResponse = await fetch("/api/customer/me");
        const profileData = await profileResponse.json();
        if (profileData.customer) {
          setCustomer(profileData.customer);
        }
      }
    } catch {
      setCheckoutError(dict.cart.checkoutError);
    } finally {
      setCheckoutLoading(false);
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

          {customer ? (
            <div className="membership-box">
              <p>
                {dict.cart.memberSignedIn.replace("{{name}}", customer.name)} —{" "}
                {dict.cart.loyaltyBalance.replace(
                  "{{points}}",
                  String(customer.loyaltyPoints)
                )}
              </p>
              <Link href={localePath(locale, "/account")}>{dict.cart.viewAccount}</Link>
            </div>
          ) : (
            <div className="membership-box">
              <p>{dict.cart.guestCheckoutIntro}</p>
              <Link href={localePath(locale, "/account")}>{dict.cart.joinMembership}</Link>
            </div>
          )}

          {!customer ? (
            <div className="checkout-form checkout-customer">
              <h2>{dict.cart.contactDetails}</h2>
              <label>
                {dict.cart.customerName}
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                />
              </label>
              <label>
                {dict.cart.customerEmail}
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(event) => setGuestEmail(event.target.value)}
                />
              </label>
              <label>
                {dict.cart.customerPhone}
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(event) => setGuestPhone(event.target.value)}
                />
              </label>
            </div>
          ) : null}

          <div className="checkout-form">
            <label>
              {dict.cart.referralCode}
              <input
                type="text"
                value={referralCode}
                onChange={(event) =>
                  setReferralCode(event.target.value.toUpperCase())
                }
                placeholder={dict.cart.referralCodePlaceholder}
              />
            </label>

            {customer && customer.loyaltyPoints > 0 ? (
              <label>
                {dict.cart.redeemPoints}
                <input
                  type="number"
                  min="0"
                  max={customer.loyaltyPoints}
                  step="100"
                  value={pointsToRedeem}
                  onChange={(event) =>
                    setPointsToRedeem(Number(event.target.value))
                  }
                />
              </label>
            ) : null}
          </div>

          {pricing.hasPricedItems ? (
            <div className="cart-summary">
              <h2>{dict.cart.orderSummary}</h2>
              <dl className="cart-summary-rows">
                <div>
                  <dt>{dict.cart.subtotal}</dt>
                  <dd>{formatPrice(pricing.subtotalCents)}</dd>
                </div>
                {pricing.bulkDiscountCents > 0 ? (
                  <div className="cart-summary-discount">
                    <dt>
                      {dict.cart.discount}
                      {pricing.bulkDiscountPercent > 0
                        ? ` (${pricing.bulkDiscountPercent}%)`
                        : ""}
                    </dt>
                    <dd>-{formatPrice(pricing.bulkDiscountCents)}</dd>
                  </div>
                ) : null}
                {pricing.firstOrderDiscountCents > 0 ? (
                  <div className="cart-summary-discount">
                    <dt>{dict.cart.firstOrderDiscount}</dt>
                    <dd>-{formatPrice(pricing.firstOrderDiscountCents)}</dd>
                  </div>
                ) : null}
                {pricing.referralDiscountCents > 0 ? (
                  <div className="cart-summary-discount">
                    <dt>{dict.cart.referralDiscount}</dt>
                    <dd>-{formatPrice(pricing.referralDiscountCents)}</dd>
                  </div>
                ) : null}
                {pricing.pointsRedeemedCents > 0 ? (
                  <div className="cart-summary-discount">
                    <dt>
                      {dict.cart.pointsDiscount.replace(
                        "{{points}}",
                        String(pricing.pointsRedeemed)
                      )}
                    </dt>
                    <dd>-{formatPrice(pricing.pointsRedeemedCents)}</dd>
                  </div>
                ) : null}
                <div className="cart-summary-total">
                  <dt>{dict.cart.total}</dt>
                  <dd>{formatPrice(pricing.totalCents)}</dd>
                </div>
                {pricing.pointsEarned > 0 ? (
                  <div>
                    <dt>{dict.cart.pointsEarned}</dt>
                    <dd>{pricing.pointsEarned}</dd>
                  </div>
                ) : null}
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

          {checkoutError ? <p className="form-error">{checkoutError}</p> : null}
          {orderSuccess ? <p className="form-success">{orderSuccess}</p> : null}

          <div className="cta">
            <button
              type="button"
              className="button"
              disabled={checkoutLoading || (!customer && (!guestName || !guestEmail))}
              onClick={handleCheckout}
            >
              {checkoutLoading ? dict.cart.placingOrder : dict.cart.placeOrder}
            </button>
            <WhatsAppLink
              href={whatsapp}
              className="button secondary"
              eventLabel="cart_checkout_whatsapp_only"
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
