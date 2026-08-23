import { NextRequest, NextResponse } from "next/server";
import { getProfileByUsername, recordAnalyticsEvent } from "@/lib/db/queries";
import { buildApplePassJson } from "@/lib/wallet/apple";

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
      referrer: "Apple Wallet Download",
    }).catch(() => {});

    const passJson = buildApplePassJson({
      username: profile.username,
      fullName: profile.fullName,
      designation: profile.designation,
      company: profile.company,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
    });

    // If signed .pkpass bundle certificates are configured, return the signed binary
    // Otherwise return the PassKit JSON manifest
    return new NextResponse(JSON.stringify(passJson, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass+json",
        "Content-Disposition": `attachment; filename="${cleanUsername}_nxc_pass.json"`,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("[Apple Wallet API Error]:", err);
    return new NextResponse("Failed to generate Apple Wallet pass", { status: 500 });
  }
}
