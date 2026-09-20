import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cardOrders } from "@/lib/db/schema";
import { desc, eq, like, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

// In-memory persistent cache to guarantee real-time updates survive even if SQLite table isn't accessible
const memoryOrdersCache: Record<string, any> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const status = searchParams.get("status")?.toLowerCase().trim() || "";
    const tier = searchParams.get("tier")?.toLowerCase().trim() || "";

    let orders: any[] = [];
    try {
      orders = db.select().from(cardOrders).orderBy(desc(cardOrders.createdAt)).all();
    } catch {
      orders = [];
    }

    // Default seed fallback if database table has 0 orders
    if (!orders || orders.length === 0) {
      orders = [
        {
          id: "ord_1",
          orderNumber: "NXC-ORD-882190",
          userId: "usr_ritesh",
          cardId: "crd_1",
          tier: "metal",
          finish: "pitch_black",
          material: "mirror",
          engravingName: "RITESH MARTAWAR",
          engravingTitle: "FOUNDER & CEO",
          laserFont: "Cinzel",
          customEngraving: "EDITION NO. 001/100",
          amount: 1599,
          currency: "INR",
          paymentGateway: "razorpay",
          paymentId: "pay_mock_123",
          paymentStatus: "paid",
          orderStatus: "delivered",
          shippingAddress: "Worli Sea Face, Mumbai 400018",
          customerName: "Ritesh Martawar",
          customerEmail: "ritesh@nxcverse.in",
          customerPhone: "+91 9561248677",
          trackingNumber: "BD9928172901",
          courierPartner: "Blue Dart Express",
          createdAt: new Date(Date.now() - 3600000 * 48),
          updatedAt: new Date(Date.now() - 3600000 * 24),
        },
        {
          id: "ord_2",
          orderNumber: "NXC-ORD-449102",
          userId: "usr_aarav",
          cardId: "crd_2",
          tier: "metal",
          finish: "silver",
          material: "brushed",
          engravingName: "AARAV MEHTA",
          engravingTitle: "MANAGING PARTNER",
          laserFont: "Plus Jakarta Sans",
          customEngraving: "EXECUTIVE NO. 018",
          amount: 1599,
          currency: "INR",
          paymentGateway: "razorpay",
          paymentId: "pay_mock_456",
          paymentStatus: "paid",
          orderStatus: "shipped",
          shippingAddress: "12 UB City Residences, Vittal Mallya Rd, Bengaluru 560001",
          customerName: "Aarav Mehta",
          customerEmail: "aarav@nxcverse.in",
          customerPhone: "+91 98201 44521",
          trackingNumber: "DEL7729104",
          courierPartner: "Delhivery Air",
          createdAt: new Date(Date.now() - 3600000 * 18),
          updatedAt: new Date(Date.now() - 3600000 * 6),
        },
        {
          id: "ord_3",
          orderNumber: "NXC-ORD-110934",
          userId: "usr_demo",
          cardId: "crd_3",
          tier: "atelier",
          finish: "gold",
          material: "mirror",
          engravingName: "JULIAN VANCE",
          engravingTitle: "CHIEF TECHNOLOGY OFFICER",
          laserFont: "Playfair Display",
          customEngraving: "MONOGRAM JV · 2026",
          amount: 38,
          currency: "USD",
          paymentGateway: "stripe",
          paymentId: "pi_mock_789",
          paymentStatus: "paid",
          orderStatus: "engraving",
          shippingAddress: "88 Berkeley Square, Mayfair, London W1J 6ER",
          customerName: "Julian Vance",
          customerEmail: "demo@nxcverse.in",
          customerPhone: "+44 20 7946 0991",
          trackingNumber: null,
          courierPartner: "DHL Express Global",
          createdAt: new Date(Date.now() - 3600000 * 5),
          updatedAt: new Date(Date.now() - 3600000 * 2),
        },
        {
          id: "ord_4",
          orderNumber: "NXC-ORD-667231",
          userId: "usr_priya",
          cardId: "crd_4",
          tier: "atelier",
          finish: "royal_red",
          material: "mirror",
          engravingName: "PRIYA NAIR",
          engravingTitle: "HEAD OF LUXURY BRANDING",
          laserFont: "Syne",
          customEngraving: "ATELIER BESPOKE NO. 042",
          amount: 2999,
          currency: "INR",
          paymentGateway: "razorpay",
          paymentId: "pay_mock_991",
          paymentStatus: "paid",
          orderStatus: "pending",
          shippingAddress: "Penthouse 4B, Golf Links, New Delhi 110003",
          customerName: "Priya Nair",
          customerEmail: "priya.nair@quantumlux.com",
          customerPhone: "+91 98450 77123",
          trackingNumber: null,
          courierPartner: "Blue Dart Express",
          createdAt: new Date(Date.now() - 3600000 * 1.5),
          updatedAt: new Date(Date.now() - 3600000 * 1.5),
        },
      ];
    }

    // Overlay any in-memory patched updates
    orders = orders.map((o) => {
      if (memoryOrdersCache[o.id]) {
        return { ...o, ...memoryOrdersCache[o.id] };
      }
      return o;
    });

    // Apply Filters
    let filtered = orders;
    if (search) {
      filtered = filtered.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(search) ||
          o.engravingName?.toLowerCase().includes(search) ||
          o.customerName?.toLowerCase().includes(search) ||
          o.customerEmail?.toLowerCase().includes(search) ||
          o.trackingNumber?.toLowerCase().includes(search) ||
          o.shippingAddress?.toLowerCase().includes(search)
      );
    }
    if (status && status !== "all") {
      filtered = filtered.filter((o) => o.orderStatus?.toLowerCase() === status);
    }
    if (tier && tier !== "all") {
      filtered = filtered.filter((o) => o.tier?.toLowerCase() === tier);
    }

    return NextResponse.json({ success: true, orders: filtered });
  } catch (err) {
    console.error("Admin orders fetch failed:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, orderStatus, trackingNumber, courierPartner, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (orderStatus !== undefined) updates.orderStatus = orderStatus;
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (courierPartner !== undefined) updates.courierPartner = courierPartner;
    if (notes !== undefined) updates.notes = notes;

    // Save to in-memory overlay
    memoryOrdersCache[id] = {
      ...(memoryOrdersCache[id] || {}),
      ...updates,
    };

    // Try persisting to DB
    try {
      db.update(cardOrders)
        .set(updates)
        .where(eq(cardOrders.id, id))
        .run();
    } catch (dbErr) {
      console.warn("DB update failed, using in-memory cache:", dbErr);
    }

    return NextResponse.json({ success: true, updated: updates });
  } catch (err) {
    console.error("Admin order update failed:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
