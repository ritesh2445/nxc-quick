import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { createAccountWithCardOrder, orderAdditionalCard, getUserByEmail } from "@/lib/db/queries";
import { paymentService } from "@/lib/payments";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Server-side authoritative pricing (prevents frontend price manipulation)
const TIER_PRICING: Record<string, Record<"INR" | "USD", number>> = {
  classic: { INR: 999, USD: 12 },
  metal: { INR: 1599, USD: 20 },
  atelier: { INR: 2999, USD: 38 },
  verse: { INR: 999, USD: 12 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getCurrentUser();

    const tier = (body.tier || "metal") as "classic" | "metal" | "atelier";
    const currency = (body.currency || "INR") as "INR" | "USD";
    const finish = body.finish || "pitch_black";
    const material = body.material || "mirror";
    const engravingName = body.engravingName || body.customerName || "Sovereign Member";
    const engravingTitle = body.engravingTitle || "";
    const customerEmail = (body.customerEmail || (session?.user.email) || "").toLowerCase().trim();
    const customerName = body.customerName || session?.profile?.fullName || engravingName;
    const customerPassword = body.customerPassword || "nxc_temp_pass_2026";
    const customerPhone = body.customerPhone || "";
    const shippingAddress = body.shippingAddress || JSON.stringify({ email: customerEmail, phone: customerPhone });

    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 });
    }

    // Authoritative Server-side Price
    const serverPrice = TIER_PRICING[tier]?.[currency] || 1599;

    // 1. Initialize Payment with Gateway
    const paymentResult = await paymentService.createOrder({
      tier,
      currency,
      amount: serverPrice,
      customerEmail,
      customerName,
    });

    let userId: string;
    let order: any;

    if (session && session.user) {
      // Flow C: Authenticated User purchasing additional card
      userId = session.user.id;
      const result = await orderAdditionalCard({
        userId,
        profileId: session.profile.id,
        tier,
        finish,
        material,
        engravingName,
        engravingTitle,
        amount: serverPrice,
        currency,
        paymentGateway: paymentResult.gateway,
        paymentId: paymentResult.orderId,
        shippingAddress,
      });
      order = result.order;
    } else {
      // Flow A: Guest purchasing card (Auto creates User + Profile + Card + Order)
      const passwordHash = hashPassword(customerPassword);
      const username = customerName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") || `usr_${Date.now()}`;

      const result = await createAccountWithCardOrder({
        email: customerEmail,
        passwordHash,
        fullName: customerName,
        username,
        designation: engravingTitle || "Executive Member",
        company: body.company || "Sovereign Network",
        phone: customerPhone,
        tier,
        finish,
        material,
        engravingName,
        engravingTitle,
        amount: serverPrice,
        currency,
        paymentGateway: paymentResult.gateway,
        paymentId: paymentResult.orderId,
        shippingAddress,
      });

      userId = result.user.id;
      order = result.order;

      // Automatically authenticate the user with session cookie
      const token = createSessionToken(userId);
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    return NextResponse.json({
      success: true,
      order,
      payment: paymentResult,
      autoLoggedIn: true,
    });
  } catch (err: any) {
    console.error("[Checkout Order API Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to process order" }, { status: 500 });
  }
}
