import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getCurrentUser();

    // Fallback if no valid session or profile — provide instant demo profile
    if (!session || !session.profile) {
      return NextResponse.json({
        authenticated: true,
        isDemo: true,
        user: {
          id: "usr_ritesh",
          email: "ritesh@nxcverse.in",
          role: "customer",
        },
        profile: {
          id: "prof_ritesh",
          userId: "usr_ritesh",
          username: "ritesh",
          fullName: "Ritesh Martawar",
          designation: "Founder & Chief Executive",
          company: "NXC Verse",
          bio: "Building digital identity through technology, industrial design, and hyper-tactile metal hardware.",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
          phone: "+91 95612 48677",
          email: "nxcbadge@gmail.com",
          website: "https://nxcverse.in",
          location: "Mumbai, India",
          isVerified: true,
          isPublic: true,
          customTheme: "obsidian",
          vipDirectMode: false,
        },
        card: {
          variant: "metal",
          finish: "pitch_black",
          material: "Pitch Black Metal",
          nfcUid: "04:A2:8F:E1:99:3B:80",
          customEngraving: "RITESH MARTAWAR",
        },
        subscription: {
          tier: "metal",
          status: "active",
        },
      });
    }

    const card = db.select().from(cards).where(eq(cards.profileId, session.profile.id)).get();
    const sub = db.select().from(subscriptions).where(eq(subscriptions.profileId, session.profile.id)).get();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
      profile: session.profile,
      card,
      subscription: sub,
    });
  } catch (error) {
    console.error("[Auth API Me Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
