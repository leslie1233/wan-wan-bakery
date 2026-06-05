"use client";

import Link from "next/link";
import { useState } from "react";
import CartPromotionNote from "../../../components/CartPromotionNote";
import { useCart } from "../../../components/CartProvider";
import { useDictionary, useLocale } from "../../../components/LocaleProvider";
import WhatsAppLink from "../../../components/WhatsAppLink";
import { localePath } from "../../../lib/i18n/paths";
import { buildWhatsAppUrl } from "../../../lib/whatsapp";
import { cartOrderMessage } from "../../../lib/whatsapp-messages";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { locale } = useLocale();
  const dict = useDictionary();
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");

  const whatsapp =
    items.length > 0
      ? buildWhatsAppUrl(
          cartOrderMessage(
            dict,
            items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
            })),
            pickupDate,
            notes
          )
        )
      : "#";

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
            {items.map((item) => (
              <article key={item.slug} className="cart-item">
                <div>
                  <h2>{item.name}</h2>
                </div>

                <div className="cart-item-actions">
                  <label>
                    {dict.cart.qty}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.slug, Number(event.target.value))
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => removeItem(item.slug)}
                  >
                    {dict.cart.remove}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <CartPromotionNote />

          <p className="section-intro">{dict.cart.pricingNote}</p>

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
