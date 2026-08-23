-- =============================================================================
-- NXC VERSE — CLOUDFLARE D1 INITIAL REPRODUCIBLE DATABASE MIGRATION
-- Database: nxc-verse-db
-- Dialect: SQLite / Cloudflare D1
-- =============================================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL UNIQUE,
  `password_hash` text NOT NULL,
  `role` text DEFAULT 'customer' NOT NULL,
  `status` text DEFAULT 'active' NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `users_email_idx` ON `users` (`email`);
CREATE INDEX IF NOT EXISTS `users_role_idx` ON `users` (`role`);

CREATE TABLE IF NOT EXISTS `profiles` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `username` text NOT NULL UNIQUE,
  `full_name` text NOT NULL,
  `designation` text NOT NULL,
  `company` text,
  `bio` text,
  `avatar_url` text,
  `logo_url` text,
  `phone` text,
  `email` text,
  `website` text,
  `location` text,
  `is_verified` integer DEFAULT 0 NOT NULL,
  `is_public` integer DEFAULT 1 NOT NULL,
  `custom_theme` text DEFAULT 'obsidian' NOT NULL,
  `vip_direct_mode` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `profiles_username_idx` ON `profiles` (`username`);
CREATE INDEX IF NOT EXISTS `profiles_user_id_idx` ON `profiles` (`user_id`);

CREATE TABLE IF NOT EXISTS `profile_links` (
  `id` text PRIMARY KEY NOT NULL,
  `profile_id` text NOT NULL REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  `platform` text NOT NULL,
  `label` text NOT NULL,
  `url` text NOT NULL,
  `icon` text,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `is_visible` integer DEFAULT 1 NOT NULL,
  `click_count` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `profile_links_profile_id_idx` ON `profile_links` (`profile_id`);

CREATE TABLE IF NOT EXISTS `cards` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `profile_id` text NOT NULL REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  `variant` text NOT NULL,
  `finish` text NOT NULL,
  `material` text NOT NULL,
  `nfc_uid` text UNIQUE,
  `qr_slug` text NOT NULL UNIQUE,
  `custom_engraving` text,
  `logo_key` text,
  `status` text DEFAULT 'active' NOT NULL,
  `is_activated` integer DEFAULT 1 NOT NULL,
  `activated_at` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `cards_nfc_uid_idx` ON `cards` (`nfc_uid`);
CREATE INDEX IF NOT EXISTS `cards_qr_slug_idx` ON `cards` (`qr_slug`);
CREATE INDEX IF NOT EXISTS `cards_user_id_idx` ON `cards` (`user_id`);
CREATE INDEX IF NOT EXISTS `cards_profile_id_idx` ON `cards` (`profile_id`);

CREATE TABLE IF NOT EXISTS `card_orders` (
  `id` text PRIMARY KEY NOT NULL,
  `order_number` text NOT NULL UNIQUE,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `card_id` text REFERENCES `cards`(`id`),
  `tier` text NOT NULL,
  `finish` text NOT NULL,
  `material` text NOT NULL,
  `engraving_name` text NOT NULL,
  `engraving_title` text,
  `amount` integer NOT NULL,
  `currency` text NOT NULL,
  `payment_gateway` text NOT NULL,
  `payment_id` text,
  `payment_status` text DEFAULT 'pending' NOT NULL,
  `order_status` text DEFAULT 'pending' NOT NULL,
  `shipping_address` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `card_orders_user_id_idx` ON `card_orders` (`user_id`);
CREATE INDEX IF NOT EXISTS `card_orders_order_number_idx` ON `card_orders` (`order_number`);
CREATE INDEX IF NOT EXISTS `card_orders_payment_status_idx` ON `card_orders` (`payment_status`);

CREATE TABLE IF NOT EXISTS `payments` (
  `id` text PRIMARY KEY NOT NULL,
  `order_id` text NOT NULL REFERENCES `card_orders`(`id`) ON DELETE CASCADE,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `gateway` text NOT NULL,
  `gateway_payment_id` text,
  `gateway_order_id` text,
  `amount` integer NOT NULL,
  `currency` text NOT NULL,
  `status` text DEFAULT 'initiated' NOT NULL,
  `raw_response` text,
  `created_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `payments_order_id_idx` ON `payments` (`order_id`);
CREATE INDEX IF NOT EXISTS `payments_gateway_payment_id_idx` ON `payments` (`gateway_payment_id`);

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `profile_id` text NOT NULL REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  `tier` text DEFAULT 'digital_free' NOT NULL,
  `status` text DEFAULT 'active' NOT NULL,
  `currency` text DEFAULT 'INR' NOT NULL,
  `amount` integer DEFAULT 0 NOT NULL,
  `billing_cycle` text DEFAULT 'lifetime' NOT NULL,
  `start_date` integer NOT NULL,
  `end_date` integer,
  `auto_renew` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `subscriptions_user_id_idx` ON `subscriptions` (`user_id`);
CREATE INDEX IF NOT EXISTS `subscriptions_status_idx` ON `subscriptions` (`status`);

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` text PRIMARY KEY NOT NULL,
  `profile_id` text NOT NULL REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `full_name` text NOT NULL,
  `email` text,
  `phone` text,
  `company` text,
  `designation` text,
  `message` text,
  `source` text DEFAULT 'profile_exchange' NOT NULL,
  `created_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `contacts_profile_id_idx` ON `contacts` (`profile_id`);
CREATE INDEX IF NOT EXISTS `contacts_user_id_idx` ON `contacts` (`user_id`);
CREATE INDEX IF NOT EXISTS `contacts_created_at_idx` ON `contacts` (`created_at`);

CREATE TABLE IF NOT EXISTS `analytics_events` (
  `id` text PRIMARY KEY NOT NULL,
  `profile_id` text NOT NULL REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  `event_type` text NOT NULL,
  `link_id` text,
  `referrer` text,
  `device` text,
  `browser` text,
  `country` text,
  `city` text,
  `created_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `analytics_profile_id_idx` ON `analytics_events` (`profile_id`);
CREATE INDEX IF NOT EXISTS `analytics_event_type_idx` ON `analytics_events` (`event_type`);
CREATE INDEX IF NOT EXISTS `analytics_created_at_idx` ON `analytics_events` (`created_at`);

CREATE TABLE IF NOT EXISTS `custom_domains` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `profile_id` text NOT NULL REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  `domain` text NOT NULL UNIQUE,
  `verification_status` text DEFAULT 'pending' NOT NULL,
  `verification_token` text NOT NULL,
  `verified_at` integer,
  `created_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `custom_domains_domain_idx` ON `custom_domains` (`domain`);
CREATE INDEX IF NOT EXISTS `custom_domains_user_id_idx` ON `custom_domains` (`user_id`);

CREATE TABLE IF NOT EXISTS `wallet_passes` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `profile_id` text NOT NULL REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  `pass_type` text NOT NULL,
  `pass_serial_number` text NOT NULL UNIQUE,
  `auth_code` text,
  `updated_at` integer NOT NULL,
  `created_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `wallet_passes_serial_idx` ON `wallet_passes` (`pass_serial_number`);
CREATE INDEX IF NOT EXISTS `wallet_passes_profile_id_idx` ON `wallet_passes` (`profile_id`);

CREATE TABLE IF NOT EXISTS `user_settings` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE UNIQUE,
  `notify_on_lead` integer DEFAULT 1 NOT NULL,
  `notify_on_vcf` integer DEFAULT 1 NOT NULL,
  `weekly_digest` integer DEFAULT 1 NOT NULL,
  `marketing_emails` integer DEFAULT 0 NOT NULL,
  `updated_at` integer NOT NULL
);
CREATE INDEX IF NOT EXISTS `user_settings_user_id_idx` ON `user_settings` (`user_id`);
