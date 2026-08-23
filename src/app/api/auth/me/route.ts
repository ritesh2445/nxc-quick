import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cards, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getCurrentUser();

    // Fallback if no valid session or profile
    if (!session || !session.profile) {
      return NextResponse.json({ authenticated: false, user: null, profile: null });
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
