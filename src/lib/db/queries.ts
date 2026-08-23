import { db } from "./index";
import { users, profiles, profileLinks, cards, subscriptions, cardDesigns, orders, analyticsEvents, contacts } from "./schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  const normalized = email.toLowerCase().trim();
  return db.select().from(users).where(eq(users.email, normalized)).get();
}

export async function getUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export async function createUserWithProfile(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  username: string;
  designation?: string;
  company?: string;
  phone?: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const normalizedUsername = data.username.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
  const now = new Date();

  const userId = `usr_${Math.random().toString(36).substring(2, 10)}`;
  const profileId = `prof_${Math.random().toString(36).substring(2, 10)}`;
  const cardId = `crd_${Math.random().toString(36).substring(2, 10)}`;
  const subId = `sub_${Math.random().toString(36).substring(2, 10)}`;

  // 1. Insert User
  const newUser = db.insert(users).values({
    id: userId,
    email: normalizedEmail,
    passwordHash: data.passwordHash,
    role: "customer",
    createdAt: now,
    updatedAt: now,
  }).returning().get();

  // 2. Insert Profile
  const newProfile = db.insert(profiles).values({
    id: profileId,
    userId,
    username: normalizedUsername,
    fullName: data.fullName,
    designation: data.designation || "Executive Member",
    company: data.company || "NXC Sovereign Network",
    bio: "Sovereign digital identity powered by aerospace-grade tactile hardware.",
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
    phone: data.phone || null,
    email: normalizedEmail,
    website: "https://nxcverse.in",
    location: "Global",
    isVerified: true,
    isPublic: true,
    customTheme: "obsidian",
    createdAt: now,
    updatedAt: now,
  }).returning().get();

  // 3. Assign Default Permanent Hardware Card with Default QR Slug
  db.insert(cards).values({
    id: cardId,
    profileId,
    userId,
    variant: "metal",
    finish: "pitch_black",
    material: "mirror",
    nfcUid: `04:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:99`,
    qrSlug: normalizedUsername,
    customEngraving: `FOUNDER NO. ${Math.floor(100 + Math.random() * 900)}`,
    logoKey: "phoenix",
    showQr: true,
    status: "active",
    activatedAt: now,
    createdAt: now,
  }).run();

  // 4. Assign Default Active Subscription
  db.insert(subscriptions).values({
    id: subId,
    userId,
    profileId,
    tier: "metal",
    status: "active",
    currency: "INR",
    amount: 1599,
    billingCycle: "1_year",
    startDate: now,
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    autoRenew: true,
    createdAt: now,
  }).run();

  // 5. Default Social Links
  db.insert(profileLinks).values({
    id: `lnk_${Math.random().toString(36).substring(2, 10)}`,
    profileId,
    platform: "website",
    label: "Sovereign Link",
    url: `https://nxcverse.in/@${normalizedUsername}`,
    icon: "globe",
    sortOrder: 0,
    isVisible: true,
    clickCount: 0,
    createdAt: now,
  }).run();

  return { user: newUser, profile: newProfile };
}

export async function getContactsByUserId(userId: string) {
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.createdAt))
    .all();
}

export async function getContactsByProfileId(profileId: string) {
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.profileId, profileId))
    .orderBy(desc(contacts.createdAt))
    .all();
}

export async function createContact(data: {
  profileId: string;
  userId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  designation?: string | null;
  notes?: string | null;
  source?: "profile_exchange" | "manual" | "nfc_tap";
}) {
  const id = `cnt_${Math.random().toString(36).substring(2, 10)}`;
  return db.insert(contacts).values({
    id,
    profileId: data.profileId,
    userId: data.userId,
    fullName: data.fullName,
    email: data.email || null,
    phone: data.phone || null,
    company: data.company || null,
    designation: data.designation || null,
    notes: data.notes || null,
    source: data.source || "profile_exchange",
    createdAt: new Date(),
  }).returning().get();
}

export async function deleteContact(id: string, userId: string) {
  return db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId))).run();
}

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
