import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "../../../../lib/auth-helpers";
import { parsePayNowInput, parsePhoneInput } from "../../../../lib/phone";
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
  const parsedPhone = parsePhoneInput(String(body.phone ?? ""));

  if (!parsedPhone) {
    return NextResponse.json(
      {
        error:
          "Enter a valid Singapore phone number, e.g. 93855540 or +65 9385 5540.",
      },
      { status: 400 }
    );
  }

  const parsedPayNow = parsePayNowInput(String(body.paynowNumber ?? body.phone ?? ""));

  if (!parsedPayNow) {
    return NextResponse.json(
      {
        error:
          "Enter a valid PayNow number, e.g. 93855540 or +65 9385 5540.",
      },
      { status: 400 }
    );
  }

  try {
    const settings = await updateSiteSettings({
      ...parsedPhone,
      paynowNumber: parsedPayNow,
    });
    revalidatePath("/", "layout");

    return NextResponse.json({
      settings: {
        phone: settings.phone,
        phoneE164: settings.phoneE164,
        whatsappNumber: settings.whatsappNumber,
        paynowNumber: settings.paynowNumber,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save contact settings.";

    if (message.includes("SiteSettings") || message.includes("does not exist")) {
      return NextResponse.json(
        {
          error:
            "Contact settings table is missing. Run npm run db:push on your computer, then try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
