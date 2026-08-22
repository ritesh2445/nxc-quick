"use client";

import React, { useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip badge on hover/initial display */}
      <a
        href="https://wa.me/919561248677"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center"
        aria-label="Chat with NXC Verse Concierge on WhatsApp"
      >
        {/* Pulsing Ripple Effect */}
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/20 animate-ping opacity-75 pointer-events-none" />
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] opacity-60 blur-[3px] group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Floating WhatsApp Button */}
        <div className="relative w-14 h-14 rounded-full bg-[#0E0E11] border border-[#25D366]/40 group-hover:border-[#25D366] flex items-center justify-center text-[#25D366] shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(37,211,102,0.3)] group-hover:shadow-[0_8px_35px_rgba(0,0,0,0.9),0_0_30px_rgba(37,211,102,0.6)] group-hover:scale-105 transition-all duration-300">
          <MessageCircle className="w-7 h-7 fill-[#25D366]/20 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Tooltip Tag */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141418]/95 border border-white/10 text-white text-xs font-sans whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 group-hover:-translate-x-1">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-[#F2F0EC] font-medium">WhatsApp Concierge</span>
        </div>
      </a>
    </div>
  );
}
