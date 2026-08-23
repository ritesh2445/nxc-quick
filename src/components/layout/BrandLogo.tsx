import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showSparkles?: boolean;
}

export function BrandLogo({
  className,
  size = "md",
  href = "/",
  showSparkles = true,
}: BrandLogoProps) {
  const content = (
    <div
      className={cn(
        "group relative inline-flex items-center gap-3 focus:outline-none select-none cursor-pointer py-1",
        className
      )}
    >
      {/* ========================================================================= */}
      {/* 1. NXC LOGO EMBLEM WITH ORBITAL DOODLES & BLUE AMBIENT PULSE              */}
      {/* ========================================================================= */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Ambient Electric Blue Pulse Halo */}
        <div className="absolute inset-0 -m-1.5 rounded-full bg-[#0088FF]/20 blur-md group-hover:bg-[#00A2FF]/40 animate-electric-pulse pointer-events-none transition-all duration-300" />

        {/* Outer Celestial Doodle Orbit Ring 1 (Clockwise) */}
        <svg
          className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none animate-doodle-orbit opacity-75 group-hover:opacity-100 transition-opacity"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dashed Orbital Ellipse */}
          <ellipse
            cx="22"
            cy="22"
            rx="19"
            ry="19"
            stroke="url(#orbitGradient1)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          {/* Constellation Star Dot on the Orbit */}
          <circle cx="22" cy="3" r="1.5" fill="#00D4FF" className="filter drop-shadow-[0_0_3px_#00D4FF]" />
          <circle cx="3" cy="22" r="1" fill="#38BDF8" />
          <defs>
            <linearGradient id="orbitGradient1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00D4FF" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#0066FF" stopOpacity="0.2" />
              <stop offset="1" stopColor="#00D4FF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Micro Doodle Orbit Ring 2 (Counter-Clockwise) */}
        <svg
          className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none animate-doodle-orbit-fast opacity-50 group-hover:opacity-85 transition-opacity"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="18"
            cy="18"
            rx="16"
            ry="16"
            stroke="url(#orbitGradient2)"
            strokeWidth="0.75"
            strokeDasharray="2 6"
          />
          <circle cx="32" cy="18" r="1.2" fill="#66C2FF" className="filter drop-shadow-[0_0_3px_#66C2FF]" />
          <defs>
            <linearGradient id="orbitGradient2" x1="0" y1="36" x2="36" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" stopOpacity="0.6" />
              <stop offset="1" stopColor="#00A2FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Transparent NXC Phoenix Logo Mark */}
        <div
          className={cn(
            "relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            size === "sm" && "w-6 h-6",
            size === "md" && "w-7 h-7 sm:w-8 sm:h-8",
            size === "lg" && "w-10 h-10"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logos/logo-no-bg.png"
            alt="NXC Verse Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,162,255,0.6)] brightness-110 contrast-105 pointer-events-none select-none"
          />
        </div>

        {/* Dynamic Sparkle 1 (Top-Left of Logo) */}
        {showSparkles && (
          <span className="absolute -top-2 -left-2 text-[10px] sm:text-xs text-[#00D4FF] pointer-events-none animate-sparkle-1 font-sans">
            ✦
          </span>
        )}

        {/* Dynamic Sparkle 3 (Bottom-Left of Logo) */}
        {showSparkles && (
          <span className="absolute -bottom-1.5 -left-1 text-[8px] sm:text-[9px] text-[#60A5FA] pointer-events-none animate-sparkle-3 font-sans">
            ✧
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. BRAND WORDMARK WITH SHIMMERING ELECTRIC BLUE GRADIENT & SPARKS        */}
      {/* ========================================================================= */}
      <div className="relative flex items-center">
        <span
          className={cn(
            "font-cinzel font-semibold tracking-[0.25em] text-white transition-colors flex items-center",
            size === "sm" && "text-sm",
            size === "md" && "text-base sm:text-lg md:text-xl",
            size === "lg" && "text-2xl"
          )}
        >
          <span className="text-white drop-shadow-sm group-hover:text-[#FFFFFF] transition-colors">
            NXC
          </span>
          &nbsp;
          <span className="font-light bg-gradient-to-r from-[#FFFFFF] via-[#66C2FF] via-[#E2E0DC] via-[#00D4FF] to-[#FFFFFF] bg-[length:200%_auto] animate-text-shimmer bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,162,255,0.3)]">
            VERSE
          </span>
        </span>

        {/* Sparkle 2 (Top-Right of Wordmark) */}
        {showSparkles && (
          <span className="absolute -top-2.5 -right-3 text-[9px] sm:text-[11px] text-[#38BDF8] pointer-events-none animate-sparkle-2 font-sans">
            ✦
          </span>
        )}

        {/* Floating Stardust Doodle 4 (Bottom-Right) */}
        {showSparkles && (
          <span className="absolute -bottom-2 right-1 text-[7px] text-[#93C5FD] pointer-events-none animate-sparkle-float font-sans">
            ✧
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
