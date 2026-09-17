import React, { Suspense } from "react";
import { Metadata } from "next";
import { LegalView } from "@/components/legal/LegalView";

export const metadata: Metadata = {
  title: "Privacy Policy | NXC Verse",
  description:
    "How your personal identity, contact links, and hardware telemetry are protected with sovereign encryption under the Indian DPDP Act 2023.",
};

export default function PrivacyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white font-mono text-xs">
          Loading privacy policy...
        </div>
      }
    >
      <LegalView initialTab="privacy" />
    </Suspense>
  );
}
