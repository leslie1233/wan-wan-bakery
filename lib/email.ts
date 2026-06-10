import { Resend } from "resend";
import { formatPrice } from "./format";
import type { CartPricing } from "./cart-pricing";

type OrderEmailItem = {
  productName: string;
  quantity: number;
  unitCents: number;
  lineSubtotalCents: number;
};

type OrderEmailDetails = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  notes: string;
  paynowNumber: string;
  pricing: Pick<
    CartPricing,
    | "subtotalCents"
    | "bulkDiscountCents"
    | "firstOrderDiscountCents"
    | "referralDiscountCents"
    | "pointsRedeemedCents"
    | "pointsRedeemed"
    | "totalCents"
    | "pointsEarned"
  >;
  items: OrderEmailItem[];
  referralCodeUsed?: string;
};

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function buildOrderSummaryHtml(details: OrderEmailDetails): string {
  const itemRows = details.items
    .map(
      (item) =>
        `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${formatPrice(item.unitCents)}</td><td>${formatPrice(item.lineSubtotalCents)}</td></tr>`
    )
    .join("");

  const discountRows = [
    details.pricing.bulkDiscountCents > 0
      ? `<tr><td colspan="3">Bulk promotion</td><td>-${formatPrice(details.pricing.bulkDiscountCents)}</td></tr>`
      : "",
    details.pricing.firstOrderDiscountCents > 0
      ? `<tr><td colspan="3">First order discount</td><td>-${formatPrice(details.pricing.firstOrderDiscountCents)}</td></tr>`
      : "",
    details.pricing.referralDiscountCents > 0
      ? `<tr><td colspan="3">Referral discount</td><td>-${formatPrice(details.pricing.referralDiscountCents)}</td></tr>`
      : "",
    details.pricing.pointsRedeemedCents > 0
      ? `<tr><td colspan="3">Loyalty points (${details.pricing.pointsRedeemed} pts)</td><td>-${formatPrice(details.pricing.pointsRedeemedCents)}</td></tr>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <p>Order <strong>${details.orderNumber}</strong></p>
    <p><strong>${details.customerName}</strong><br/>
    ${details.customerEmail}${details.customerPhone ? `<br/>${details.customerPhone}` : ""}</p>
    <p>Pickup date: ${details.pickupDate || "Not specified"}</p>
    ${details.notes ? `<p>Notes: ${details.notes}</p>` : ""}
    ${details.referralCodeUsed ? `<p>Referral code: ${details.referralCodeUsed}</p>` : ""}
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px;">
      <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Line</th></tr></thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr><td colspan="3">Subtotal</td><td>${formatPrice(details.pricing.subtotalCents)}</td></tr>
        ${discountRows}
        <tr><td colspan="3"><strong>Total</strong></td><td><strong>${formatPrice(details.pricing.totalCents)}</strong></td></tr>
      </tfoot>
    </table>
    <p>PayNow: <strong>${details.paynowNumber}</strong></p>
    ${details.pricing.pointsEarned > 0 ? `<p>You earned <strong>${details.pricing.pointsEarned}</strong> loyalty points on this order.</p>` : ""}
    <p>Please complete PayNow payment and send us a WhatsApp message to confirm your order.</p>
  `;
}

function buildOrderSummaryText(details: OrderEmailDetails): string {
  const lines = [
    `Order ${details.orderNumber}`,
    `${details.customerName} (${details.customerEmail})`,
    details.customerPhone ? `Phone: ${details.customerPhone}` : "",
    `Pickup: ${details.pickupDate || "Not specified"}`,
    details.notes ? `Notes: ${details.notes}` : "",
    "",
    ...details.items.map(
      (item) =>
        `- ${item.productName} x${item.quantity} @ ${formatPrice(item.unitCents)} = ${formatPrice(item.lineSubtotalCents)}`
    ),
    "",
    `Subtotal: ${formatPrice(details.pricing.subtotalCents)}`,
  ];

  if (details.pricing.bulkDiscountCents > 0) {
    lines.push(`Bulk discount: -${formatPrice(details.pricing.bulkDiscountCents)}`);
  }
  if (details.pricing.firstOrderDiscountCents > 0) {
    lines.push(
      `First order discount: -${formatPrice(details.pricing.firstOrderDiscountCents)}`
    );
  }
  if (details.pricing.referralDiscountCents > 0) {
    lines.push(
      `Referral discount: -${formatPrice(details.pricing.referralDiscountCents)}`
    );
  }
  if (details.pricing.pointsRedeemedCents > 0) {
    lines.push(
      `Loyalty points (${details.pricing.pointsRedeemed}): -${formatPrice(details.pricing.pointsRedeemedCents)}`
    );
  }

  lines.push(`Total: ${formatPrice(details.pricing.totalCents)}`);
  lines.push(`PayNow: ${details.paynowNumber}`);

  if (details.pricing.pointsEarned > 0) {
    lines.push(`Points earned: ${details.pricing.pointsEarned}`);
  }

  return lines.filter(Boolean).join("\n");
}

export async function sendOrderEmails(
  details: OrderEmailDetails,
  fromEmail: string,
  ownerEmail: string
): Promise<{ customerSent: boolean; ownerSent: boolean }> {
  const resend = getResendClient();
  const summaryHtml = buildOrderSummaryHtml(details);
  const summaryText = buildOrderSummaryText(details);

  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — order email preview:");
    console.log(summaryText);
    return { customerSent: false, ownerSent: false };
  }

  let customerSent = false;
  let ownerSent = false;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: details.customerEmail,
      subject: `Wan Wan Bakery order ${details.orderNumber}`,
      html: `<h2>Thank you for your order!</h2>${summaryHtml}`,
      text: `Thank you for your order!\n\n${summaryText}`,
    });
    customerSent = true;
  } catch (error) {
    console.error("[email] Failed to send customer confirmation:", error);
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: `New order ${details.orderNumber} — ${details.customerName}`,
      html: `<h2>New order received</h2>${summaryHtml}`,
      text: `New order received\n\n${summaryText}`,
    });
    ownerSent = true;
  } catch (error) {
    console.error("[email] Failed to send owner notification:", error);
  }

  return { customerSent, ownerSent };
}

export async function sendWelcomeEmail(
  input: { name: string; email: string; referralCode: string },
  fromEmail: string
): Promise<boolean> {
  const resend = getResendClient();

  if (!resend) {
    console.log(`[email] Welcome ${input.email} — referral code ${input.referralCode}`);
    return false;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: input.email,
      subject: "Welcome to Wan Wan Bakery membership",
      html: `
        <h2>Welcome, ${input.name}!</h2>
        <p>Your Wan Wan Bakery membership is active. Earn loyalty points on every order and share your referral code with friends.</p>
        <p>Your referral code: <strong>${input.referralCode}</strong></p>
        <p>Friends who use your code get a discount on their first order, and you earn bonus points when they order.</p>
      `,
      text: `Welcome, ${input.name}! Your referral code is ${input.referralCode}.`,
    });
    return true;
  } catch (error) {
    console.error("[email] Failed to send welcome email:", error);
    return false;
  }
}

export async function sendReferralBonusEmail(
  input: { name: string; email: string; points: number; refereeName: string },
  fromEmail: string
): Promise<boolean> {
  const resend = getResendClient();

  if (!resend) {
    console.log(
      `[email] Referral bonus ${input.points} pts to ${input.email} for ${input.refereeName}`
    );
    return false;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: input.email,
      subject: "You earned referral bonus points!",
      html: `
        <h2>Referral bonus earned</h2>
        <p>Hi ${input.name},</p>
        <p>${input.refereeName} placed their first order using your referral code. You earned <strong>${input.points}</strong> loyalty points!</p>
      `,
      text: `You earned ${input.points} referral bonus points because ${input.refereeName} placed their first order.`,
    });
    return true;
  } catch (error) {
    console.error("[email] Failed to send referral bonus email:", error);
    return false;
  }
}
