import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { generateReferralCode, normalizeReferralCode } from "./referral";

const CUSTOMER_COOKIE = "wan-wan-customer-session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type CustomerSession = {
  customerId: string;
  email: string;
  name: string;
};

function getCustomerSecret(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "development"
      ? "wan-wan-bakery-local-dev-secret"
      : "wan-wan-bakery-production-fallback-secret");

  return new TextEncoder().encode(secret);
}

export async function createCustomerSessionToken(
  session: CustomerSession
): Promise<string> {
  return new SignJWT({
    email: session.email,
    name: session.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.customerId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getCustomerSecret());
}

export async function verifyCustomerSessionToken(
  token: string
): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, getCustomerSecret());

    if (!payload.sub || typeof payload.email !== "string") {
      return null;
    }

    return {
      customerId: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
    };
  } catch {
    return null;
  }
}

export async function setCustomerSessionCookie(token: string): Promise<void> {
  cookies().set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearCustomerSessionCookie(): Promise<void> {
  cookies().delete(CUSTOMER_COOKIE);
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const token = cookies().get(CUSTOMER_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyCustomerSessionToken(token);
}

export async function getCustomerProfile(customerId: string) {
  return prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      referralCode: true,
      loyaltyPoints: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });
}

export async function registerCustomer(input: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  referralCode?: string;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const phone = input.phone?.trim() ?? "";

  if (!email || !input.password || !name) {
    throw new Error("Missing required fields");
  }

  const existing = await prisma.customer.findUnique({ where: { email } });

  if (existing) {
    throw new Error("Email already registered");
  }

  let referredById: string | undefined;
  const referralInput = input.referralCode?.trim();

  if (referralInput) {
    const referrer = await prisma.customer.findUnique({
      where: { referralCode: normalizeReferralCode(referralInput) },
    });

    if (referrer) {
      referredById = referrer.id;
    }
  }

  let referralCode = generateReferralCode();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const collision = await prisma.customer.findUnique({
      where: { referralCode },
    });

    if (!collision) {
      break;
    }

    referralCode = generateReferralCode();
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const customer = await prisma.customer.create({
    data: {
      email,
      name,
      phone,
      passwordHash,
      referralCode,
      referredById,
    },
  });

  return customer;
}

export async function loginCustomer(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const customer = await prisma.customer.findUnique({
    where: { email: normalizedEmail },
  });

  if (!customer) {
    return null;
  }

  const valid = await bcrypt.compare(password, customer.passwordHash);

  if (!valid) {
    return null;
  }

  return customer;
}

export async function countPreviousOrders(input: {
  customerId?: string;
  email?: string;
}): Promise<number> {
  const normalizedEmail = input.email?.trim().toLowerCase();
  const conditions: Array<
    { customerId: string } | { guestEmail: string } | { customer: { email: string } }
  > = [];

  if (input.customerId) {
    conditions.push({ customerId: input.customerId });
  }

  if (normalizedEmail) {
    conditions.push({ guestEmail: normalizedEmail });
    conditions.push({ customer: { email: normalizedEmail } });
  }

  if (conditions.length === 0) {
    return 0;
  }

  return prisma.order.count({
    where: { OR: conditions },
  });
}
