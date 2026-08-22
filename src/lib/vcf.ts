export interface VCardData {
  fullName: string;
  designation?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  bio?: string | null;
  profileUrl?: string | null;
}

export function generateVCardString(data: VCardData): string {
  const nameParts = data.fullName.trim().split(" ");
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  const firstName = nameParts[0] || "";

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.fullName}`,
    `N:${lastName};${firstName};;;`,
  ];

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  if (data.designation) {
    lines.push(`TITLE:${data.designation}`);
  }

  if (data.phone) {
    // Standardize phone
    lines.push(`TEL;TYPE=CELL,VOICE:${data.phone}`);
  }

  if (data.email) {
    lines.push(`EMAIL;TYPE=WORK,INTERNET:${data.email}`);
  }

  if (data.website) {
    lines.push(`URL;TYPE=WORK:${data.website}`);
  }

  if (data.profileUrl) {
    lines.push(`URL;TYPE=NXC-VERSE-PROFILE:${data.profileUrl}`);
  }

  if (data.bio) {
    lines.push(`NOTE:${data.bio.replace(/\n/g, "\\n")}`);
  }

  lines.push("REV:" + new Date().toISOString());
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(data: VCardData, filename = "contact.vcf") {
  if (typeof window === "undefined") return;
  
  const vcfContent = generateVCardString(data);
  const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
