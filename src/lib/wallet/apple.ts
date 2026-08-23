export interface ApplePassData {
  username: string;
  fullName: string;
  designation: string;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

/**
 * Builds Apple Wallet Pass JSON structure compliant with Apple Wallet PassKit specification
 */
export function buildApplePassJson(data: ApplePassData) {
  const serialNumber = `nxc_${data.username}_${Date.now()}`;
  const profileUrl = `https://nxcverse.in/@${data.username}`;

  return {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_IDENTIFIER || "pass.in.nxcverse.identity",
    teamIdentifier: process.env.APPLE_TEAM_ID || "NXCVERSE_CORP",
    serialNumber,
    organizationName: "NXC Verse",
    description: `${data.fullName} — NXC Verse Digital Identity`,
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(5, 5, 8)",
    labelColor: "rgb(0, 162, 255)",
    logoText: "NXC VERSE",
    generic: {
      primaryFields: [
        {
          key: "name",
          label: "SOVEREIGN IDENTITY",
          value: data.fullName.toUpperCase(),
        },
      ],
      secondaryFields: [
        {
          key: "title",
          label: "DESIGNATION",
          value: data.designation.toUpperCase(),
        },
        {
          key: "company",
          label: "ORGANIZATION",
          value: (data.company || "NXC VERSE").toUpperCase(),
        },
      ],
      auxiliaryFields: [
        {
          key: "phone",
          label: "CONTACT NUMBER",
          value: data.phone || "SOVEREIGN",
        },
        {
          key: "status",
          label: "AUTHENTICITY",
          value: "VERIFIED CIP-21",
        },
      ],
      backFields: [
        {
          key: "profile_url",
          label: "PERMANENT PROFILE LINK",
          value: profileUrl,
        },
        {
          key: "email",
          label: "OFFICIAL EMAIL",
          value: data.email || "concierge@nxcverse.in",
        },
        {
          key: "disclaimer",
          label: "SOVEREIGN IDENTITY NOTICE",
          value: "This official digital identity pass is cryptographically bound to NXC Verse sovereign aerospace cards and Cloudflare edge network.",
        },
      ],
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: profileUrl,
        messageEncoding: "iso-8859-1",
        altText: `@${data.username}`,
      },
    ],
  };
}
