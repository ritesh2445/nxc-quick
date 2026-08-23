import React from "react";
import { ChevronRight, Phone, Mail, Globe, User, Share2, Linkedin, Instagram, Twitter, QrCode } from "lucide-react";
import { PhoenixEmblem } from "@/components/3d/PhoenixSvg";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-[#000000] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center space-y-12 sm:space-y-16 relative z-10">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="font-mono text-[11px] text-[#70707C] uppercase tracking-[0.25em] font-medium">
            HOW IT WORKS
          </p>
          <h2 className="font-sans font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-tight">
            Three steps to limitless connections.
          </h2>
        </div>

        {/* 3 Step Cards Grid with Flow Connectors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-stretch">
          {/* Step 01: Tap or Scan */}
          <div className="relative bg-[#060608] border border-white/[0.1] hover:border-white/30 rounded-[14px] p-5 sm:p-7 text-left flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 min-h-[220px] sm:min-h-[230px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] hover:-translate-y-1 group overflow-hidden">
            <div className="space-y-2.5 flex-1 min-w-0">
              <span className="font-mono text-sm font-light text-[#70707C]">01</span>
              <h3 className="font-sans font-semibold text-base md:text-lg text-white">
                Tap or Scan
              </h3>
              <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                Tap your NXC Verse card or scan the QR code.
              </p>
            </div>

            {/* Visual Mini Card */}
            <div className="relative w-24 sm:w-28 h-32 sm:h-36 rounded-[10px] bg-gradient-to-br from-[#1F1F26] via-[#0B0B0E] to-[#000000] border border-white/25 p-2 sm:p-2.5 flex flex-col justify-between shadow-2xl shrink-0">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[7px] text-[#A09E9A] tracking-wider font-semibold">NXC</span>
                {/* Contactless waves */}
                <svg className="w-3.5 h-3.5 stroke-[#E2E0DC]" fill="none" viewBox="0 0 24 24">
                  <path d="M12 4c4 0 7 3 7 7s-3 7-7 7" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 8c2 0 4 2 4 4s-2 4-4 4" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Center NXC Official Logo */}
              <div className="w-8 sm:w-10 h-10 sm:h-12 mx-auto flex items-center justify-center opacity-95">
                <PhoenixEmblem />
              </div>

              {/* Bottom QR Pattern */}
              <div className="flex justify-end">
                <div className="w-5 sm:w-6 h-5 sm:h-6 bg-white/10 rounded-[2px] border border-white/30 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-white/80 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Desktop Chevron connector to step 2 */}
            <div className="hidden lg:flex absolute -right-4.5 top-1/2 -translate-y-1/2 z-20 text-[#50505C]">
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>

          {/* Step 02: Open Profile */}
          <div className="relative bg-[#060608] border border-white/[0.1] hover:border-white/30 rounded-[14px] p-5 sm:p-7 text-left flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 min-h-[220px] sm:min-h-[230px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] hover:-translate-y-1 group overflow-hidden">
            <div className="space-y-2.5 flex-1 min-w-0">
              <span className="font-mono text-sm font-light text-[#70707C]">02</span>
              <h3 className="font-sans font-semibold text-base md:text-lg text-white">
                Open Profile
              </h3>
              <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                Your digital profile opens instantly on any device.
              </p>
            </div>

            {/* Visual Phone Mockup */}
            <div className="relative w-24 sm:w-28 h-36 sm:h-40 rounded-[14px] bg-[#0E0E12] border border-white/20 p-2 flex flex-col items-center justify-between shadow-2xl shrink-0">
              <div className="w-7 sm:w-8 h-1 bg-white/20 rounded-full" />
              
              <div className="flex flex-col items-center text-center space-y-1 my-auto">
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-gradient-to-tr from-[#3A3A45] to-[#70707C] border border-white/40 shadow-inner flex items-center justify-center text-[9px] sm:text-[10px]">
                  👤
                </div>
                <span className="font-sans font-semibold text-[7px] sm:text-[8px] text-white">Aarav Mehta</span>
                <span className="font-sans text-[5px] sm:text-[6px] text-[#A09E9A]">Founder at NXC Verse</span>
                
                <div className="w-full py-0.5 px-1 rounded-[4px] bg-white/10 text-[5px] sm:text-[6px] text-[#F2F0EC] border border-white/10 mt-0.5">
                  Save Contact
                </div>
              </div>

              {/* Social Icons Bar */}
              <div className="flex items-center gap-1 sm:gap-1.5 opacity-60 text-[7px] sm:text-[8px]">
                <span>𝕏</span>
                <span>📸</span>
                <span>💼</span>
              </div>
            </div>

            {/* Desktop Chevron connector to step 3 */}
            <div className="hidden lg:flex absolute -right-4.5 top-1/2 -translate-y-1/2 z-20 text-[#50505C]">
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>

          {/* Step 03: Connect Instantly */}
          <div className="relative bg-[#060608] border border-white/[0.1] hover:border-white/30 rounded-[14px] p-5 sm:p-7 text-left flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 min-h-[220px] sm:min-h-[230px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] hover:-translate-y-1 group overflow-hidden">
            <div className="space-y-2.5 flex-1 min-w-0">
              <span className="font-mono text-sm font-light text-[#70707C]">03</span>
              <h3 className="font-sans font-semibold text-base md:text-lg text-white">
                Connect Instantly
              </h3>
              <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                Share, connect and leave a lasting impression.
              </p>
            </div>

            {/* Visual Action Chips Stack */}
            <div className="relative w-24 sm:w-28 rounded-[8px] bg-[#0E0E12] border border-white/15 p-1.5 sm:p-2 flex flex-col gap-1 sm:gap-1.5 shadow-2xl shrink-0">
              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[4px] bg-[#16161C] border border-white/10 flex items-center gap-1 sm:gap-1.5 text-[6px] sm:text-[7px] text-white">
                <User className="w-2.5 h-2.5 text-[#E2E0DC]" /> Save Contact
              </div>
              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[4px] bg-[#16161C] border border-white/10 flex items-center gap-1 sm:gap-1.5 text-[6px] sm:text-[7px] text-[#A09E9A]">
                <Phone className="w-2.5 h-2.5 text-[#E2E0DC]" /> Call
              </div>
              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[4px] bg-[#16161C] border border-white/10 flex items-center gap-1 sm:gap-1.5 text-[6px] sm:text-[7px] text-[#A09E9A]">
                <Mail className="w-2.5 h-2.5 text-[#E2E0DC]" /> Email
              </div>
              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[4px] bg-[#16161C] border border-white/10 flex items-center gap-1 sm:gap-1.5 text-[6px] sm:text-[7px] text-[#A09E9A]">
                <Globe className="w-2.5 h-2.5 text-[#E2E0DC]" /> Website
              </div>
              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-[4px] bg-[#16161C] border border-white/10 flex items-center gap-1 sm:gap-1.5 text-[6px] sm:text-[7px] text-[#A09E9A]">
                <Linkedin className="w-2.5 h-2.5 text-[#E2E0DC]" /> LinkedIn
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

