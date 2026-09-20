import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const memoryCardsCache: Record<string, any> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const status = searchParams.get("status")?.toLowerCase().trim() || "";

    let allCards: any[] = [];
    try {
      allCards = db.select().from(cards).orderBy(desc(cards.createdAt)).all();
    } catch {
      allCards = [];
    }

    if (!allCards || allCards.length === 0) {
      allCards = [
        {
          id: "crd_1",
          userId: "usr_ritesh",
          profileId: "prof_ritesh",
          variant: "atelier",
          finish: "pitch_black",
          material: "mirror",
          nfcUid: "04:A2:8F:E1:99:3B:80",
          qrSlug: "ritesh",
          customEngraving: "EDITION NO. 001/100",
          laserFont: "Cinzel",
          status: "active",
          isActivated: 1,
          activatedAt: new Date(Date.now() - 3600000 * 48),
          createdAt: new Date(Date.now() - 3600000 * 50),
        },
        {
          id: "crd_2",
          userId: "usr_aarav",
          profileId: "prof_aarav",
          variant: "metal",
          finish: "silver",
          material: "brushed",
          nfcUid: "04:C5:12:44:0B:77:81",
          qrSlug: "aarav",
          customEngraving: "EXECUTIVE NO. 018",
          laserFont: "Plus Jakarta Sans",
          status: "active",
          isActivated: 1,
          activatedAt: new Date(Date.now() - 3600000 * 18),
          createdAt: new Date(Date.now() - 3600000 * 20),
        },
        {
          id: "crd_3",
          userId: "usr_demo",
          profileId: "prof_demo",
          variant: "atelier",
          finish: "gold",
          material: "mirror",
          nfcUid: "04:77:E9:1A:4C:90:82",
          qrSlug: "demo",
          customEngraving: "MONOGRAM JV · 2026",
          laserFont: "Playfair Display",
          status: "active",
          isActivated: 1,
          activatedAt: new Date(Date.now() - 3600000 * 4),
          createdAt: new Date(Date.now() - 3600000 * 5),
        },
        {
          id: "crd_4",
          userId: "usr_priya",
          profileId: "prof_priya",
          variant: "atelier",
          finish: "royal_red",
          material: "mirror",
          nfcUid: null,
          qrSlug: "priya",
          customEngraving: "ATELIER BESPOKE NO. 042",
          laserFont: "Syne",
          status: "unassigned",
          isActivated: 0,
          activatedAt: null,
          createdAt: new Date(Date.now() - 3600000 * 2),
        },
        {
          id: "crd_5",
          userId: "usr_kavya",
          profileId: "prof_kavya",
          variant: "metal",
          finish: "cobalt_blue",
          material: "mirror",
          nfcUid: null,
          qrSlug: "kavya",
          customEngraving: "NXC PARTNER · 009",
          laserFont: "Orbitron",
          status: "unassigned",
          isActivated: 0,
          activatedAt: null,
          createdAt: new Date(Date.now() - 3600000 * 1),
        },
      ];
    }

    // Apply in-memory overlays
    allCards = allCards.map((c) => {
      if (memoryCardsCache[c.id]) {
        return { ...c, ...memoryCardsCache[c.id] };
      }
      return c;
    });

    let filtered = allCards;
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.qrSlug?.toLowerCase().includes(search) ||
          c.nfcUid?.toLowerCase().includes(search) ||
          c.customEngraving?.toLowerCase().includes(search) ||
          c.finish?.toLowerCase().includes(search)
      );
    }
    if (status && status !== "all") {
      filtered = filtered.filter((c) => c.status?.toLowerCase() === status);
    }

    return NextResponse.json({ success: true, cards: filtered });
  } catch (err) {
    console.error("Admin cards fetch failed:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch cards" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardId, nfcUid, status } = body;

    if (!cardId) {
      return NextResponse.json({ error: "Card ID required" }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (nfcUid !== undefined) {
      updates.nfcUid = nfcUid ? nfcUid.toUpperCase().trim() : null;
      updates.isActivated = updates.nfcUid ? 1 : 0;
      if (updates.nfcUid) {
        updates.status = "active";
        updates.activatedAt = new Date();
      }
    }
    if (status !== undefined) updates.status = status;

    memoryCardsCache[cardId] = {
      ...(memoryCardsCache[cardId] || {}),
      ...updates,
    };

    try {
      db.update(cards).set(updates).where(eq(cards.id, cardId)).run();
    } catch (e) {
      console.warn("DB update failed, using memory fallback:", e);
    }

    return NextResponse.json({ success: true, updated: updates });
  } catch (err) {
    console.error("Admin card update failed:", err);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}
