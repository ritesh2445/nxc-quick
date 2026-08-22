import { db } from "./index";
import { users, profiles, profileLinks, cards, subscriptions, cardDesigns, orders, analyticsEvents } from "./schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getProfileByUsername(username: string) {
  const normalized = username.toLowerCase().trim();
  const profile = db.select().from(profiles).where(eq(profiles.username, normalized)).get();
  if (!profile) return null;

  const links = db
    .select()
    .from(profileLinks)
    .where(and(eq(profileLinks.profileId, profile.id), eq(profileLinks.isVisible, true)))
    .all()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const card = db.select().from(cards).where(eq(cards.profileId, profile.id)).get();
  const subscription = db.select().from(subscriptions).where(eq(subscriptions.profileId, profile.id)).get();

  return {
    ...profile,
    links,
    card,
    subscription,
  };
}

export async function getProfileById(id: string) {
  return db.select().from(profiles).where(eq(profiles.id, id)).get();
}

export async function getProfileLinks(profileId: string) {
  return db.select().from(profileLinks).where(eq(profileLinks.profileId, profileId)).all();
}

export async function updateProfile(id: string, data: Partial<typeof profiles.$inferInsert>) {
  return db
    .update(profiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(profiles.id, id))
    .returning()
    .get();
}

export async function updateProfileLinks(profileId: string, links: Array<{ id?: string; platform: string; label: string; url: string; icon?: string; sortOrder: number; isVisible: boolean }>) {
  // Delete existing links for clean replacement or update
  db.delete(profileLinks).where(eq(profileLinks.profileId, profileId)).run();

  for (let i = 0; i < links.length; i++) {
    const l = links[i];
    db.insert(profileLinks).values({
      id: l.id || `link_${Math.random().toString(36).substring(2, 10)}`,
      profileId,
      platform: l.platform,
      label: l.label,
      url: l.url,
      icon: l.icon || null,
      sortOrder: i,
      isVisible: l.isVisible !== false,
      clickCount: 0,
      createdAt: new Date(),
    }).run();
  }

  return getProfileLinks(profileId);
}

export async function getUserDashboardData(userId: string) {
  const user = db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return null;

  const profile = db.select().from(profiles).where(eq(profiles.userId, userId)).get();
  if (!profile) return null;

  const links = db.select().from(profileLinks).where(eq(profileLinks.profileId, profile.id)).all();
  const card = db.select().from(cards).where(eq(cards.profileId, profile.id)).get();
  const subscription = db.select().from(subscriptions).where(eq(subscriptions.profileId, profile.id)).get();
  const userOrders = db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)).all();

  // Aggregate analytics
  const totalViews = db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "view"))).get()?.count || 0;
  const totalSaves = db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "contact_save"))).get()?.count || 0;
  const totalScans = db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "qr_scan"))).get()?.count || 0;
  const totalTaps = db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "nfc_tap"))).get()?.count || 0;

  const recentEvents = db.select().from(analyticsEvents).where(eq(analyticsEvents.profileId, profile.id)).orderBy(desc(analyticsEvents.createdAt)).limit(10).all();

  return {
    user,
    profile,
    links,
    card,
    subscription,
    orders: userOrders,
    stats: {
      totalViews,
      totalSaves,
      totalScans,
      totalTaps,
    },
    recentEvents,
  };
}

export async function getAllCardDesigns() {
  return db.select().from(cardDesigns).where(eq(cardDesigns.isAvailable, true)).orderBy(cardDesigns.sortOrder).all();
}

export async function getCardDesignBySlug(slug: string) {
  return db.select().from(cardDesigns).where(eq(cardDesigns.slug, slug)).get();
}

export async function recordAnalyticsEvent(data: {
  profileId: string;
  eventType: string;
  linkId?: string;
  referrer?: string;
  device?: string;
  browser?: string;
  country?: string;
  city?: string;
}) {
  try {
    const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.insert(analyticsEvents).values({
      id,
      profileId: data.profileId,
      eventType: data.eventType,
      linkId: data.linkId || null,
      referrer: data.referrer || null,
      device: data.device || null,
      browser: data.browser || null,
      country: data.country || "IN",
      city: data.city || null,
      createdAt: new Date(),
    }).run();
    return true;
  } catch (err) {
    console.error("Non-blocking analytics insert failed:", err);
    return false;
  }
}

export async function getAdminOverview() {
  const totalUsers = db.select({ count: sql<number>`count(*)` }).from(users).get()?.count || 0;
  const totalCards = db.select({ count: sql<number>`count(*)` }).from(cards).get()?.count || 0;
  const totalOrders = db.select({ count: sql<number>`count(*)` }).from(orders).get()?.count || 0;
  const totalEvents = db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).get()?.count || 0;

  const recentUsers = db.select().from(users).orderBy(desc(users.createdAt)).limit(10).all();
  const recentCards = db.select().from(cards).orderBy(desc(cards.createdAt)).limit(10).all();
  const recentOrders = db.select().from(orders).orderBy(desc(orders.createdAt)).limit(10).all();

  return {
    metrics: {
      totalUsers,
      totalCards,
      totalOrders,
      totalEvents,
    },
    recentUsers,
    recentCards,
    recentOrders,
  };
}

export async function assignNfcUid(cardId: string, nfcUid: string) {
  return db
    .update(cards)
    .set({ nfcUid: nfcUid.trim().toUpperCase(), status: "active", activatedAt: new Date() })
    .where(eq(cards.id, cardId))
    .returning()
    .get();
}

export async function createOrder(data: {
  userId: string;
  tier: string;
  finish: string;
  material: string;
  engravingName: string;
  engravingTitle?: string;
  amount: number;
  currency: string;
  paymentGateway: "razorpay" | "stripe";
  paymentId: string;
  shippingAddress?: string;
}) {
  const orderNumber = `NXC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const id = `ord_${Math.random().toString(36).substring(2, 10)}`;

  const newOrder = db.insert(orders).values({
    id,
    orderNumber,
    userId: data.userId,
    tier: data.tier,
    finish: data.finish,
    material: data.material,
    engravingName: data.engravingName,
    engravingTitle: data.engravingTitle || null,
    amount: data.amount,
    currency: data.currency,
    status: "paid",
    paymentGateway: data.paymentGateway,
    paymentId: data.paymentId,
    shippingAddress: data.shippingAddress || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning().get();

  return newOrder;
}
