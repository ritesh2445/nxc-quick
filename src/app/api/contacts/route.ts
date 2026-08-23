import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createContactLead, deleteContactLead, getProfileByUsername } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { contacts, profiles, userSettings, users } from "@/lib/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendLeadReceivedAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const userId = session?.user?.id || "usr_ritesh";

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();

    let userContacts;
    if (query) {
      userContacts = db
        .select()
        .from(contacts)
        .where(
          and(
            eq(contacts.userId, userId),
            or(
              like(contacts.fullName, `%${query}%`),
              like(contacts.email, `%${query}%`),
              like(contacts.company, `%${query}%`),
              like(contacts.designation, `%${query}%`)
            )
          )
        )
        .orderBy(desc(contacts.createdAt))
        .all();
    } else {
      userContacts = db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, userId))
        .orderBy(desc(contacts.createdAt))
        .all();
    }

    return NextResponse.json({ contacts: userContacts });
  } catch (error) {
    console.error("[Contacts API GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "anonymous_client";
    const rateLimit = checkRateLimit(`lead_exchange_${ip}`, { limit: 15, windowMs: 60 * 1000 });

    if (rateLimit.isRateLimited) {
      return NextResponse.json(
        { error: "Too many contact exchange requests. Please try again in a few moments." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { fullName, email, phone, company, designation, notes, message, profileId, username, source } = body;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    let targetProfileId = profileId;
    let targetUserId = "";
    let targetProfile: any = null;

    // Resolve target profile and user
    if (username && !targetProfileId) {
      targetProfile = await getProfileByUsername(username);
      if (targetProfile) {
        targetProfileId = targetProfile.id;
        targetUserId = targetProfile.userId;
      }
    } else if (targetProfileId) {
      targetProfile = db.select().from(profiles).where(eq(profiles.id, targetProfileId)).get();
      if (targetProfile) {
        targetUserId = targetProfile.userId;
      }
    }

    // If logged-in user adding a lead manually
    if (!targetUserId) {
      const session = await getCurrentUser();
      targetUserId = session?.user?.id || "usr_ritesh";
      if (!targetProfileId) {
        targetProfile = db.select().from(profiles).where(eq(profiles.userId, targetUserId)).get();
        targetProfileId = targetProfile?.id || "prof_ritesh";
      }
    }

    const newLead = await createContactLead({
      profileId: targetProfileId,
      userId: targetUserId,
      fullName: fullName.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      company: company?.trim(),
      designation: designation?.trim(),
      message: (notes || message || "").trim(),
      source: source || "profile_exchange",
    });

    // Send asynchronous transactional lead alert email to profile owner
    if (targetUserId) {
      const ownerUser = db.select().from(users).where(eq(users.id, targetUserId)).get();
      const settings = db.select().from(userSettings).where(eq(userSettings.userId, targetUserId)).get();

      if (ownerUser && (settings?.notifyOnLead !== false)) {
        sendLeadReceivedAlertEmail({
          to: ownerUser.email,
          ownerName: targetProfile?.fullName || "Executive",
          leadName: fullName,
          leadEmail: email,
          leadPhone: phone,
          leadCompany: company,
          leadMessage: notes || message,
        }).catch((err) => console.error("Lead email dispatch failure:", err));
      }
    }

    return NextResponse.json({ success: true, contact: newLead }, { status: 201 });
  } catch (error) {
    console.error("[Contacts API POST Error]:", error);
    return NextResponse.json({ error: "Failed to submit contact card" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const userId = session?.user?.id || "usr_ritesh";

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    await deleteContactLead(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contacts API DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
