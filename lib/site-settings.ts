import { revalidatePath } from "next/cache";
import { siteConfig } from "./site-config";
import type { SiteContactSettings } from "./phone";
import { isDatabaseConfigured, prisma } from "./db";

const DEFAULT_SETTINGS: SiteContactSettings = {
  phone: siteConfig.phone,
  phoneE164: siteConfig.phoneE164,
  whatsappNumber: siteConfig.whatsappNumber,
  paynowNumber: siteConfig.phone,
};

export type { SiteContactSettings };

export async function getSiteSettings(): Promise<SiteContactSettings> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return {
      phone: settings.phone,
      phoneE164: settings.phoneE164,
      whatsappNumber: settings.whatsappNumber,
      paynowNumber: settings.paynowNumber || settings.phone,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(input: SiteContactSettings) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      phone: input.phone,
      phoneE164: input.phoneE164,
      whatsappNumber: input.whatsappNumber,
      paynowNumber: input.paynowNumber,
    },
    create: {
      id: "default",
      phone: input.phone,
      phoneE164: input.phoneE164,
      whatsappNumber: input.whatsappNumber,
      paynowNumber: input.paynowNumber,
    },
  });

  revalidatePath("/", "layout");

  return settings;
}

export async function getAdminSiteSettings() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
}
