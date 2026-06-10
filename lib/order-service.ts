import type { CartItem } from "./cart";
import { calculateCartPricing } from "./cart-pricing";
import {
  countPreviousOrders,
  getCustomerSession,
  type CustomerSession,
} from "./customer-auth";
import { sendOrderEmails, sendReferralBonusEmail } from "./email";
import { prisma } from "./db";
import { getPromotionView } from "./promotion-store";
import type { Locale } from "./i18n/locales";
import { normalizeReferralCode } from "./referral";
import { getRewardsSettings } from "./rewards-settings";

export type CreateOrderInput = {
  items: CartItem[];
  locale: string;
  pickupDate?: string;
  notes?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  referralCode?: string;
  pointsToRedeem?: number;
};

export type CreateOrderResult = {
  orderNumber: string;
  orderId: string;
  pricing: ReturnType<typeof calculateCartPricing>;
  customerEmail: string;
  customerName: string;
  emailsSent: { customerSent: boolean; ownerSent: boolean };
};

function generateOrderNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WW-${datePart}-${randomPart}`;
}

async function resolveCustomerContext(
  input: CreateOrderInput,
  session: CustomerSession | null
) {
  if (session) {
    const customer = await prisma.customer.findUnique({
      where: { id: session.customerId },
    });

    if (!customer) {
      throw new Error("Customer account not found");
    }

    return {
      customerId: customer.id,
      customerEmail: customer.email,
      customerName: customer.name,
      customerPhone: customer.phone,
      loyaltyPoints: customer.loyaltyPoints,
      referralCode: customer.referralCode,
    };
  }

  const guestEmail = input.guestEmail?.trim().toLowerCase();
  const guestName = input.guestName?.trim();

  if (!guestEmail || !guestName) {
    throw new Error("Name and email are required");
  }

  return {
    customerId: undefined as string | undefined,
    customerEmail: guestEmail,
    customerName: guestName,
    customerPhone: input.guestPhone?.trim() ?? "",
    loyaltyPoints: 0,
    referralCode: undefined as string | undefined,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!input.items.length) {
    throw new Error("Cart is empty");
  }

  const session = await getCustomerSession();
  const customerContext = await resolveCustomerContext(input, session);
  const rewardsSettings = await getRewardsSettings();
  const promotion = await getPromotionView(input.locale as Locale);

  const previousOrders = await countPreviousOrders({
    customerId: customerContext.customerId,
    email: customerContext.customerEmail,
  });
  const isFirstOrder = previousOrders === 0;

  let referralCodeValid = false;
  let referrerId: string | undefined;
  const referralInput = input.referralCode?.trim();

  if (referralInput && isFirstOrder) {
    const normalized = normalizeReferralCode(referralInput);
    const referrer = await prisma.customer.findUnique({
      where: { referralCode: normalized },
    });

    if (referrer && referrer.id !== customerContext.customerId) {
      referralCodeValid = true;
      referrerId = referrer.id;
    }
  }

  const pricing = calculateCartPricing(
    input.items,
    promotion?.tiers ?? [],
    promotion?.active ?? false,
    {
      isFirstOrder,
      referralCodeValid,
      loyaltyPointsAvailable: customerContext.loyaltyPoints,
      pointsToRedeem: input.pointsToRedeem,
      rewardsSettings,
    }
  );

  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerId: customerContext.customerId,
        guestEmail: customerContext.customerId ? null : customerContext.customerEmail,
        guestName: customerContext.customerId ? null : customerContext.customerName,
        guestPhone: customerContext.customerId ? null : customerContext.customerPhone,
        subtotalCents: pricing.subtotalCents,
        bulkDiscountCents: pricing.bulkDiscountCents,
        firstOrderDiscountCents: pricing.firstOrderDiscountCents,
        referralDiscountCents: pricing.referralDiscountCents,
        pointsRedeemedCents: pricing.pointsRedeemedCents,
        totalCents: pricing.totalCents,
        pointsEarned: pricing.pointsEarned,
        pointsRedeemed: pricing.pointsRedeemed,
        referralCodeUsed: referralCodeValid ? normalizeReferralCode(referralInput!) : null,
        pickupDate: input.pickupDate?.trim() || null,
        notes: input.notes?.trim() || null,
        items: {
          create: pricing.lines.map((line) => ({
            productSlug: line.slug,
            productName: line.name,
            quantity: line.quantity,
            unitCents: line.unitCents,
            lineSubtotalCents: line.lineSubtotalCents,
          })),
        },
      },
    });

    if (customerContext.customerId && pricing.pointsRedeemed > 0) {
      await tx.customer.update({
        where: { id: customerContext.customerId },
        data: { loyaltyPoints: { decrement: pricing.pointsRedeemed } },
      });

      await tx.loyaltyTransaction.create({
        data: {
          customerId: customerContext.customerId,
          type: "REDEEM",
          points: -pricing.pointsRedeemed,
          orderId: created.id,
          note: `Redeemed on order ${orderNumber}`,
        },
      });
    }

    if (customerContext.customerId && pricing.pointsEarned > 0) {
      await tx.customer.update({
        where: { id: customerContext.customerId },
        data: { loyaltyPoints: { increment: pricing.pointsEarned } },
      });

      await tx.loyaltyTransaction.create({
        data: {
          customerId: customerContext.customerId,
          type: "EARN",
          points: pricing.pointsEarned,
          orderId: created.id,
          note: `Earned on order ${orderNumber}`,
        },
      });
    }

    if (referrerId && referralCodeValid && rewardsSettings.referrerPointsReward > 0) {
      await tx.customer.update({
        where: { id: referrerId },
        data: {
          loyaltyPoints: { increment: rewardsSettings.referrerPointsReward },
        },
      });

      await tx.loyaltyTransaction.create({
        data: {
          customerId: referrerId,
          type: "REFERRAL_BONUS",
          points: rewardsSettings.referrerPointsReward,
          orderId: created.id,
          note: `Referral bonus for order ${orderNumber}`,
        },
      });
    }

    return created;
  });

  const siteSettings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const emailsSent = await sendOrderEmails(
    {
      orderNumber,
      customerName: customerContext.customerName,
      customerEmail: customerContext.customerEmail,
      customerPhone: customerContext.customerPhone,
      pickupDate: input.pickupDate ?? "",
      notes: input.notes ?? "",
      paynowNumber: siteSettings?.paynowNumber ?? "",
      pricing,
      items: pricing.lines.map((line) => ({
        productName: line.name,
        quantity: line.quantity,
        unitCents: line.unitCents,
        lineSubtotalCents: line.lineSubtotalCents,
      })),
      referralCodeUsed: referralCodeValid ? normalizeReferralCode(referralInput!) : undefined,
    },
    rewardsSettings.fromEmail,
    rewardsSettings.ownerEmail
  );

  if (referrerId && referralCodeValid) {
    const referrer = await prisma.customer.findUnique({
      where: { id: referrerId },
    });

    if (referrer) {
      await sendReferralBonusEmail(
        {
          name: referrer.name,
          email: referrer.email,
          points: rewardsSettings.referrerPointsReward,
          refereeName: customerContext.customerName,
        },
        rewardsSettings.fromEmail
      );
    }
  }

  return {
    orderNumber: order.orderNumber,
    orderId: order.id,
    pricing,
    customerEmail: customerContext.customerEmail,
    customerName: customerContext.customerName,
    emailsSent,
  };
}

export async function previewOrderPricing(input: {
  items: CartItem[];
  locale: string;
  guestEmail?: string;
  referralCode?: string;
  pointsToRedeem?: number;
}) {
  const session = await getCustomerSession();
  const rewardsSettings = await getRewardsSettings();
  const promotion = await getPromotionView(input.locale as Locale);

  let customerId = session?.customerId;
  let loyaltyPoints = 0;
  let email = input.guestEmail?.trim().toLowerCase() ?? session?.email;

  if (session) {
    const customer = await prisma.customer.findUnique({
      where: { id: session.customerId },
    });
    loyaltyPoints = customer?.loyaltyPoints ?? 0;
    email = customer?.email ?? email;
  }

  const previousOrders = await countPreviousOrders({
    customerId,
    email,
  });
  const isFirstOrder = previousOrders === 0;

  let referralCodeValid = false;

  if (input.referralCode?.trim() && isFirstOrder) {
    const referrer = await prisma.customer.findUnique({
      where: { referralCode: normalizeReferralCode(input.referralCode) },
    });

    if (referrer && referrer.id !== customerId) {
      referralCodeValid = true;
    }
  }

  return calculateCartPricing(
    input.items,
    promotion?.tiers ?? [],
    promotion?.active ?? false,
    {
      isFirstOrder,
      referralCodeValid,
      loyaltyPointsAvailable: loyaltyPoints,
      pointsToRedeem: input.pointsToRedeem,
      rewardsSettings,
    }
  );
}
