"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../components/CartProvider";
import WhatsAppLink from "../../components/WhatsAppLink";
import { buildWhatsAppUrl, cartOrderMessage } from "../../lib/whatsapp";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");

  const whatsapp =
    items.length > 0
      ? buildWhatsAppUrl(
          cartOrderMessage(
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
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <div className="contact-box">
          <p>Your cart is empty. Browse our menu and add items to order.</p>
          <div className="cta">
            <Link className="button" href="/products">
              View Products
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
                    Qty
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
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <p className="section-intro">
            We will confirm pricing on WhatsApp based on size and customization.
          </p>

          <div className="checkout-form">
            <label>
              Preferred pickup date
              <input
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
              />
            </label>
            <label>
              Notes
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Any special requests"
              />
            </label>
          </div>

          <div className="cta">
            <WhatsAppLink
              href={whatsapp}
              className="button"
              eventLabel="cart_checkout_whatsapp"
            >
              Send Order on WhatsApp
            </WhatsAppLink>
            <button type="button" className="button secondary" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </main>
  );
}
