import type Database from "better-sqlite3";

export function ensureTablesAndSeed(sqlite: Database.Database) {
  try {
    // 1. Create All Tables Matching D1 Schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer' NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
      CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);

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
        is_verified INTEGER DEFAULT 0 NOT NULL,
        is_public INTEGER DEFAULT 1 NOT NULL,
        custom_theme TEXT DEFAULT 'obsidian' NOT NULL,
        vip_direct_mode INTEGER DEFAULT 0 NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);
      CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles (user_id);

      CREATE TABLE IF NOT EXISTS profile_links (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        platform TEXT NOT NULL,
        label TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        is_visible INTEGER DEFAULT 1 NOT NULL,
        click_count INTEGER DEFAULT 0 NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS profile_links_profile_id_idx ON profile_links (profile_id);

      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        variant TEXT NOT NULL,
        finish TEXT NOT NULL,
        material TEXT NOT NULL,
        nfc_uid TEXT UNIQUE,
        qr_slug TEXT NOT NULL UNIQUE,
        custom_engraving TEXT,
        logo_key TEXT,
        status TEXT DEFAULT 'active' NOT NULL,
        is_activated INTEGER DEFAULT 1 NOT NULL,
        activated_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS cards_nfc_uid_idx ON cards (nfc_uid);
      CREATE INDEX IF NOT EXISTS cards_qr_slug_idx ON cards (qr_slug);
      CREATE INDEX IF NOT EXISTS cards_user_id_idx ON cards (user_id);
      CREATE INDEX IF NOT EXISTS cards_profile_id_idx ON cards (profile_id);

      CREATE TABLE IF NOT EXISTS card_orders (
        id TEXT PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL REFERENCES users(id),
        card_id TEXT REFERENCES cards(id),
        tier TEXT NOT NULL,
        finish TEXT NOT NULL,
        material TEXT NOT NULL,
        engraving_name TEXT NOT NULL,
        engraving_title TEXT,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL,
        payment_gateway TEXT NOT NULL,
        payment_id TEXT,
        payment_status TEXT DEFAULT 'pending' NOT NULL,
        order_status TEXT DEFAULT 'pending' NOT NULL,
        shipping_address TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS card_orders_user_id_idx ON card_orders (user_id);
      CREATE INDEX IF NOT EXISTS card_orders_order_number_idx ON card_orders (order_number);
      CREATE INDEX IF NOT EXISTS card_orders_payment_status_idx ON card_orders (payment_status);

      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id),
        gateway TEXT NOT NULL,
        gateway_payment_id TEXT,
        gateway_order_id TEXT,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL,
        status TEXT DEFAULT 'initiated' NOT NULL,
        raw_response TEXT,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments (order_id);
      CREATE INDEX IF NOT EXISTS payments_gateway_payment_id_idx ON payments (gateway_payment_id);

      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        tier TEXT DEFAULT 'digital_free' NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        currency TEXT DEFAULT 'INR' NOT NULL,
        amount INTEGER DEFAULT 0 NOT NULL,
        billing_cycle TEXT DEFAULT 'lifetime' NOT NULL,
        start_date INTEGER NOT NULL,
        end_date INTEGER,
        auto_renew INTEGER DEFAULT 0 NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);
      CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions (status);

      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        designation TEXT,
        message TEXT,
        source TEXT DEFAULT 'profile_exchange' NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS contacts_profile_id_idx ON contacts (profile_id);
      CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts (user_id);
      CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at);

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
      CREATE INDEX IF NOT EXISTS analytics_profile_id_idx ON analytics_events (profile_id);
      CREATE INDEX IF NOT EXISTS analytics_event_type_idx ON analytics_events (event_type);
      CREATE INDEX IF NOT EXISTS analytics_created_at_idx ON analytics_events (created_at);

      CREATE TABLE IF NOT EXISTS custom_domains (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        domain TEXT NOT NULL UNIQUE,
        verification_status TEXT DEFAULT 'pending' NOT NULL,
        verification_token TEXT NOT NULL,
        verified_at INTEGER,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS custom_domains_domain_idx ON custom_domains (domain);
      CREATE INDEX IF NOT EXISTS custom_domains_user_id_idx ON custom_domains (user_id);

      CREATE TABLE IF NOT EXISTS wallet_passes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        pass_type TEXT NOT NULL,
        pass_serial_number TEXT NOT NULL UNIQUE,
        auth_code TEXT,
        updated_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS wallet_passes_serial_idx ON wallet_passes (pass_serial_number);
      CREATE INDEX IF NOT EXISTS wallet_passes_profile_id_idx ON wallet_passes (profile_id);

      CREATE TABLE IF NOT EXISTS user_settings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        notify_on_lead INTEGER DEFAULT 1 NOT NULL,
        notify_on_vcf INTEGER DEFAULT 1 NOT NULL,
        weekly_digest INTEGER DEFAULT 1 NOT NULL,
        marketing_emails INTEGER DEFAULT 0 NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings (user_id);
    `);

    // 2. Check if primary demo user exists
    const checkUser = sqlite
      .prepare("SELECT id FROM users WHERE id = 'usr_ritesh'")
      .get();

    if (!checkUser) {
      console.log("[DB] Seeding primary developer/demo records...");
      const now = Date.now();

      // Demo User
      sqlite.prepare(`
        INSERT INTO users (id, email, password_hash, role, status, created_at, updated_at)
        VALUES ('usr_ritesh', 'ritesh@nxcverse.in', 'ritesh123', 'admin', 'active', ?, ?)
      `).run(now, now);

      // Demo Profile
      sqlite.prepare(`
        INSERT INTO profiles (id, user_id, username, full_name, designation, company, bio, avatar_url, phone, email, website, location, is_verified, is_public, custom_theme, vip_direct_mode, created_at, updated_at)
        VALUES ('prof_ritesh', 'usr_ritesh', 'ritesh', 'Ritesh Martawar', 'Founder & Chief Executive', 'NXC Verse', 'Designing tactile luxury hardware and sovereign digital identities.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', '+91 95612 48677', 'nxcbadge@gmail.com', 'https://nxcverse.in', 'Mumbai, India', 1, 1, 'obsidian', 0, ?, ?)
      `).run(now, now);

      // Demo Links
      sqlite.prepare(`
        INSERT INTO profile_links (id, profile_id, platform, label, url, sort_order, is_visible, click_count, created_at)
        VALUES 
          ('lnk_1', 'prof_ritesh', 'linkedin', 'LinkedIn Profile', 'https://linkedin.com/in/ritesh-martawar', 0, 1, 14, ?),
          ('lnk_2', 'prof_ritesh', 'x', 'X / Twitter', 'https://x.com/nxcverse', 1, 1, 9, ?),
          ('lnk_3', 'prof_ritesh', 'instagram', 'Instagram', 'https://instagram.com/nxcverse.in', 2, 1, 19, ?),
          ('lnk_4', 'prof_ritesh', 'website', 'NXC Verse Official', 'https://nxcverse.in', 3, 1, 32, ?)
      `).run(now, now, now, now);

      // Demo Card
      sqlite.prepare(`
        INSERT INTO cards (id, user_id, profile_id, variant, finish, material, nfc_uid, qr_slug, custom_engraving, status, is_activated, activated_at, created_at, updated_at)
        VALUES ('crd_1', 'usr_ritesh', 'prof_ritesh', 'metal', 'pitch_black', 'mirror', '04:A2:8F:E1:99:3B:80', 'ritesh', 'EDITION NO. 001/100', 'active', 1, ?, ?, ?)
      `).run(now, now, now);

      // Demo Order
      sqlite.prepare(`
        INSERT INTO card_orders (id, order_number, user_id, card_id, tier, finish, material, engraving_name, engraving_title, amount, currency, payment_gateway, payment_id, payment_status, order_status, shipping_address, created_at, updated_at)
        VALUES ('ord_1', 'NXC-ORD-882190', 'usr_ritesh', 'crd_1', 'metal', 'pitch_black', 'mirror', 'RITESH MARTAWAR', 'FOUNDER & CEO', 1599, 'INR', 'razorpay', 'pay_mock_123', 'paid', 'delivered', 'Worli Sea Face, Mumbai 400018', ?, ?)
      `).run(now, now);

      // Demo Subscription
      sqlite.prepare(`
        INSERT INTO subscriptions (id, user_id, profile_id, tier, status, currency, amount, billing_cycle, start_date, end_date, auto_renew, created_at)
        VALUES ('sub_1', 'usr_ritesh', 'prof_ritesh', 'metal', 'active', 'INR', 1599, 'lifetime', ?, NULL, 0, ?)
      `).run(now, now);

      // Demo Settings
      sqlite.prepare(`
        INSERT INTO user_settings (id, user_id, notify_on_lead, notify_on_vcf, weekly_digest, marketing_emails, updated_at)
        VALUES ('set_1', 'usr_ritesh', 1, 1, 1, 0, ?)
      `).run(now);

      // Demo Contacts
      sqlite.prepare(`
        INSERT INTO contacts (id, profile_id, user_id, full_name, email, phone, company, designation, message, source, created_at)
        VALUES 
          ('cnt_1', 'prof_ritesh', 'usr_ritesh', 'Aarav Sharma', 'aarav.sharma@apextech.io', '+91 98201 44521', 'ApexTech Ventures', 'Managing Partner', 'Met at Venture Capital Summit Mumbai. Interested in bulk enterprise cards.', 'profile_exchange', ?),
          ('cnt_2', 'prof_ritesh', 'usr_ritesh', 'Priya Nair', 'priya.nair@quantumlux.com', '+91 98450 77123', 'Quantum Luxury Group', 'Head of Brand Strategy', 'Wants 20 custom serialized Atelier cards for leadership team.', 'profile_exchange', ?),
          ('cnt_3', 'prof_ritesh', 'usr_ritesh', 'David Sterling', 'd.sterling@monolith.co', '+1 415 890 2234', 'Monolith Capital London', 'Chief Technology Officer', 'Exchanged contact via contactless NFC tap in Bangalore.', 'nfc_tap', ?)
      `).run(now - 3600000 * 2, now - 3600000 * 18, now - 3600000 * 48);
    }
  } catch (err) {
    console.error("[DB] Error in ensureTablesAndSeed:", err);
  }
}
