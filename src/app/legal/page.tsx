import React, { Suspense } from "react";
import { Metadata } from "next";
import { LegalView } from "@/components/legal/LegalView";

export const metadata: Metadata = {
  title: "Legal & Customer Policies | NXC Verse",
  description:
    "Review Terms & Conditions, Privacy Policy, Return & Refund Policy, and Express Shipping guidelines for NXC Verse metal NFC cards.",
};

export default function LegalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white font-mono text-xs">
          Loading policies...
        </div>
      }
    >
      <LegalView initialTab="terms" />
    </Suspense>
  );
}
