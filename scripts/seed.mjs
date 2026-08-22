import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "nxcverse.db");
const sqlite = new Database(dbPath);

console.log("Creating database schema and tables if not exists...");

// Initialize tables
sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  company TEXT,
  bio TEXT,
  avatar_url TEXT,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  location TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  is_public INTEGER NOT NULL DEFAULT 1,
  custom_theme TEXT DEFAULT 'obsidian',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS profile_links (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  finish TEXT NOT NULL,
  material TEXT NOT NULL,
  nfc_uid TEXT UNIQUE,
  qr_slug TEXT NOT NULL UNIQUE,
  custom_engraving TEXT,
  logo_key TEXT,
  show_qr INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  activated_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  currency TEXT NOT NULL DEFAULT 'INR',
  amount INTEGER NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT '1_year',
  start_date INTEGER NOT NULL,
  end_date INTEGER NOT NULL,
  auto_renew INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS card_designs (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  finish TEXT NOT NULL,
  material TEXT NOT NULL,
  description TEXT NOT NULL,
  price_inr INTEGER NOT NULL,
  price_usd INTEGER NOT NULL,
  preview_image TEXT NOT NULL,
  accent_hex TEXT NOT NULL DEFAULT '#C8C6C0',
  is_available INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id),
  card_id TEXT,
  tier TEXT NOT NULL,
  finish TEXT NOT NULL,
  material TEXT NOT NULL,
  engraving_name TEXT NOT NULL,
  engraving_title TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  payment_gateway TEXT NOT NULL,
  payment_id TEXT,
  shipping_address TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  link_id TEXT,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  created_at INTEGER NOT NULL
);
`);

console.log("Seeding data...");

const now = Date.now();
const oneYearLater = now + 365 * 24 * 60 * 60 * 1000;
const twoYearsLater = now + 2 * 365 * 24 * 60 * 60 * 1000;

// Seed Card Designs
const designs = [
  {
    id: "des_obsidian",
    slug: "obsidian-phoenix",
    name: "Obsidian Phoenix Classic",
    tier: "verse",
    finish: "obsidian",
    material: "matte",
    description: "Deep obsidian matte metal body engraved with the signature silver phoenix emblem.",
    price_inr: 999,
    price_usd: 12,
    preview_image: "/assets/cards/obsidian-phoenix.webp",
    accent_hex: "#F2F0EC",
    sort_order: 1,
  },
  {
    id: "des_titanium",
    slug: "brushed-titanium",
    name: "Brushed Titanium Executive",
    tier: "metal",
    finish: "titanium",
    material: "brushed",
    description: "Cold aerospace-grade brushed titanium with laser-precision edge chamfering.",
    price_inr: 1599,
    price_usd: 20,
    preview_image: "/assets/cards/titanium.webp",
    accent_hex: "#8E9AAA",
    sort_order: 2,
  },
  {
    id: "des_atelier_noir",
    slug: "atelier-noir",
    name: "Atelier Noir Bespoke",
    tier: "atelier",
    finish: "obsidian",
    material: "premium_metal",
    description: "Hand-finished dark matte PVD with customized monogram micro-engraving and gold crest.",
    price_inr: 2999,
    price_usd: 38,
    preview_image: "/assets/cards/atelier.webp",
    accent_hex: "#D4B896",
    sort_order: 3,
  },
  {
    id: "des_mirror",
    slug: "mirror-metal",
    name: "Liquid Mirror Silver",
    tier: "metal",
    finish: "mirror",
    material: "mirror",
    description: "Electroplated high-specular mirror surface with obsidian screen-printed accents.",
    price_inr: 1599,
    price_usd: 20,
    preview_image: "/assets/cards/mirror.webp",
    accent_hex: "#C8C6C0",
    sort_order: 4,
  },
  {
    id: "des_midnight",
    slug: "midnight-blue",
    name: "Midnight Cobalt Deep",
    tier: "metal",
    finish: "midnight",
    material: "brushed",
    description: "Deep oceanic cobalt metal finish with frosted silver geometric accents.",
    price_inr: 1599,
    price_usd: 20,
    preview_image: "/assets/cards/midnight.webp",
    accent_hex: "#4F6B92",
    sort_order: 5,
  },
  {
    id: "des_carbon",
    slug: "carbon-stealth",
    name: "Forged Carbon Stealth",
    tier: "atelier",
    finish: "carbon",
    material: "premium_metal",
    description: "Ultra-rigid forged composite texture with matte obsidian titanium core.",
    price_inr: 2999,
    price_usd: 38,
    preview_image: "/assets/cards/carbon.webp",
    accent_hex: "#3A3A45",
    sort_order: 6,
  },
];

const insertDesign = sqlite.prepare(`
  INSERT OR REPLACE INTO card_designs (id, slug, name, tier, finish, material, description, price_inr, price_usd, preview_image, accent_hex, is_available, sort_order, created_at)
  VALUES (@id, @slug, @name, @tier, @finish, @material, @description, @price_inr, @price_usd, @preview_image, @accent_hex, 1, @sort_order, ${now})
`);

for (const d of designs) {
  insertDesign.run(d);
}

// Seed Users
const insertUser = sqlite.prepare(`
  INSERT OR REPLACE INTO users (id, email, password_hash, role, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Passwords for demo testing:
insertUser.run("usr_ritesh", "ritesh@nxcverse.in", "ritesh123", "customer", now, now);
insertUser.run("usr_aarav", "aarav@nxcverse.in", "aarav123", "customer", now, now);
insertUser.run("usr_demo", "demo@nxcverse.in", "demo123", "customer", now, now);
insertUser.run("usr_admin", "admin@nxcverse.in", "admin123", "admin", now, now);

// Seed Profiles
const insertProfile = sqlite.prepare(`
  INSERT OR REPLACE INTO profiles (id, user_id, username, full_name, designation, company, bio, avatar_url, logo_url, phone, email, website, location, is_verified, is_public, custom_theme, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertProfile.run(
  "prof_ritesh",
  "usr_ritesh",
  "ritesh",
  "Ritesh Martawar",
  "Founder & Chief Executive",
  "NXC Verse",
  "Designing tactile luxury hardware and next-generation sovereign digital identities for modern visionaries.",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  null,
  "+91 98765 43210",
  "ritesh@nxcverse.in",
  "https://nxcverse.in",
  "Mumbai, India",
  1,
  1,
  "obsidian",
  now,
  now
);

insertProfile.run(
  "prof_aarav",
  "usr_aarav",
  "aarav",
  "Aarav Mehta",
  "Founder · NXC Verse",
  "NXC Verse",
  "Building digital identity through technology, industrial design, and hyper-tactile metal hardware.",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  null,
  "+91 98200 12345",
  "aarav@nxcverse.in",
  "https://nxcverse.in",
  "Bengaluru, India",
  1,
  1,
  "obsidian",
  now,
  now
);

insertProfile.run(
  "prof_demo",
  "usr_demo",
  "demo",
  "Julian Vance",
  "Managing Partner",
  "Vance & Co. Capital",
  "Private equity investments in aerospace, high-frequency computing, and deep-tech hardware.",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  null,
  "+1 (415) 890-2345",
  "julian@vancecapital.com",
  "https://vancecapital.com",
  "San Francisco & London",
  1,
  1,
  "titanium",
  now,
  now
);

// Seed Profile Links
const insertLink = sqlite.prepare(`
  INSERT OR REPLACE INTO profile_links (id, profile_id, platform, label, url, icon, sort_order, is_visible, click_count, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Ritesh links
insertLink.run("lnk_r1", "prof_ritesh", "linkedin", "LinkedIn", "https://linkedin.com/in/ritesh-martawar", "linkedin", 0, 1, 142, now);
insertLink.run("lnk_r2", "prof_ritesh", "x", "X / Twitter", "https://x.com/nxcverse", "x", 1, 1, 89, now);
insertLink.run("lnk_r3", "prof_ritesh", "instagram", "Instagram", "https://instagram.com/nxcverse", "instagram", 2, 1, 64, now);
insertLink.run("lnk_r4", "prof_ritesh", "website", "NXC Verse Official", "https://nxcverse.in", "globe", 3, 1, 210, now);

// Aarav links
insertLink.run("lnk_a1", "prof_aarav", "linkedin", "LinkedIn", "https://linkedin.com", "linkedin", 0, 1, 95, now);
insertLink.run("lnk_a2", "prof_aarav", "x", "X / Twitter", "https://x.com", "x", 1, 1, 58, now);
insertLink.run("lnk_a3", "prof_aarav", "instagram", "Instagram", "https://instagram.com", "instagram", 2, 1, 41, now);
insertLink.run("lnk_a4", "prof_aarav", "github", "GitHub", "https://github.com", "github", 3, 1, 30, now);

// Julian links
insertLink.run("lnk_j1", "prof_demo", "linkedin", "LinkedIn Profile", "https://linkedin.com", "linkedin", 0, 1, 320, now);
insertLink.run("lnk_j2", "prof_demo", "website", "Vance Portfolio", "https://vancecapital.com", "globe", 1, 1, 180, now);

// Seed Cards
const insertCard = sqlite.prepare(`
  INSERT OR REPLACE INTO cards (id, profile_id, user_id, variant, finish, material, nfc_uid, qr_slug, custom_engraving, logo_key, show_qr, status, activated_at, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertCard.run("crd_ritesh", "prof_ritesh", "usr_ritesh", "atelier", "obsidian", "premium_metal", "04:A2:8F:E1:99:3B:80", "ritesh", "FOUNDER & CEO", "phoenix", 1, "active", now, now);
insertCard.run("crd_aarav", "prof_aarav", "usr_aarav", "metal", "obsidian", "matte", "04:C5:12:44:0B:77:81", "aarav", "FOUNDER", "phoenix", 1, "active", now, now);
insertCard.run("crd_demo", "prof_demo", "usr_demo", "metal", "titanium", "brushed", "04:77:E9:1A:4C:90:82", "demo", "MANAGING PARTNER", null, 1, "active", now, now);

// Seed Subscriptions
const insertSub = sqlite.prepare(`
  INSERT OR REPLACE INTO subscriptions (id, user_id, profile_id, tier, status, currency, amount, billing_cycle, start_date, end_date, auto_renew, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertSub.run("sub_ritesh", "usr_ritesh", "prof_ritesh", "atelier", "active", "INR", 2999, "3_year", now, twoYearsLater, 1, now);
insertSub.run("sub_aarav", "usr_aarav", "prof_aarav", "metal", "active", "INR", 1599, "2_year", now, twoYearsLater, 1, now);
insertSub.run("sub_demo", "usr_demo", "prof_demo", "metal", "active", "USD", 20, "2_year", now, oneYearLater, 1, now);

// Seed Orders
const insertOrder = sqlite.prepare(`
  INSERT OR REPLACE INTO orders (id, order_number, user_id, card_id, tier, finish, material, engraving_name, engraving_title, amount, currency, status, payment_gateway, payment_id, shipping_address, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertOrder.run("ord_1", "NXC-260821-1001", "usr_ritesh", "crd_ritesh", "atelier", "obsidian", "premium_metal", "Ritesh Martawar", "Founder & CEO", 2999, "INR", "delivered", "razorpay", "pay_nxc_live_001", JSON.stringify({ street: "Marine Drive", city: "Mumbai", pincode: "400020", country: "India" }), now - 86400000 * 14, now);
insertOrder.run("ord_2", "NXC-260821-1002", "usr_aarav", "crd_aarav", "metal", "obsidian", "matte", "Aarav Mehta", "Founder", 1599, "INR", "delivered", "razorpay", "pay_nxc_live_002", JSON.stringify({ street: "Indiranagar", city: "Bengaluru", pincode: "560038", country: "India" }), now - 86400000 * 7, now);
insertOrder.run("ord_3", "NXC-260821-1003", "usr_demo", "crd_demo", "metal", "titanium", "brushed", "Julian Vance", "Managing Partner", 20, "USD", "shipped", "stripe", "pi_nxc_stripe_003", JSON.stringify({ street: "Market St", city: "San Francisco", pincode: "94103", country: "United States" }), now - 86400000 * 2, now);

// Seed Analytics Events
const insertEvent = sqlite.prepare(`
  INSERT OR REPLACE INTO analytics_events (id, profile_id, event_type, link_id, referrer, device, browser, country, city, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const events = [
  ["evt_1", "prof_ritesh", "view", null, "https://nxcverse.in", "iPhone 15 Pro", "Safari", "India", "Mumbai", now - 3600000 * 2],
  ["evt_2", "prof_ritesh", "nfc_tap", null, "NFC Card Tap", "iPhone 15 Pro", "Safari", "India", "Mumbai", now - 3600000 * 2],
  ["evt_3", "prof_ritesh", "contact_save", null, "Profile Action", "iPhone 15 Pro", "Safari", "India", "Mumbai", now - 3600000 * 2],
  ["evt_4", "prof_ritesh", "qr_scan", null, "Physical Card QR", "Samsung Galaxy S24", "Chrome", "India", "Delhi", now - 3600000 * 5],
  ["evt_5", "prof_ritesh", "view", null, "https://linkedin.com", "MacBook Pro", "Chrome", "United States", "New York", now - 3600000 * 8],
  ["evt_6", "prof_aarav", "view", null, "Direct NFC", "iPhone 14", "Safari", "India", "Bengaluru", now - 3600000 * 4],
  ["evt_7", "prof_aarav", "contact_save", null, "Profile Action", "iPhone 14", "Safari", "India", "Bengaluru", now - 3600000 * 4],
  ["evt_8", "prof_aarav", "qr_scan", null, "Physical Card QR", "Pixel 8", "Chrome", "United Kingdom", "London", now - 3600000 * 12],
];

for (const ev of events) {
  insertEvent.run(...ev);
}

console.log("Database successfully seeded with realistic luxury profiles, cards, and analytics.");
sqlite.close();
