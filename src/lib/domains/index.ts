import { db } from "@/lib/db";
import { customDomains, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export interface CustomDomainRecord {
  id: string;
  userId: string;
  profileId: string;
  domain: string;
  verificationStatus: "pending" | "verified" | "failed";
  verificationToken: string;
  verifiedAt: Date | null;
  createdAt: Date;
}

/**
 * Resolves a hostname (e.g. ceo.apexcapital.com) to the corresponding sovereign profile
 */
export async function resolveProfileByDomain(hostname: string) {
  const cleanDomain = hostname.toLowerCase().trim().replace(/:\d+$/, "");

  // Ignore standard platform domains
  if (
    cleanDomain === "nxcverse.in" ||
    cleanDomain === "www.nxcverse.in" ||
    cleanDomain === "localhost" ||
    cleanDomain.endsWith(".pages.dev") ||
    cleanDomain.endsWith(".workers.dev")
  ) {
    return null;
  }

  const domainRecord = db
    .select()
    .from(customDomains)
    .where(and(eq(customDomains.domain, cleanDomain), eq(customDomains.verificationStatus, "verified")))
    .get();

  if (!domainRecord) return null;

  return db.select().from(profiles).where(eq(profiles.id, domainRecord.profileId)).get();
}

/**
 * Verifies DNS TXT or CNAME record for custom domain
 */
export async function verifyDomainDns(domain: string, expectedToken: string): Promise<boolean> {
  const cleanDomain = domain.toLowerCase().trim().replace(/^(https?:\/\/)/, "").replace(/\/.*$/, "");

  try {
    const dns = await import("dns/promises");

    // 1. Check TXT record for verification token
    try {
      const txtRecords = await dns.resolveTxt(cleanDomain);
      const flattened = txtRecords.flat();
      for (const record of flattened) {
        if (record.includes(expectedToken) || record.includes(`nxc-verification=${expectedToken}`)) {
          return true;
        }
      }
    } catch {}

    // 2. Check CNAME record pointing to domains.nxcverse.in
    try {
      const cnameRecords = await dns.resolveCname(cleanDomain);
      for (const cname of cnameRecords) {
        if (cname.includes("nxcverse.in") || cname.includes("domains.nxcverse.in")) {
          return true;
        }
      }
    } catch {}

    return false;
  } catch (err) {
    console.error(`[DNS Verification] Failed for ${cleanDomain}:`, err);
    return false;
  }
}
