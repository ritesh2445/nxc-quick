import { NextRequest, NextResponse } from "next/server";
import { generateQrDataUrl } from "@/lib/qr";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "https://nxcverse.in";

  const dataUrl = await generateQrDataUrl(text);
  return NextResponse.json({ dataUrl });
}
