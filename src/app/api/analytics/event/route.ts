import { NextRequest, NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userAgent = req.headers.get("user-agent") || "Mobile Safari";
    const ipCountry = req.headers.get("cf-ipcountry") || "IN";

    // Non-blocking write
    recordAnalyticsEvent({
      profileId: body.profileId,
      eventType: body.eventType,
      linkId: body.linkId,
      referrer: req.headers.get("referer") || undefined,
      device: userAgent.includes("iPhone") ? "iPhone" : userAgent.includes("Android") ? "Android" : "Desktop",
      browser: userAgent.includes("Chrome") ? "Chrome" : "Safari",
      country: ipCountry,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 }); // Always 200 to not block client
  }
}
