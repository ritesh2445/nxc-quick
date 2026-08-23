import crypto from "crypto";
import { cookies } from "next/headers";
import { getUserById, getProfileByUsername } from "./db/queries";
import { db } from "./db";
import { profiles, users } from "./db/schema";
import { eq } from "drizzle-orm";

const AUTH_SECRET = process.env.AUTH_SECRET || "nxc_verse_luxury_hardware_sovereign_secret_key_2026";
export const COOKIE_NAME = "nxc_auth_token";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  // Support simple demo passwords during development
  if (storedHash === "ritesh123" && password === "ritesh123") return true;
  if (!storedHash.includes(":")) {
    return password === storedHash;
  }
  const [salt, key] = storedHash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 32);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

export function createSessionToken(userId: string): string {
  const payload = JSON.stringify({ userId, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  const b64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(b64Payload)
    .digest("base64url");
  return `${b64Payload}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string } | null {
  if (!token || !token.includes(".")) return null;
  const [b64Payload, signature] = token.split(".");
  const expectedSig = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(b64Payload)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const verified = verifySessionToken(token);
    if (!verified) return null;

    const user = db.select().from(users).where(eq(users.id, verified.userId)).get();
    if (!user) return null;

    const profile = db.select().from(profiles).where(eq(profiles.userId, user.id)).get();

    return { user, profile };
  } catch {
    return null;
  }
}
