import React, { Suspense } from "react";
import { Metadata } from "next";
import { LegalView } from "@/components/legal/LegalView";

export const metadata: Metadata = {
  title: "Terms & Conditions | NXC Verse",
  description:
    "Clear, honest guidelines governing product purchases, inclusive tax pricing, shipping timelines, and customer rights at NXC Verse.",
};

export default function TermsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white font-mono text-xs">
          Loading terms...
        </div>
      }
    >
      <LegalView initialTab="terms" />
    </Suspense>
  );
}
