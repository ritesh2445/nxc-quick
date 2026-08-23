export interface GooglePassData {
  username: string;
  fullName: string;
  designation: string;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
}

/**
 * Builds Google Wallet Generic Pass Object structure compliant with Google Pay Passes API
 */
export function buildGooglePassObject(data: GooglePassData) {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || "3388000000022319491";
  const classId = `${issuerId}.nxc_verse_identity_class`;
  const objectId = `${issuerId}.${data.username}_${Date.now()}`;
  const profileUrl = `https://nxcverse.in/@${data.username}`;

  return {
    id: objectId,
    classId: classId,
    genericType: "GENERIC_CARD",
    hexBackgroundColor: "#050508",
    logo: {
      sourceUri: {
        uri: "https://nxcverse.in/brand/phoenix-logo.png",
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: "NXC Verse Official Emblem",
        },
      },
    },
    cardTitle: {
      defaultValue: {
        language: "en-US",
        value: "NXC VERSE",
      },
    },
    header: {
      defaultValue: {
        language: "en-US",
        value: data.fullName.toUpperCase(),
      },
    },
    subheader: {
      defaultValue: {
        language: "en-US",
        value: data.designation.toUpperCase(),
      },
    },
    barcode: {
      type: "QR_CODE",
      value: profileUrl,
      alternateText: `@${data.username}`,
    },
    textModulesData: [
      {
        id: "organization",
        header: "ORGANIZATION",
        body: data.company || "NXC VERSE",
      },
      {
        id: "contact",
        header: "PHONE",
        body: data.phone || "SOVEREIGN",
      },
    ],
    linksModuleData: {
      uris: [
        {
          uri: profileUrl,
          description: "View Sovereign Digital Profile",
        },
      ],
    },
  };
}
