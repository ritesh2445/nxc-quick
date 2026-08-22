import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["customer", "admin"] }).default("customer").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
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
  customTheme: text("custom_theme").default("obsidian"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("profile_username_idx").on(table.username),
  index("profile_user_id_idx").on(table.userId),
]);

export const profileLinks = sqliteTable("profile_links", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(), // linkedin, x, instagram, github, youtube, website, custom
  label: text("label").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).default(true).notNull(),
  clickCount: integer("click_count").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("link_profile_id_idx").on(table.profileId),
]);

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  variant: text("variant", { enum: ["verse", "metal", "atelier"] }).notNull(),
  finish: text("finish").notNull(), // obsidian, titanium, mirror, champagne, midnight, carbon
  material: text("material").notNull(), // matte, brushed, mirror, premium_metal
  nfcUid: text("nfc_uid").unique(),
  qrSlug: text("qr_slug").notNull().unique(),
  customEngraving: text("custom_engraving"),
  logoKey: text("logo_key"),
  showQr: integer("show_qr", { mode: "boolean" }).default(true).notNull(),
  status: text("status", { enum: ["unassigned", "active", "inactive", "lost"] }).default("active").notNull(),
  activatedAt: integer("activated_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("card_nfc_uid_idx").on(table.nfcUid),
  index("card_qr_slug_idx").on(table.qrSlug),
  index("card_profile_id_idx").on(table.profileId),
]);

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  tier: text("tier", { enum: ["verse", "metal", "atelier"] }).notNull(),
  status: text("status", { enum: ["active", "expired", "pending", "cancelled"] }).default("active").notNull(),
  currency: text("currency").default("INR").notNull(),
  amount: integer("amount").notNull(),
  billingCycle: text("billing_cycle").default("1_year").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  autoRenew: integer("auto_renew", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("sub_status_idx").on(table.status),
  index("sub_end_date_idx").on(table.endDate),
  index("sub_user_id_idx").on(table.userId),
]);

export const cardDesigns = sqliteTable("card_designs", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tier: text("tier", { enum: ["verse", "metal", "atelier"] }).notNull(),
  finish: text("finish").notNull(),
  material: text("material").notNull(),
  description: text("description").notNull(),
  priceInr: integer("price_inr").notNull(),
  priceUsd: integer("price_usd").notNull(),
  previewImage: text("preview_image").notNull(),
  accentHex: text("accent_hex").default("#C8C6C0").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id),
  cardId: text("card_id"),
  tier: text("tier").notNull(),
  finish: text("finish").notNull(),
  material: text("material").notNull(),
  engravingName: text("engraving_name").notNull(),
  engravingTitle: text("engraving_title"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status", { enum: ["pending", "paid", "engraving", "shipped", "delivered"] }).default("pending").notNull(),
  paymentGateway: text("payment_gateway", { enum: ["razorpay", "stripe"] }).notNull(),
  paymentId: text("payment_id"),
  shippingAddress: text("shipping_address"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("order_user_id_idx").on(table.userId),
  index("order_number_idx").on(table.orderNumber),
]);

export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // view, contact_save, qr_scan, nfc_tap, phone_click, email_click, website_click, link_click
  linkId: text("link_id"),
  referrer: text("referrer"),
  device: text("device"),
  browser: text("browser"),
  country: text("country"),
  city: text("city"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("analytics_profile_time_idx").on(table.profileId, table.createdAt),
  index("analytics_event_type_idx").on(table.eventType),
]);
