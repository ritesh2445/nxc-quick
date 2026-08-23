import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { customDomains, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyDomainDns } from "@/lib/domains";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const domains = db
      .select()
      .from(customDomains)
      .where(eq(customDomains.userId, session.user.id))
      .all();

    return NextResponse.json({ domains });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const domain = (body.domain || "").toLowerCase().trim().replace(/^(https?:\/\/)/, "").replace(/\/.*$/, "");

    if (!domain || !domain.includes(".")) {
      return NextResponse.json({ error: "Please enter a valid domain (e.g. ceo.company.com)" }, { status: 400 });
    }

    const existing = db.select().from(customDomains).where(eq(customDomains.domain, domain)).get();
    if (existing) {
      return NextResponse.json({ error: "This domain is already registered on NXC Verse" }, { status: 400 });
    }

    const now = new Date();
    const token = `nxc_verify_${Math.random().toString(36).substring(2, 12)}`;

    const newRecord = db
      .insert(customDomains)
      .values({
        id: `dom_${Math.random().toString(36).substring(2, 10)}`,
        userId: session.user.id,
        profileId: session.profile.id,
        domain,
        verificationStatus: "pending",
        verificationToken: token,
        verifiedAt: null,
        createdAt: now,
      })
      .returning()
      .get();

    return NextResponse.json({
      success: true,
      domain: newRecord,
      instructions: {
        txtRecord: {
          type: "TXT",
          host: domain,
          value: `nxc-verification=${token}`,
        },
        cnameRecord: {
          type: "CNAME",
          host: domain,
          target: "domains.nxcverse.in",
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add domain" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { domainId } = body;

    const record = db
      .select()
      .from(customDomains)
      .where(and(eq(customDomains.id, domainId), eq(customDomains.userId, session.user.id)))
      .get();

    if (!record) {
      return NextResponse.json({ error: "Domain record not found" }, { status: 404 });
    }

    const isValid = await verifyDomainDns(record.domain, record.verificationToken);

    if (isValid) {
      const updated = db
        .update(customDomains)
        .set({
          verificationStatus: "verified",
          verifiedAt: new Date(),
        })
        .where(eq(customDomains.id, domainId))
        .returning()
        .get();

      return NextResponse.json({ success: true, verified: true, domain: updated });
    } else {
      return NextResponse.json({
        success: false,
        verified: false,
        message: "DNS records not yet propagated or incorrect. Please ensure TXT or CNAME is active.",
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Verification check failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Domain ID is required" }, { status: 400 });
    }

    db.delete(customDomains)
      .where(and(eq(customDomains.id, id), eq(customDomains.userId, session.user.id)))
      .run();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete domain" }, { status: 500 });
  }
}
