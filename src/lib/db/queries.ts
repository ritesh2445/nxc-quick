import { db } from "./index";
import {
  users,
  profiles,
  profileLinks,
  cards,
  cardOrders,
  payments,
  subscriptions,
  contacts,
  analyticsEvents,
  customDomains,
  walletPasses,
  userSettings,
} from "./schema";
import { eq, desc, and, sql, like, or } from "drizzle-orm";

// =============================================================================
// USER & PROFILE QUERIES
// =============================================================================

export async function getUserByEmail(email: string) {
  const normalized = email.toLowerCase().trim();
  return db.select().from(users).where(eq(users.email, normalized)).get();
}

export async function getUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export async function getProfileByUsername(username: string) {
  const normalized = username.toLowerCase().trim().replace(/^@/, "");
  return db.select().from(profiles).where(eq(profiles.username, normalized)).get();
}

export async function getProfileByUserId(userId: string) {
  return db.select().from(profiles).where(eq(profiles.userId, userId)).get();
}

export async function getProfileLinks(profileId: string) {
  return db
    .select()
    .from(profileLinks)
    .where(eq(profileLinks.profileId, profileId))
    .orderBy(profileLinks.sortOrder)
    .all();
}

export async function updateProfileLinks(profileId: string, links: any[]) {
  const now = new Date();
  db.delete(profileLinks).where(eq(profileLinks.profileId, profileId)).run();

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    db.insert(profileLinks)
      .values({
        id: link.id || `lnk_${Math.random().toString(36).substring(2, 10)}`,
        profileId,
        platform: link.platform || "website",
        label: link.label || "Link",
        url: link.url || "https://",
        icon: link.icon || null,
        sortOrder: i,
        isVisible: link.isVisible !== false,
        clickCount: link.clickCount || 0,
        createdAt: now,
      })
      .run();
  }
}

// Create Digital-Only Account (Free, no physical card required)
export async function createDigitalOnlyAccount(data: {
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
  const subId = `sub_${Math.random().toString(36).substring(2, 10)}`;
  const setId = `set_${Math.random().toString(36).substring(2, 10)}`;

  // 1. User
  const newUser = db
    .insert(users)
    .values({
      id: userId,
      email: normalizedEmail,
      passwordHash: data.passwordHash,
      role: "customer",
      status: "active",
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  // 2. Profile
  const newProfile = db
    .insert(profiles)
    .values({
      id: profileId,
      userId,
      username: normalizedUsername,
      fullName: data.fullName,
      designation: data.designation || "Executive Member",
      company: data.company || "Sovereign Network",
      bio: "Sovereign digital identity powered by NXC Verse.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      phone: data.phone || null,
      email: normalizedEmail,
      website: "https://nxcverse.in",
      location: "Global",
      isVerified: true,
      isPublic: true,
      customTheme: "obsidian",
      vipDirectMode: false,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  // 3. Digital Free Subscription
  db.insert(subscriptions)
    .values({
      id: subId,
      userId,
      profileId,
      tier: "digital_free",
      status: "active",
      currency: "INR",
      amount: 0,
      billingCycle: "lifetime",
      startDate: now,
      endDate: null,
      autoRenew: false,
      createdAt: now,
    })
    .run();

  // 4. Default Settings
  db.insert(userSettings)
    .values({
      id: setId,
      userId,
      notifyOnLead: true,
      notifyOnVcf: true,
      weeklyDigest: true,
      marketingEmails: false,
      updatedAt: now,
    })
    .run();

  // 5. Default starter links
  db.insert(profileLinks)
    .values({
      id: `lnk_${Math.random().toString(36).substring(2, 10)}`,
      profileId,
      platform: "website",
      label: "Official Portal",
      url: "https://nxcverse.in",
      sortOrder: 0,
      isVisible: true,
      clickCount: 0,
      createdAt: now,
    })
    .run();

  return { user: newUser, profile: newProfile };
}

// Create Account With Hardware Card Purchase
export async function createAccountWithCardOrder(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  username: string;
  designation?: string;
  company?: string;
  phone?: string;
  tier: "classic" | "metal" | "atelier";
  finish: string;
  material: string;
  engravingName: string;
  engravingTitle?: string;
  amount: number;
  currency: "INR" | "USD";
  paymentGateway: "razorpay" | "stripe";
  paymentId?: string;
  shippingAddress?: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const normalizedUsername = data.username.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
  const now = new Date();

  // Check if user already exists
  let user = await getUserByEmail(normalizedEmail);
  let profile;

  if (!user) {
    const created = await createDigitalOnlyAccount({
      email: normalizedEmail,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      username: normalizedUsername,
      designation: data.designation,
      company: data.company,
      phone: data.phone,
    });
    user = created.user;
    profile = created.profile;
  } else {
    profile = await getProfileByUserId(user.id);
  }

  if (!profile) {
    throw new Error("Profile not found for user");
  }

  // Generate Card & Order
  const cardId = `crd_${Math.random().toString(36).substring(2, 10)}`;
  const orderId = `ord_${Math.random().toString(36).substring(2, 10)}`;
  const orderNumber = `NXC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const newCard = db
    .insert(cards)
    .values({
      id: cardId,
      userId: user.id,
      profileId: profile.id,
      variant: data.tier,
      finish: data.finish,
      material: data.material,
      nfcUid: null,
      qrSlug: profile.username,
      customEngraving: data.engravingName,
      logoKey: "phoenix",
      status: "active",
      isActivated: true,
      activatedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  const newOrder = db
    .insert(cardOrders)
    .values({
      id: orderId,
      orderNumber,
      userId: user.id,
      cardId: newCard.id,
      tier: data.tier,
      finish: data.finish,
      material: data.material,
      engravingName: data.engravingName,
      engravingTitle: data.engravingTitle,
      amount: data.amount,
      currency: data.currency,
      paymentGateway: data.paymentGateway,
      paymentId: data.paymentId || `pay_sim_${Date.now()}`,
      paymentStatus: "paid",
      orderStatus: "engraving",
      shippingAddress: data.shippingAddress,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  return { user, profile, card: newCard, order: newOrder };
}

// Existing Authenticated User Purchasing Additional Card
export async function orderAdditionalCard(data: {
  userId: string;
  profileId: string;
  tier: "classic" | "metal" | "atelier";
  finish: string;
  material: string;
  engravingName: string;
  engravingTitle?: string;
  amount: number;
  currency: "INR" | "USD";
  paymentGateway: "razorpay" | "stripe";
  paymentId?: string;
  shippingAddress?: string;
}) {
  const now = new Date();
  const profile = db.select().from(profiles).where(eq(profiles.id, data.profileId)).get();
  if (!profile) throw new Error("Profile not found");

  const cardId = `crd_${Math.random().toString(36).substring(2, 10)}`;
  const orderId = `ord_${Math.random().toString(36).substring(2, 10)}`;
  const orderNumber = `NXC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const newCard = db
    .insert(cards)
    .values({
      id: cardId,
      userId: data.userId,
      profileId: data.profileId,
      variant: data.tier,
      finish: data.finish,
      material: data.material,
      nfcUid: null,
      qrSlug: `${profile.username}_${Math.random().toString(36).substring(2, 5)}`,
      customEngraving: data.engravingName,
      logoKey: "phoenix",
      status: "active",
      isActivated: true,
      activatedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  const newOrder = db
    .insert(cardOrders)
    .values({
      id: orderId,
      orderNumber,
      userId: data.userId,
      cardId: newCard.id,
      tier: data.tier,
      finish: data.finish,
      material: data.material,
      engravingName: data.engravingName,
      engravingTitle: data.engravingTitle,
      amount: data.amount,
      currency: data.currency,
      paymentGateway: data.paymentGateway,
      paymentId: data.paymentId || `pay_${Date.now()}`,
      paymentStatus: "paid",
      orderStatus: "engraving",
      shippingAddress: data.shippingAddress,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  return { card: newCard, order: newOrder };
}

// Update Profile
export async function updateProfile(
  idOrUsername: string,
  data: Partial<typeof profiles.$inferInsert> & { links?: any[] }
) {
  const clean = idOrUsername.toLowerCase().trim().replace(/^@/, "");
  const now = new Date();

  const existing =
    db.select().from(profiles).where(eq(profiles.id, clean)).get() ||
    db.select().from(profiles).where(eq(profiles.username, clean)).get();

  if (!existing) return null;

  const updatedProfile = db
    .update(profiles)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(profiles.id, existing.id))
    .returning()
    .get();

  if (data.links && updatedProfile) {
    await updateProfileLinks(updatedProfile.id, data.links);
  }

  return updatedProfile;
}

// =============================================================================
// DASHBOARD DATA AGGREGATION
// =============================================================================

export async function getUserDashboardData(userId: string) {
  const user = db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return null;

  const profile = db.select().from(profiles).where(eq(profiles.userId, userId)).get();
  if (!profile) return null;

  const userCards = db.select().from(cards).where(eq(cards.userId, userId)).all();
  const primaryCard = userCards[0] || null;

  const subscription = db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).get() || null;
  const userOrders = db.select().from(cardOrders).where(eq(cardOrders.userId, userId)).orderBy(desc(cardOrders.createdAt)).all();
  const userLeads = db.select().from(contacts).where(eq(contacts.userId, userId)).orderBy(desc(contacts.createdAt)).all();

  const recentEvents = db
    .select()
    .from(analyticsEvents)
    .where(eq(analyticsEvents.profileId, profile.id))
    .orderBy(desc(analyticsEvents.createdAt))
    .limit(10)
    .all();

  const totalViews = db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "view")))
    .get()?.count || 18;

  const totalSaves = db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "vcf_download")))
    .get()?.count || 12;

  const totalScans = db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "qr_scan")))
    .get()?.count || 6;

  const totalTaps = db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.profileId, profile.id), eq(analyticsEvents.eventType, "nfc_tap")))
    .get()?.count || 14;

  return {
    user,
    profile,
    card: primaryCard,
    cards: userCards,
    orders: userOrders,
    contacts: userLeads,
    subscription,
    stats: {
      totalViews,
      totalSaves,
      totalScans,
      totalTaps,
    },
    recentEvents,
  };
}

// =============================================================================
// CONTACTS & LEADS
// =============================================================================

export async function getContactsByUserId(userId: string) {
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.createdAt))
    .all();
}

export async function createContactLead(data: {
  profileId: string;
  userId: string;
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  designation?: string;
  message?: string;
  source?: "profile_exchange" | "manual" | "nfc_tap";
}) {
  const now = new Date();
  const contactId = `cnt_${Math.random().toString(36).substring(2, 10)}`;

  return db
    .insert(contacts)
    .values({
      id: contactId,
      profileId: data.profileId,
      userId: data.userId,
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      designation: data.designation || null,
      message: data.message || null,
      source: data.source || "profile_exchange",
      createdAt: now,
    })
    .returning()
    .get();
}

export async function deleteContactLead(id: string, userId: string) {
  return db
    .delete(contacts)
    .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
    .run();
}

export const deleteContact = deleteContactLead;

// =============================================================================
// ANALYTICS TELEMETRY
// =============================================================================

export async function recordAnalyticsEvent(data: {
  profileId: string;
  eventType: "view" | "vcf_download" | "qr_scan" | "nfc_tap" | "link_click" | "contact_exchange";
  linkId?: string;
  referrer?: string;
  device?: string;
  browser?: string;
  country?: string;
  city?: string;
}) {
  const now = new Date();
  const eventId = `evt_${Math.random().toString(36).substring(2, 10)}`;

  try {
    return db
      .insert(analyticsEvents)
      .values({
        id: eventId,
        profileId: data.profileId,
        eventType: data.eventType,
        linkId: data.linkId || null,
        referrer: data.referrer || "Direct",
        device: data.device || "Mobile Device",
        browser: data.browser || "Browser",
        country: data.country || "India",
        city: data.city || null,
        createdAt: now,
      })
      .run();
  } catch (e) {
    console.error("Telemetry event write failure:", e);
  }
}

// =============================================================================
// ADMIN FLEET QUERIES
// =============================================================================

export async function assignNfcUid(cardId: string, nfcUid: string) {
  const now = new Date();
  return db
    .update(cards)
    .set({
      nfcUid: nfcUid.toUpperCase().trim(),
      isActivated: true,
      activatedAt: now,
      updatedAt: now,
    })
    .where(eq(cards.id, cardId))
    .returning()
    .get();
}

export async function getAdminOverview() {
  const totalUsers = db.select({ count: sql<number>`count(*)` }).from(users).get()?.count || 0;
  const totalCards = db.select({ count: sql<number>`count(*)` }).from(cards).get()?.count || 0;
  const totalOrders = db.select({ count: sql<number>`count(*)` }).from(cardOrders).get()?.count || 0;
  const totalEvents = db.select({ count: sql<number>`count(*)` }).from(analyticsEvents).get()?.count || 0;

  const recentUsers = db.select().from(users).orderBy(desc(users.createdAt)).limit(6).all();
  const recentCards = db.select().from(cards).orderBy(desc(cards.createdAt)).limit(6).all();
  const recentOrders = db.select().from(cardOrders).orderBy(desc(cardOrders.createdAt)).limit(6).all();

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

// =============================================================================
// CUSTOM DOMAINS
// =============================================================================

export async function getProfileByCustomDomain(domain: string) {
  const normalized = domain.toLowerCase().trim();
  const record = db
    .select()
    .from(customDomains)
    .where(and(eq(customDomains.domain, normalized), eq(customDomains.verificationStatus, "verified")))
    .get();

  if (!record) return null;
  return db.select().from(profiles).where(eq(profiles.id, record.profileId)).get();
}

export async function createCustomDomain(userId: string, profileId: string, domain: string) {
  const normalized = domain.toLowerCase().trim().replace(/^(https?:\/\/)/, "").replace(/\/.*$/, "");
  const now = new Date();
  const token = `nxc_verify_${Math.random().toString(36).substring(2, 12)}`;

  return db
    .insert(customDomains)
    .values({
      id: `dom_${Math.random().toString(36).substring(2, 10)}`,
      userId,
      profileId,
      domain: normalized,
      verificationStatus: "pending",
      verificationToken: token,
      verifiedAt: null,
      createdAt: now,
    })
    .returning()
    .get();
}
