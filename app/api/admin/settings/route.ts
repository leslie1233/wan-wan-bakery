import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "../../../../lib/auth-helpers";
import { parsePhoneInput } from "../../../../lib/phone";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../../../../lib/site-settings";
import { isDatabaseConfigured } from "../../../../lib/db";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const parsed = parsePhoneInput(String(body.phone ?? ""));

  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Enter a valid Singapore number, e.g. 81571573 or +65 8157 1573.",
      },
      { status: 400 }
    );
  }

  try {
    const settings = await updateSiteSettings(parsed);
    revalidatePath("/", "layout");

    return NextResponse.json({
      settings: {
        phone: settings.phone,
        phoneE164: settings.phoneE164,
        whatsappNumber: settings.whatsappNumber,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save phone number.";

    if (message.includes("SiteSettings") || message.includes("does not exist")) {
      return NextResponse.json(
        {
          error:
            "Phone settings table is missing. Run npm run db:push on your computer, then try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
