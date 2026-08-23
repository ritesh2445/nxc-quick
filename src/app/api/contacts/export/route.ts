import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getContactsByUserId } from "@/lib/db/queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    const session = await getCurrentUser();
    const userId = session?.user?.id || "usr_ritesh";

    const contacts = await getContactsByUserId(userId);

    if (format === "vcf") {
      // Generate multi-entry .vcf file
      let vcfContent = "";

      for (const c of contacts) {
        const nameParts = (c.fullName || "").trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        vcfContent += "BEGIN:VCARD\r\n";
        vcfContent += "VERSION:3.0\r\n";
        vcfContent += `FN:${c.fullName}\r\n`;
        vcfContent += `N:${lastName};${firstName};;;\r\n`;
        if (c.company) vcfContent += `ORG:${c.company}\r\n`;
        if (c.designation) vcfContent += `TITLE:${c.designation}\r\n`;
        if (c.phone) vcfContent += `TEL;TYPE=CELL:${c.phone}\r\n`;
        if (c.email) vcfContent += `EMAIL;TYPE=WORK:${c.email}\r\n`;
        if (c.notes) vcfContent += `NOTE:${c.notes.replace(/\r?\n/g, " ")}\r\n`;
        vcfContent += `REV:${new Date().toISOString()}\r\n`;
        vcfContent += "END:VCARD\r\n\r\n";
      }

      return new NextResponse(vcfContent, {
        status: 200,
        headers: {
          "Content-Type": "text/vcard; charset=utf-8",
          "Content-Disposition": `attachment; filename="NXC_Contacts_${new Date().toISOString().slice(0, 10)}.vcf"`,
        },
      });
    }

    // Default: CSV Export
    const csvRows = [
      ["Full Name", "Designation", "Company", "Phone", "Email", "Notes", "Source", "Date Captured"].map((h) => `"${h}"`).join(","),
    ];

    for (const c of contacts) {
      const escape = (val?: string | null) => `"${(val || "").replace(/"/g, '""')}"`;
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "";
      csvRows.push(
        [
          escape(c.fullName),
          escape(c.designation),
          escape(c.company),
          escape(c.phone),
          escape(c.email),
          escape(c.message || (c as any).notes),
          escape(c.source),
          escape(dateStr),
        ].join(",")
      );
    }

    const csvContent = csvRows.join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="NXC_Contacts_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("[Contacts Export Error]:", error);
    return NextResponse.json({ error: "Failed to generate contacts export" }, { status: 500 });
  }
}
