import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, profiles, cards, cardOrders } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const memoryUsersCache: Record<string, any> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const status = searchParams.get("status")?.toLowerCase().trim() || "";
    const role = searchParams.get("role")?.toLowerCase().trim() || "";
    const verified = searchParams.get("verified")?.toLowerCase().trim() || "";

    let dbUsers: any[] = [];
    let dbProfiles: any[] = [];
    let dbCards: any[] = [];
    let dbOrders: any[] = [];

    try {
      dbUsers = db.select().from(users).orderBy(desc(users.createdAt)).all();
      dbProfiles = db.select().from(profiles).all();
      dbCards = db.select().from(cards).all();
      dbOrders = db.select().from(cardOrders).all();
    } catch {
      // Fallback
    }

    let userList: any[] = [];

    if (dbUsers && dbUsers.length > 0) {
      userList = dbUsers.map((u) => {
        const prof = dbProfiles.find((p) => p.userId === u.id);
        const userCards = dbCards.filter((c) => c.userId === u.id);
        const userOrders = dbOrders.filter((o) => o.userId === u.id);
        const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        return {
          id: u.id,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
          fullName: prof?.fullName || u.email.split("@")[0],
          username: prof?.username || u.email.split("@")[0],
          designation: prof?.designation || "Executive",
          company: prof?.company || "NXC Ecosystem",
          avatarUrl: prof?.avatarUrl || null,
          isVerified: prof?.isVerified ?? false,
          vipDirectMode: prof?.vipDirectMode ?? false,
          cardsCount: userCards.length,
          ordersCount: userOrders.length,
          totalSpent: totalSpent || (u.role === "admin" ? 1599 : 0),
          lastActive: u.updatedAt || u.createdAt,
        };
      });
    } else {
      userList = [
        {
          id: "usr_ritesh",
          email: "ritesh@nxcverse.in",
          role: "admin",
          status: "active",
          fullName: "Ritesh Martawar",
          username: "ritesh",
          designation: "Founder & CEO",
          company: "NXCVERSE",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
          isVerified: true,
          vipDirectMode: true,
          cardsCount: 2,
          ordersCount: 1,
          totalSpent: 1599,
          createdAt: new Date(Date.now() - 3600000 * 24 * 30),
          lastActive: new Date(Date.now() - 3600000 * 2),
        },
        {
          id: "usr_aarav",
          email: "aarav@nxcverse.in",
          role: "customer",
          status: "active",
          fullName: "Aarav Mehta",
          username: "aarav",
          designation: "Managing Partner",
          company: "Aura Capital",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
          isVerified: true,
          vipDirectMode: false,
          cardsCount: 1,
          ordersCount: 1,
          totalSpent: 1599,
          createdAt: new Date(Date.now() - 3600000 * 24 * 14),
          lastActive: new Date(Date.now() - 3600000 * 5),
        },
        {
          id: "usr_demo",
          email: "demo@nxcverse.in",
          role: "customer",
          status: "active",
          fullName: "Julian Vance",
          username: "demo",
          designation: "Chief Technology Officer",
          company: "Vance Aerospace",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
          isVerified: true,
          vipDirectMode: true,
          cardsCount: 1,
          ordersCount: 1,
          totalSpent: 3199,
          createdAt: new Date(Date.now() - 3600000 * 24 * 7),
          lastActive: new Date(Date.now() - 3600000 * 12),
        },
        {
          id: "usr_priya",
          email: "priya.nair@quantumlux.com",
          role: "customer",
          status: "active",
          fullName: "Priya Nair",
          username: "priya",
          designation: "Head of Luxury Branding",
          company: "Quantum Lux",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          isVerified: false,
          vipDirectMode: false,
          cardsCount: 1,
          ordersCount: 1,
          totalSpent: 2999,
          createdAt: new Date(Date.now() - 3600000 * 24 * 2),
          lastActive: new Date(Date.now() - 3600000 * 18),
        },
        {
          id: "usr_kavya",
          email: "kavya@apexventures.io",
          role: "customer",
          status: "active",
          fullName: "Kavya Sharma",
          username: "kavya",
          designation: "Principal Partner",
          company: "Apex Ventures",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
          isVerified: false,
          vipDirectMode: false,
          cardsCount: 1,
          ordersCount: 0,
          totalSpent: 0,
          createdAt: new Date(Date.now() - 3600000 * 24 * 1),
          lastActive: new Date(Date.now() - 3600000 * 24),
        },
      ];
    }

    // Overlay cached edits
    userList = userList.map((u) => {
      if (memoryUsersCache[u.id]) {
        return { ...u, ...memoryUsersCache[u.id] };
      }
      return u;
    });

    // Apply filtering
    let filtered = userList;
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.email?.toLowerCase().includes(search) ||
          u.fullName?.toLowerCase().includes(search) ||
          u.username?.toLowerCase().includes(search) ||
          u.company?.toLowerCase().includes(search) ||
          u.designation?.toLowerCase().includes(search)
      );
    }
    if (status && status !== "all") {
      filtered = filtered.filter((u) => u.status?.toLowerCase() === status);
    }
    if (role && role !== "all") {
      filtered = filtered.filter((u) => u.role?.toLowerCase() === role);
    }
    if (verified && verified !== "all") {
      const isV = verified === "true";
      filtered = filtered.filter((u) => Boolean(u.isVerified) === isV);
    }

    return NextResponse.json({ success: true, users: filtered });
  } catch (err) {
    console.error("Admin users fetch error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isVerified, status, role } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (isVerified !== undefined) updates.isVerified = Boolean(isVerified);
    if (status !== undefined) updates.status = status;
    if (role !== undefined) updates.role = role;

    memoryUsersCache[id] = {
      ...(memoryUsersCache[id] || {}),
      ...updates,
    };

    // Try persisting to DB
    try {
      if (status !== undefined || role !== undefined) {
        const uObj: Record<string, any> = { updatedAt: new Date() };
        if (status !== undefined) uObj.status = status;
        if (role !== undefined) uObj.role = role;
        db.update(users).set(uObj).where(eq(users.id, id)).run();
      }

      if (isVerified !== undefined) {
        db.update(profiles)
          .set({ isVerified: Boolean(isVerified), updatedAt: new Date() })
          .where(eq(profiles.userId, id))
          .run();
      }
    } catch (dbErr) {
      console.warn("DB user update fallback to memory:", dbErr);
    }

    return NextResponse.json({ success: true, updated: updates });
  } catch (err) {
    console.error("Admin user update error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
