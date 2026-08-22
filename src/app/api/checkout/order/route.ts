import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db/queries";
import { paymentService } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const paymentResult = await paymentService.createOrder({
      tier: body.tier || "metal",
      currency: body.currency || "INR",
      amount: body.amount || 1599,
      customerEmail: body.customerEmail || "customer@nxcverse.in",
      customerName: body.customerName || "Customer",
    });

    const newOrder = await createOrder({
      userId: "usr_ritesh",
      tier: body.tier || "metal",
      finish: body.finish || "obsidian",
      material: body.material || "matte",
      engravingName: body.engravingName || body.customerName || "Ritesh Martawar",
      engravingTitle: body.engravingTitle,
      amount: body.amount || 1599,
      currency: body.currency || "INR",
      paymentGateway: paymentResult.gateway,
      paymentId: paymentResult.orderId,
      shippingAddress: JSON.stringify({
        email: body.customerEmail,
        phone: body.customerPhone,
      }),
    });

    return NextResponse.json({ success: true, order: newOrder, payment: paymentResult });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
