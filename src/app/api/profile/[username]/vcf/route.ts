import { NextRequest, NextResponse } from "next/server";
import { getProfileByUsername, recordAnalyticsEvent } from "@/lib/db/queries";

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

    // Record vcf download analytics telemetry
    recordAnalyticsEvent({
      profileId: profile.id,
      eventType: "vcf_download",
      referrer: req.headers.get("referer") || "Direct Download",
      device: req.headers.get("user-agent") || "Mobile",
    }).catch(() => {});

    const nameParts = (profile.fullName || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const vcardLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
      `FN;CHARSET=UTF-8:${profile.fullName}`,
      profile.company ? `ORG;CHARSET=UTF-8:${profile.company}` : "",
      profile.designation ? `TITLE;CHARSET=UTF-8:${profile.designation}` : "",
      profile.phone ? `TEL;TYPE=CELL,VOICE:${profile.phone}` : "",
      profile.email ? `EMAIL;TYPE=WORK,INTERNET:${profile.email}` : "",
      `URL:${profile.website || `https://nxcverse.in/@${profile.username}`}`,
      profile.bio ? `NOTE;CHARSET=UTF-8:${profile.bio.replace(/\n/g, " ")}` : "",
      profile.avatarUrl ? `PHOTO;VALUE=URI:${profile.avatarUrl}` : "",
      "CATEGORIES:NXC Verse Sovereign Network",
      `REV:${new Date().toISOString()}`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\r\n");

    const filename = `${cleanUsername.replace(/[^a-z0-9_]/g, "")}_contact.vcf`;

    return new NextResponse(vcardLines, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("[VCF Generator API Error]:", err);
    return new NextResponse("Error generating contact card", { status: 500 });
  }
}
