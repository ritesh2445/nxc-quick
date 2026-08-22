import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { ensureTablesAndSeed } from "./autoSeed";
import path from "path";
import fs from "fs";

function getDatabasePath(): string {
  // On Vercel / serverless runtimes, /tmp is the only writable directory
  if (process.env.VERCEL) {
    const tmpDbPath = path.join("/tmp", "nxcverse.db");
    const sourceDbPath = path.join(process.cwd(), "nxcverse.db");

    if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
      try {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      } catch (e) {
        console.warn("[DB] Could not copy source DB to /tmp, will initialize fresh:", e);
      }
    }
    return tmpDbPath;
  }

  return path.resolve(process.cwd(), "nxcverse.db");
}

const dbPath = getDatabasePath();

const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

function initSqlite(): Database.Database {
  const instance = new Database(dbPath);
  try {
    instance.pragma("journal_mode = WAL");
    instance.pragma("foreign_keys = ON");
  } catch {
    // WAL fallback
  }

  // Ensure tables and default demo records exist
  ensureTablesAndSeed(instance);

  return instance;
}

const sqlite = globalForDb.sqlite ?? initSqlite();
if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
export * from "./schema";
