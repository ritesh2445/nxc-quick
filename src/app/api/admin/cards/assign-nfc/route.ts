import { NextRequest, NextResponse } from "next/server";
import { assignNfcUid } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.cardId || !body.nfcUid) {
      return NextResponse.json({ error: "Missing cardId or nfcUid" }, { status: 400 });
    }

    const updated = await assignNfcUid(body.cardId, body.nfcUid);
    return NextResponse.json({ success: true, card: updated });
  } catch (err) {
    console.error("NFC assignment failed:", err);
    return NextResponse.json({ error: "Failed to assign NFC UID" }, { status: 500 });
  }
}
