import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getContactsByUserId, createContact } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { profiles, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getCurrentUser();
    const userId = session?.user?.id || "usr_ritesh";

    const contactsList = await getContactsByUserId(userId);
    return NextResponse.json({ contacts: contactsList });
  } catch (error) {
    console.error("[Contacts API GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, company, designation, notes, profileId, username, source } = body;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    let targetProfileId = profileId;
    let targetUserId = "";

    // If submitted via public profile username
    if (username && !targetProfileId) {
      const p = db.select().from(profiles).where(eq(profiles.username, username.toLowerCase())).get();
      if (p) {
        targetProfileId = p.id;
        targetUserId = p.userId;
      }
    } else if (targetProfileId) {
      const p = db.select().from(profiles).where(eq(profiles.id, targetProfileId)).get();
      if (p) {
        targetUserId = p.userId;
      }
    }

    // If logged-in user adding a contact manually
    if (!targetUserId) {
      const session = await getCurrentUser();
      targetUserId = session?.user?.id || "usr_ritesh";
      if (!targetProfileId) {
        const p = db.select().from(profiles).where(eq(profiles.userId, targetUserId)).get();
        targetProfileId = p?.id || "prof_ritesh";
      }
    }

    const contact = await createContact({
      profileId: targetProfileId,
      userId: targetUserId,
      fullName,
      email,
      phone,
      company,
      designation,
      notes,
      source: source || "profile_exchange",
    });

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    console.error("[Contacts API POST Error]:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
