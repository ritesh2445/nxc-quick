import * as schema from "./schema";
import { ensureTablesAndSeed } from "./autoSeed";

// Types for D1 Database binding in Cloudflare Workers
export type D1DatabaseBinding = {
  prepare: (query: string) => any;
  dump: () => Promise<ArrayBuffer>;
  batch: (statements: any[]) => Promise<any[]>;
  exec: (query: string) => Promise<any>;
};

// Global cache to avoid multiple instances during dev hot-reloads
const globalForDb = globalThis as unknown as {
  dbInstance: any;
  sqliteInstance: any;
};

/**
 * A safe no-op stub returned when no real DB driver is available
 * (e.g. better-sqlite3 native binary missing on Vercel serverless).
 * Every method returns an object that mimics Drizzle's chainable query API
 * and ultimately produces an empty result, letting all query functions fall
 * through to their hard-coded demo-data fallbacks.
 */
function createNullDb(): any {
  const stub: any = new Proxy(
    {},
    {
      get(_target, prop) {
        // Terminal methods that queries call at the end of the chain
        if (prop === "get") return () => null;
        if (prop === "all") return () => [];
        if (prop === "run") return () => ({ rowsAffected: 0 });
        if (prop === "execute") return () => ({ rowsAffected: 0 });
        // Everything else — return a proxy that keeps the chain going
        return () => stub;
      },
    }
  );
  return stub;
}

function initDb(): any {
  // 1. Cloudflare D1 binding
  const cloudflareD1 =
    (globalThis as any).DB ||
    (globalThis as any).process?.env?.DB ||
    (globalThis as any).__env__?.DB;

  if (cloudflareD1) {
    try {
      const { drizzle } = require("drizzle-orm/d1");
      return drizzle(cloudflareD1, { schema });
    } catch (err) {
      console.warn("[D1] Cloudflare D1 driver load error, falling back to local driver:", err);
    }
  }

  // 2. Local / serverless SQLite via better-sqlite3
  try {
    const Database = require("better-sqlite3");
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    const path = require("path");
    const fs = require("fs");

    let dbPath = path.resolve(process.cwd(), "nxcverse.db");

    // On Vercel / AWS Lambda serverless environments, use writable /tmp path
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless) {
      const tmpPath = path.join("/tmp", "nxcverse.db");
      try {
        if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
          fs.copyFileSync(dbPath, tmpPath);
        }
        if (fs.existsSync(tmpPath)) {
          dbPath = tmpPath;
        }
      } catch (e) {
        console.warn("[DB] Could not copy to /tmp, using root path:", e);
      }
    }

    const sqlite = globalForDb.sqliteInstance ?? new Database(dbPath, { timeout: 10000 });

    try {
      sqlite.pragma("busy_timeout = 10000");
      sqlite.pragma("journal_mode = WAL");
      sqlite.pragma("foreign_keys = ON");
    } catch {}

    // Ensure initial tables and demo seeds exist in local environment
    try {
      ensureTablesAndSeed(sqlite);
    } catch (seedErr) {
      console.warn("[DB] ensureTablesAndSeed notice:", seedErr);
    }

    globalForDb.sqliteInstance = sqlite;
    return drizzle(sqlite, { schema });
  } catch (err) {
    // better-sqlite3 is unavailable (Vercel serverless, Edge, etc.)
    // Return a safe no-op stub so all query functions fall through to their
    // hard-coded demo-data fallbacks instead of crashing the entire page.
    console.warn("[DB] SQLite driver unavailable — using null stub (demo data will be served):", err);
    return createNullDb();
  }
}

export const db: any = globalForDb.dbInstance ?? initDb();
globalForDb.dbInstance = db;

export * from "./schema";
