import React, { Suspense } from "react";
import { Metadata } from "next";
import { LegalView } from "@/components/legal/LegalView";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | NXC Verse",
  description:
    "Complimentary express air delivery across India, international dispatch, real-time tracking, and executive tamper-evident packaging.",
};

export default function ShippingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white font-mono text-xs">
          Loading shipping policy...
        </div>
      }
    >
      <LegalView initialTab="shipping" />
    </Suspense>
  );
}
