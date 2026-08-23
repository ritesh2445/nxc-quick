import { NextRequest, NextResponse } from "next/server";
import { getProfileByUsername, recordAnalyticsEvent } from "@/lib/db/queries";
import { buildGooglePassObject } from "@/lib/wallet/google";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username: rawUsername } = await context.params;
    const cleanUsername = decodeURIComponent(rawUsername).replace(/^@/, "").toLowerCase().trim();
    const profile = await getProfileByUsername(cleanUsername);

    if (!profile) {
      return new NextResponse("Profile Not Found", { status: 404 });
    }

    recordAnalyticsEvent({
      profileId: profile.id,
      eventType: "vcf_download",
      referrer: "Google Wallet Download",
    }).catch(() => {});

    const passObject = buildGooglePassObject({
      username: profile.username,
      fullName: profile.fullName,
      designation: profile.designation,
      company: profile.company,
      phone: profile.phone,
      email: profile.email,
    });

    return NextResponse.json({
      success: true,
      passObject,
      saveUrl: `https://pay.google.com/gp/v/save/${encodeURIComponent(profile.username)}`,
    });
  } catch (err) {
    console.error("[Google Wallet API Error]:", err);
    return new NextResponse("Failed to generate Google Wallet pass", { status: 500 });
  }
}
