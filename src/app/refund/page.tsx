import React, { Suspense } from "react";
import { Metadata } from "next";
import { LegalView } from "@/components/legal/LegalView";

export const metadata: Metadata = {
  title: "Return & Refund Policy | NXC Verse",
  description:
    "Our transparent replacement promise, zero-defect policy, transit damage protection, and hassle-free refunds for bespoke metal NFC cards.",
};

export default function RefundPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white font-mono text-xs">
          Loading refund policy...
        </div>
      }
    >
      <LegalView initialTab="refund" />
    </Suspense>
  );
}
