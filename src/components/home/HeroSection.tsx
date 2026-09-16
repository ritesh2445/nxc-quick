"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { InteractiveFlippableCard } from "@/components/3d/InteractiveFlippableCard";

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [show3DModal, setShow3DModal] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTiltValues(x, y);
  };

  const setTiltValues = (x: number, y: number) => {
    setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] lg:min-h-screen w-full flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-12 overflow-hidden bg-[#000000] select-none"
    >
      {/* 1. Cinematic Hero Image Layer with Non-Overlapping Vignette */}
      <div
        className="absolute right-0 top-0 w-full lg:w-[62%] h-full pointer-events-none overflow-hidden transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/nxc card black.png"
          alt="NXC Verse Obsidian Metal Card on Volcanic Rock"
          className="w-full h-full object-cover object-center lg:object-right filter brightness-95 contrast-105"
        />

        {/* Master Left-to-Right Fade: Guarantees Left Column is 100% Pitch Black */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/85 via-40% to-transparent" />
        
        {/* Top and Bottom Vignettes */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#000000] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#000000] to-transparent" />
      </div>

      {/* 2. Ambient Studio Light Spot */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none transition-transform duration-500 ease-out z-0"
        style={{
          transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, 0)`,
        }}
      />

      {/* 3. Main Hero Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto relative z-10">
        
        {/* LEFT / CENTER-LEFT COLUMN: Typography & Action CTAs */}
        <div className="lg:col-span-8 xl:col-span-7 space-y-5 sm:space-y-7 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E0E12] border border-white/[0.12] backdrop-blur-md shadow-sm max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2E0DC] shrink-0" />
            <span className="font-mono text-[9px] min-[360px]:text-[10px] md:text-xs text-[#E2E0DC] tracking-[0.2em] uppercase font-semibold truncate">
              AEROSPACE GRADE SMART HARDWARE
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="font-sans font-medium text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-white tracking-tightest leading-[1.06] drop-shadow-sm break-words">
            Your identity.
            <br />
            <span className="text-[#E2E0DC] bg-gradient-to-r from-white via-[#E2E0DC] to-[#9CA8B8] bg-clip-text text-transparent">
              Cast in metal.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-base md:text-lg text-[#9E9EA8] max-w-lg leading-relaxed font-normal">
            Aerospace-grade metallic business cards calibrated for 0.1-second contactless NFC transfer and paired with a permanent sovereign digital profile.
          </p>

          {/* Luxury Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Order Button: Crisp Luxury White / Platinum */}
            <Link href="/order" className="btn-interactive">
              <button className="min-h-[44px] px-6 sm:px-8 py-3 rounded-full bg-white text-black font-sans font-semibold text-xs md:text-sm tracking-[0.16em] uppercase flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.18)] hover:bg-[#EAE8E4] active:bg-[#DCDAD4] transition-colors">
                <span>ACQUIRE CARD</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>

            {/* 3D Interactive Inspection Pill */}
            <button
              onClick={() => setShow3DModal(true)}
              className="min-h-[44px] px-4 sm:px-5 py-3 rounded-full bg-[#0E0E14] border border-white/15 hover:border-white/40 text-[#E2E0DC] hover:text-white font-mono text-xs flex items-center gap-2 transition-colors btn-interactive"
            >
              <Eye className="w-3.5 h-3.5 text-[#9CA8B8]" />
              <span>3D INSPECT</span>
            </button>
          </div>

          {/* Engineering & Hardware Standards Bar */}
          <div className="pt-4 sm:pt-6 md:pt-8">
            <p className="font-mono text-[10px] sm:text-[11px] text-[#70707C] uppercase tracking-[0.22em] mb-3 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9CA8B8]" />
              BUILT ON MODERN STANDARDS & COMPLIANCE
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px]">
                <span className="text-[#9CA8B8]">✦</span> NFC ISO 14443A
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px]">
                <span className="text-[#9CA8B8]">✦</span> iOS & Android Ready
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px]">
                <span className="text-[#9CA8B8]">✦</span> 256-Bit Encrypted
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px]">
                <span className="text-[#9CA8B8]">✦</span> Zero App Needed
              </div>
            </div>
          </div>
        </div>

        {/* Right side spacer for desktop volcanic hero visual */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-5 pointer-events-none" />
      </div>

      {/* 3D Interactive Card Modal Overlay */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="relative bg-[#08080A] border border-white/20 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 md:p-8 max-w-lg w-full flex flex-col items-center shadow-[0_24px_80px_rgba(0,0,0,0.98)] my-auto">
            {/* Header with Title and Close Button properly spaced to prevent collision */}
            <div className="w-full flex items-center justify-between gap-3 mb-2 pb-2.5 border-b border-white/10">
              <h3 className="font-cinzel font-medium text-xs min-[360px]:text-sm sm:text-base md:text-lg text-white tracking-[0.14em] sm:tracking-[0.18em] uppercase truncate">
                Dual-Sided 3D Inspection
              </h3>
              <button
                type="button"
                onClick={() => setShow3DModal(false)}
                className="shrink-0 text-[#A09E9A] hover:text-white text-[11px] sm:text-xs font-mono px-3 py-1.5 rounded-full border border-white/15 hover:border-white/40 transition-colors flex items-center gap-1 active:scale-95"
                aria-label="Close 3D inspection modal"
              >
                ✕ CLOSE
              </button>
            </div>

            <p className="font-sans text-[11px] sm:text-xs text-[#9E9EA8] mb-4 text-center w-full flex items-center justify-center gap-2 flex-wrap">
              <span>Tilt your phone or move cursor to inspect finish. Tap to flip faces.</span>
            </p>

            <InteractiveFlippableCard
              finish="pitch_black"
              name="Ritesh Martawar"
              designation="FOUNDER & CEO"
              company="NXC Verse"
              qrSlug="ritesh"
              isHero={true}
              showFlipButton={true}
            />

            {/* Modal Bottom CTA */}
            <div className="w-full pt-3 mt-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <div className="text-center sm:text-left">
                <p className="font-cinzel text-xs text-white font-medium">Pitch Black Metal Edition</p>
                <p className="font-mono text-[10px] text-[#8E8E98]">₹1,599 · NTAG216 NFC & Sovereign Identity</p>
              </div>
              <Link
                href="/order?finish=pitch_black"
                onClick={() => setShow3DModal(false)}
                className="w-full sm:w-auto btn-interactive"
              >
                <button className="w-full sm:w-auto min-h-[42px] px-5 py-2.5 rounded-full bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase hover:bg-[#EAE8E4] flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                  <span>ACQUIRE THIS CARD</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
