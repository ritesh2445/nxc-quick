"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Radio, Eye } from "lucide-react";
import { InteractiveFlippableCard } from "@/components/3d/InteractiveFlippableCard";

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [show3DModal, setShow3DModal] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[95vh] lg:min-h-screen w-full flex flex-col justify-between pt-24 md:pt-28 pb-12 overflow-hidden bg-[#000000] select-none"
    >
      {/* 1. Cinematic Hero Image Layer with Parallax & Non-Overlapping Mask */}
      <div
        className="absolute right-0 top-0 w-full lg:w-[64%] h-full pointer-events-none overflow-hidden transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0) scale(1.03)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/nxc card black.png"
          alt="NXC Verse Obsidian Metal Card on Volcanic Rock"
          className="w-full h-full object-cover object-center lg:object-right filter brightness-95 contrast-105"
        />

        {/* Master Left-to-Right Fade: Guarantees Left Column is 100% Pitch Black with Zero Collision */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 via-40% to-transparent" />
        
        {/* Top and Bottom Vignettes */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#000000] via-[#000000]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent" />
      </div>

      {/* 2. Ambient Studio Parallax Light Spots */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[180px] pointer-events-none transition-transform duration-500 ease-out z-0"
        style={{
          transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)`,
        }}
      />

      {/* 3. Main Hero Content Grid (Clean, Luxurious & Free of Clutter) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto relative z-10">
        
        {/* LEFT / CENTER-LEFT COLUMN: Master Typography & Action CTAs */}
        <div className="lg:col-span-8 xl:col-span-7 space-y-6 sm:space-y-7 md:space-y-8 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0E0E12]/90 border border-white/[0.12] backdrop-blur-md shadow-inner max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
            <span className="font-mono text-[9px] min-[360px]:text-[10px] md:text-xs text-[#E2E0DC] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold truncate">
              AEROSPACE GRADE SMART HARDWARE
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="font-sans font-medium text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-[76px] text-white tracking-tightest leading-[1.06] sm:leading-[1.04] drop-shadow-md break-words">
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

          {/* Luxury Buttons with Electric Blue Glow & Click Interactions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1">
            {/* Primary Order Now Button */}
            <Link href="/order" className="btn-interactive">
              <button className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-[#FFFFFF] font-sans font-bold text-[11px] sm:text-xs md:text-sm tracking-[0.18em] sm:tracking-[0.2em] uppercase flex items-center gap-1.5 sm:gap-2 shadow-[0_0_30px_rgba(0,120,255,0.45)] hover:shadow-[0_0_45px_rgba(0,150,255,0.7)]">
                ACQUIRE CARD <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </Link>

            {/* Secondary Design / Atelier Button */}
            <Link href="/customize" className="btn-interactive">
              <button className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 hover:border-white/60 text-[#FFFFFF] font-sans font-medium text-[11px] sm:text-xs md:text-sm tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 backdrop-blur-md">
                CUSTOMIZE ATELIER
              </button>
            </Link>

            {/* 3D Interactive Inspection Pill */}
            <button
              onClick={() => setShow3DModal(true)}
              className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full bg-[#0E0E14] border border-white/15 hover:border-[#0099FF]/60 text-[#E2E0DC] hover:text-white font-mono text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2 transition-all btn-interactive"
            >
              <Eye className="w-3.5 h-3.5 text-[#00A2FF]" /> 3D INSPECT
            </button>
          </div>

          {/* Engineering & Hardware Standards Bar */}
          <div className="pt-4 sm:pt-6 md:pt-8">
            <p className="font-mono text-[9px] sm:text-[10px] md:text-[11px] text-[#70707C] uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-3 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A2FF] animate-pulse" />
              BUILT ON MODERN STANDARDS & COMPLIANCE
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px] hover:border-white/30 transition-colors">
                <span className="text-[#00A2FF]">✦</span> NFC ISO 14443A
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px] hover:border-white/30 transition-colors">
                <span className="text-[#00A2FF]">✦</span> iOS & Android Ready
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px] hover:border-white/30 transition-colors">
                <span className="text-[#00A2FF]">✦</span> 256-Bit Encrypted
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D0D0DC] font-mono text-[10px] sm:text-[11px] hover:border-white/30 transition-colors">
                <span className="text-[#00A2FF]">✦</span> Zero App Needed
              </div>
            </div>
          </div>
        </div>

        {/* Right side is intentionally open for the volcanic rock Obsidian metal card hero visual */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-5 pointer-events-none" />
      </div>

      {/* 3D Interactive Card Modal Overlay */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative bg-[#060608] border border-white/20 rounded-[20px] p-6 md:p-8 max-w-lg w-full flex flex-col items-center shadow-[0_30px_90px_rgba(0,0,0,0.98)]">
            <button
              onClick={() => setShow3DModal(false)}
              className="absolute top-4 right-4 text-[#A09E9A] hover:text-white text-xs font-mono px-3 py-1 rounded-full border border-white/15 hover:border-white/40 transition-colors"
            >
              ✕ CLOSE
            </button>

            <h3 className="font-sans font-semibold text-lg text-white mb-1">
              Dual-Sided 3D Inspection
            </h3>
            <p className="font-sans text-xs text-[#9E9EA8] mb-5">
              Move cursor to tilt metal finish. Click card or flip button to switch faces.
            </p>

            <InteractiveFlippableCard
              finish="obsidian"
              name="Ritesh Martawar"
              designation="FOUNDER & CEO"
              company="NXC Verse"
              qrSlug="ritesh"
              isHero={true}
              showFlipButton={true}
            />
          </div>
        </div>
      )}
    </section>
  );
}

