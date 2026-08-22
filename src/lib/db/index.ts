import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Ensure DB directory exists
const dbPath = path.resolve(process.cwd(), "nxcverse.db");

// Singleton pattern for SQLite in Next.js development
const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

const sqlite = globalForDb.sqlite ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

// Enable WAL mode for better concurrency performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
export * from "./schema";
