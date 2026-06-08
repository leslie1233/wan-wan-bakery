import { NextResponse } from "next/server";
import { getPromotionView } from "../../../lib/promotion-store";
import { isLocale } from "../../../lib/i18n/locales";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") ?? "en";

  if (!isLocale(localeParam)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const promotion = await getPromotionView(localeParam);

  return NextResponse.json({ promotion });
}
