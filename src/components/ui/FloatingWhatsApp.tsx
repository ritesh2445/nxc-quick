"use client";

import React, { useState } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <aside aria-label="WhatsApp Concierge" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <a
        href="https://wa.me/919561248677"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center btn-interactive"
        aria-label="Chat with NXC Verse Concierge on WhatsApp"
      >
        {/* Real Official WhatsApp Floating Action Button (Solid #25D366, Pure White Handset Logo, Clean Shadow) */}
        <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] group-hover:scale-105 active:scale-95 transition-all duration-200">
          <WhatsAppIcon className="w-8 h-8 text-white" color="#FFFFFF" />
        </div>

        {/* Tooltip Tag */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141418] border border-white/10 text-white text-xs font-sans whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 group-hover:-translate-x-1">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span className="text-[#F2F0EC] font-medium">WhatsApp Concierge</span>
        </div>
      </a>
    </aside>
  );
}
