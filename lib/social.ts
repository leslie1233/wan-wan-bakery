import { siteConfig } from "./site-config";

function normalizeInstagramUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const handle = trimmed.replace(/^@/, "").replace(/\/$/, "");
  if (!handle) {
    return null;
  }

  return `https://www.instagram.com/${handle}/`;
}

export function getInstagramUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();
  const fromConfig = siteConfig.social.instagram.trim();
  return normalizeInstagramUrl(fromEnv || fromConfig);
}
