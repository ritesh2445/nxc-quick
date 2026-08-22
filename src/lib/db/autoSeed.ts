import type Database from "better-sqlite3";

export function ensureTablesAndSeed(sqlite: Database.Database) {
  try {
    // Check if profiles table exists
    const checkTable = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='profiles'")
      .get();

    if (checkTable) return;

    console.log("[DB] Initializing SQLite tables on fresh environment...");

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
        currency TEXT NOT NULL DEFAULT 'INR',
        status TEXT NOT NULL DEFAULT 'pending',
        payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
        payment_id TEXT,
        shipping_address TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS analytics_events (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL,
        link_id TEXT,
        visitor_ip TEXT,
        user_agent TEXT,
        referrer TEXT,
        device_type TEXT,
        country TEXT,
        created_at INTEGER NOT NULL
      );
    `);

    const now = Date.now();

    // Insert Default Ritesh Profile
    sqlite.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run("usr_ritesh", "ritesh@nxcverse.in", "ritesh123", "customer", now, now);

    sqlite.prepare(`
      INSERT OR IGNORE INTO profiles (id, user_id, username, full_name, designation, company, bio, avatar_url, logo_url, phone, email, website, location, is_verified, is_public, custom_theme, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "prof_ritesh",
      "usr_ritesh",
      "ritesh",
      "Ritesh Martawar",
      "Founder & Chief Executive",
      "NXC Verse",
      "Building digital identity through technology, industrial design, and hyper-tactile metal hardware.",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      null,
      "+91 95612 48677",
      "nxcbadge@gmail.com",
      "https://nxcverse.in",
      "Mumbai, India",
      1,
      1,
      "obsidian",
      now,
      now
    );

    sqlite.prepare(`
      INSERT OR IGNORE INTO cards (id, profile_id, user_id, variant, finish, material, nfc_uid, qr_slug, custom_engraving, logo_key, show_qr, status, activated_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "crd_ritesh_01",
      "prof_ritesh",
      "usr_ritesh",
      "metal",
      "pitch_black",
      "mirror",
      "04:A2:8F:E1:99:3B:80",
      "ritesh",
      "EDITION NO. 001/100",
      "phoenix",
      1,
      "active",
      now,
      now
    );

    // Insert Default Social Links
    const insertLink = sqlite.prepare(`
      INSERT OR IGNORE INTO profile_links (id, profile_id, platform, label, url, icon, sort_order, is_visible, click_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLink.run("lnk_1", "prof_ritesh", "instagram", "Instagram @nxcverse.in", "https://instagram.com/nxcverse.in", "instagram", 0, 1, 12, now);
    insertLink.run("lnk_2", "prof_ritesh", "whatsapp", "WhatsApp Direct (+91 9561248677)", "https://wa.me/919561248677", "whatsapp", 1, 1, 48, now);
    insertLink.run("lnk_3", "prof_ritesh", "linkedin", "LinkedIn Profile", "https://linkedin.com/in/ritesh-martawar", "linkedin", 2, 1, 35, now);
    insertLink.run("lnk_4", "prof_ritesh", "website", "NXC Verse Official", "https://nxcverse.in", "globe", 3, 1, 80, now);

    console.log("[DB] Fresh environment seeded successfully.");
  } catch (err) {
    console.error("[DB] Auto-seed error:", err);
  }
}
