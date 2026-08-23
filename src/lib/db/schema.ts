import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// =============================================================================
// 1. USERS TABLE
// =============================================================================
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(), // e.g. usr_xyz
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["customer", "admin"] }).default("customer").notNull(),
    status: text("status", { enum: ["active", "suspended"] }).default("active").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

// =============================================================================
// 2. PROFILES TABLE (Independent Sovereign Digital Identity)
// =============================================================================
export const profiles = sqliteTable(
  "profiles",
  {
    id: text("id").primaryKey(), // e.g. prof_xyz
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(),
    fullName: text("full_name").notNull(),
    designation: text("designation").notNull(),
    company: text("company"),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    logoUrl: text("logo_url"),
    phone: text("phone"),
    email: text("email"),
    website: text("website"),
    location: text("location"),
    isVerified: integer("is_verified", { mode: "boolean" }).default(false).notNull(),
    isPublic: integer("is_public", { mode: "boolean" }).default(true).notNull(),
    customTheme: text("custom_theme").default("obsidian").notNull(),
    vipDirectMode: integer("vip_direct_mode", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("profiles_username_idx").on(table.username),
    index("profiles_user_id_idx").on(table.userId),
  ]
);

// =============================================================================
// 3. PROFILE LINKS TABLE
// =============================================================================
export const profileLinks = sqliteTable(
  "profile_links",
  {
    id: text("id").primaryKey(), // e.g. lnk_xyz
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(), // linkedin, x, instagram, whatsapp, github, youtube, website, custom
    label: text("label").notNull(),
    url: text("url").notNull(),
    icon: text("icon"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isVisible: integer("is_visible", { mode: "boolean" }).default(true).notNull(),
    clickCount: integer("click_count").default(0).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("profile_links_profile_id_idx").on(table.profileId),
  ]
);

// =============================================================================
// 4. CARDS TABLE (Optional Physical Hardware, 0, 1 or N per Profile/User)
// =============================================================================
export const cards = sqliteTable(
  "cards",
  {
    id: text("id").primaryKey(), // e.g. crd_xyz
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    variant: text("variant", { enum: ["classic", "metal", "atelier"] }).notNull(),
    finish: text("finish").notNull(), // silver, gold, royal_red, pitch_black, cobalt_blue
    material: text("material").notNull(), // matte, brushed, mirror, premium_metal
    nfcUid: text("nfc_uid").unique(), // Laser/NFC paired UID
    qrSlug: text("qr_slug").notNull().unique(), // Routing slug for permanent QR
    customEngraving: text("custom_engraving"),
    logoKey: text("logo_key"),
    status: text("status", { enum: ["unassigned", "active", "inactive", "lost"] }).default("active").notNull(),
    isActivated: integer("is_activated", { mode: "boolean" }).default(true).notNull(),
    activatedAt: integer("activated_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("cards_nfc_uid_idx").on(table.nfcUid),
    index("cards_qr_slug_idx").on(table.qrSlug),
    index("cards_user_id_idx").on(table.userId),
    index("cards_profile_id_idx").on(table.profileId),
  ]
);

// =============================================================================
// 5. CARD ORDERS TABLE
// =============================================================================
export const cardOrders = sqliteTable(
  "card_orders",
  {
    id: text("id").primaryKey(), // e.g. ord_xyz
    orderNumber: text("order_number").notNull().unique(),
    userId: text("user_id").notNull().references(() => users.id),
    cardId: text("card_id").references(() => cards.id),
    tier: text("tier").notNull(),
    finish: text("finish").notNull(),
    material: text("material").notNull(),
    engravingName: text("engraving_name").notNull(),
    engravingTitle: text("engraving_title"),
    amount: integer("amount").notNull(),
    currency: text("currency", { enum: ["INR", "USD"] }).notNull(),
    paymentGateway: text("payment_gateway", { enum: ["razorpay", "stripe"] }).notNull(),
    paymentId: text("payment_id"),
    paymentStatus: text("payment_status", { enum: ["pending", "paid", "failed"] }).default("pending").notNull(),
    orderStatus: text("order_status", { enum: ["pending", "engraving", "shipped", "delivered"] }).default("pending").notNull(),
    shippingAddress: text("shipping_address"), // JSON string
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("card_orders_user_id_idx").on(table.userId),
    index("card_orders_order_number_idx").on(table.orderNumber),
    index("card_orders_payment_status_idx").on(table.paymentStatus),
  ]
);

// =============================================================================
// 6. PAYMENTS TABLE
// =============================================================================
export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(), // e.g. pay_xyz
    orderId: text("order_id").notNull().references(() => cardOrders.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id),
    gateway: text("gateway", { enum: ["razorpay", "stripe"] }).notNull(),
    gatewayPaymentId: text("gateway_payment_id"),
    gatewayOrderId: text("gateway_order_id"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    status: text("status", { enum: ["initiated", "success", "failed"] }).default("initiated").notNull(),
    rawResponse: text("raw_response"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("payments_order_id_idx").on(table.orderId),
    index("payments_gateway_payment_id_idx").on(table.gatewayPaymentId),
  ]
);

// =============================================================================
// 7. SUBSCRIPTIONS TABLE (Digital Sovereign & Hardware Memberships)
// =============================================================================
export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(), // e.g. sub_xyz
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    tier: text("tier", { enum: ["digital_free", "metal", "atelier"] }).default("digital_free").notNull(),
    status: text("status", { enum: ["active", "expired", "cancelled"] }).default("active").notNull(),
    currency: text("currency").default("INR").notNull(),
    amount: integer("amount").default(0).notNull(),
    billingCycle: text("billing_cycle").default("lifetime").notNull(),
    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    endDate: integer("end_date", { mode: "timestamp" }),
    autoRenew: integer("auto_renew", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_status_idx").on(table.status),
  ]
);

// =============================================================================
// 8. CONTACTS / LEADS TABLE
// =============================================================================
export const contacts = sqliteTable(
  "contacts",
  {
    id: text("id").primaryKey(), // e.g. cnt_xyz
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    designation: text("designation"),
    message: text("message"),
    source: text("source", { enum: ["profile_exchange", "manual", "nfc_tap"] }).default("profile_exchange").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("contacts_profile_id_idx").on(table.profileId),
    index("contacts_user_id_idx").on(table.userId),
    index("contacts_created_at_idx").on(table.createdAt),
  ]
);

// =============================================================================
// 9. ANALYTICS EVENTS TABLE
// =============================================================================
export const analyticsEvents = sqliteTable(
  "analytics_events",
  {
    id: text("id").primaryKey(), // e.g. evt_xyz
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(), // view, vcf_download, qr_scan, nfc_tap, link_click, contact_exchange
    linkId: text("link_id"),
    referrer: text("referrer"),
    device: text("device"),
    browser: text("browser"),
    country: text("country"),
    city: text("city"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("analytics_profile_id_idx").on(table.profileId),
    index("analytics_event_type_idx").on(table.eventType),
    index("analytics_created_at_idx").on(table.createdAt),
  ]
);

// =============================================================================
// 10. CUSTOM DOMAINS TABLE (e.g. ceo.company.com)
// =============================================================================
export const customDomains = sqliteTable(
  "custom_domains",
  {
    id: text("id").primaryKey(), // e.g. dom_xyz
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    domain: text("domain").notNull().unique(), // e.g. ceo.apexcapital.com
    verificationStatus: text("verification_status", { enum: ["pending", "verified", "failed"] }).default("pending").notNull(),
    verificationToken: text("verification_token").notNull(),
    verifiedAt: integer("verified_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("custom_domains_domain_idx").on(table.domain),
    index("custom_domains_user_id_idx").on(table.userId),
  ]
);

// =============================================================================
// 11. WALLET PASSES TABLE (Apple Wallet & Google Wallet Integration)
// =============================================================================
export const walletPasses = sqliteTable(
  "wallet_passes",
  {
    id: text("id").primaryKey(), // e.g. wlt_xyz
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    passType: text("pass_type", { enum: ["apple", "google"] }).notNull(),
    passSerialNumber: text("pass_serial_number").notNull().unique(),
    authCode: text("auth_code"),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("wallet_passes_serial_idx").on(table.passSerialNumber),
    index("wallet_passes_profile_id_idx").on(table.profileId),
  ]
);

// =============================================================================
// 12. USER SETTINGS TABLE
// =============================================================================
export const userSettings = sqliteTable(
  "user_settings",
  {
    id: text("id").primaryKey(), // e.g. set_xyz
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
    notifyOnLead: integer("notify_on_lead", { mode: "boolean" }).default(true).notNull(),
    notifyOnVcf: integer("notify_on_vcf", { mode: "boolean" }).default(true).notNull(),
    weeklyDigest: integer("weekly_digest", { mode: "boolean" }).default(true).notNull(),
    marketingEmails: integer("marketing_emails", { mode: "boolean" }).default(false).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("user_settings_user_id_idx").on(table.userId),
  ]
);
