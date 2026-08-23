"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import QRCode from "qrcode";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";

export type CardFinish =
  | "silver"
  | "gold"
  | "royal_red"
  | "pitch_black"
  | "cobalt_blue"
  // Legacy aliases
  | "matte_black"
  | "obsidian"
  | "titanium"
  | "mirror"
  | "champagne"
  | "midnight"
  | "carbon";

export interface FlippableCardProps {
  finish?: CardFinish;
  name?: string;
  designation?: string;
  company?: string;
  qrSlug?: string;
  engraving?: string;
  showFlipButton?: boolean;
  interactiveTilt?: boolean;
  isHero?: boolean;
  onFlipChange?: (isBack: boolean) => void;
}

export function InteractiveFlippableCard({
  finish = "pitch_black",
  name = "Ritesh Martawar",
  designation = "Founder & CEO",
  company = "NXC Verse",
  qrSlug = "ritesh",
  engraving = "EDITION NO. 001/100",
  showFlipButton = true,
  interactiveTilt = true,
  isHero = false,
  onFlipChange,
}: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const profileUrl = `https://nxcverse.in/@${qrSlug || "ritesh"}`;
    QRCode.toDataURL(profileUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((dataUri) => {
        setQrDataUrl(dataUri);
      })
      .catch((err) => {
        console.error("Failed to generate QR code", err);
      });
  }, [qrSlug]);

  const toggleFlip = () => {
    const next = !isFlipped;
    setIsFlipped(next);
    if (onFlipChange) onFlipChange(next);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const yNorm = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({
      x: isFlipped ? yNorm * 10 : yNorm * -10,
      y: isFlipped ? xNorm * -10 : xNorm * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Resolve legacy finish aliases to canonical 5 options: Silver, Gold, Royal Red, Pitch Black, Cobalt Blue
  const normalizedFinish: "silver" | "gold" | "royal_red" | "pitch_black" | "cobalt_blue" =
    finish === "mirror" || finish === "titanium" || finish === "silver"
      ? "silver"
      : finish === "champagne" || finish === "gold"
      ? "gold"
      : finish === "royal_red"
      ? "royal_red"
      : finish === "midnight" || finish === "carbon" || finish === "matte_black" || finish === "cobalt_blue"
      ? "cobalt_blue"
      : "pitch_black";

  // Clean, realistic physical metal card finish definitions without colored halos or duplicate frames
  const finishStyles = {
    silver: {
      id: "silver",
      name: "Silver",
      bg: "bg-[#B8C2D1]",
      border: "border-[#8E9CAA]/90",
      textPrimary: "text-[#000000] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-semibold",
      textSecondary: "text-[#1A1E26] font-medium",
      accentHex: "#000000",
      gradient: "from-[#7E8899] via-[#E2E8F2] via-[#A2ADC0] via-[#FFFFFF] via-[#C8D1E0] to-[#8E98AA]",
      shimmer: "rgba(255, 255, 255, 0.75)",
      shadow: "shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-1.5px_2px_rgba(0,0,0,0.3)]",
      glaze: "from-white/[0.5] via-transparent to-black/[0.15]",
      logoFilter: "brightness-0 opacity-100",
      logoBlend: "multiply" as const,
    },
    gold: {
      id: "gold",
      name: "Gold",
      bg: "bg-[#181002]",
      border: "border-[#F5D061]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-normal",
      textSecondary: "text-[#FFFFFF] font-normal",
      accentHex: "#FFFFFF",
      gradient: "from-[#1C1202] via-[#483006] via-[#94721A] via-[#ECC968] via-[#5A3F0C] via-[#1A1002] to-[#382607]",
      shimmer: "rgba(245, 208, 97, 0.45)",
      shadow: "shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2px_rgba(255,240,180,0.7),inset_0_-1.5px_2px_rgba(0,0,0,0.8)]",
      glaze: "from-[#FFF2CC]/[0.4] via-transparent to-[#D8B466]/[0.2]",
      logoFilter: "sepia-[0.7] brightness-125 contrast-115 drop-shadow-[0_0_8px_rgba(245,208,97,0.5)]",
      logoBlend: "screen" as const,
    },
    royal_red: {
      id: "royal_red",
      name: "Royal Red",
      bg: "bg-[#180004]",
      border: "border-[#E62045]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-normal",
      textSecondary: "text-[#FFFFFF] font-normal",
      accentHex: "#FFFFFF",
      gradient: "from-[#1C0005] via-[#4E020E] via-[#9E1026] via-[#F0264B] via-[#580312] via-[#180004] to-[#35010A]",
      shimmer: "rgba(255, 42, 85, 0.4)",
      shadow: "shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2px_rgba(255,180,195,0.7),inset_0_-1.5px_2px_rgba(0,0,0,0.8)]",
      glaze: "from-white/[0.3] via-transparent to-[#FF2A55]/[0.2]",
      logoFilter: "brightness-115 contrast-110 drop-shadow-[0_0_8px_rgba(255,100,130,0.5)]",
      logoBlend: "screen" as const,
    },
    pitch_black: {
      id: "pitch_black",
      name: "Pitch Black",
      bg: "bg-[#000000]",
      border: "border-white/30",
      textPrimary: "text-[#FFFFFF] drop-shadow-sm font-normal",
      textSecondary: "text-[#E0E0E8] font-normal",
      accentHex: "#FFFFFF",
      gradient: "from-[#000000] via-[#0A0A0E] to-[#000000]",
      shimmer: "rgba(255, 255, 255, 0.35)",
      shadow: "shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1.2px_1.5px_rgba(255,255,255,0.4),inset_0_-1.5px_2px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.2] via-transparent to-white/[0.05]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]",
      logoBlend: "screen" as const,
    },
    cobalt_blue: {
      id: "cobalt_blue",
      name: "Cobalt Blue",
      bg: "bg-[#030B1C]",
      border: "border-[#0088FF]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-normal",
      textSecondary: "text-[#66B8FF] font-normal",
      accentHex: "#0088FF",
      gradient: "from-[#020A18] via-[#08224E] via-[#0C387C] via-[#1457B8] via-[#0A2656] via-[#020A18] to-[#051630]",
      shimmer: "rgba(0, 140, 255, 0.45)",
      shadow: "shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2px_rgba(100,180,255,0.6),inset_0_-1.5px_2px_rgba(0,0,0,0.8)]",
      glaze: "from-white/[0.3] via-transparent to-[#0088FF]/[0.2]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_8px_rgba(100,180,255,0.5)]",
      logoBlend: "screen" as const,
    },
  }[normalizedFinish];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6 px-4 max-w-full overflow-visible">
      {/* 3D Perspective Flip Container (No clipping masks / overflow-visible) */}
      <div
        className="w-[260px] h-[415px] min-[360px]:w-[280px] min-[360px]:h-[445px] sm:w-[320px] sm:h-[510px] md:w-[340px] md:h-[530px] max-w-full cursor-pointer group relative z-10 overflow-visible"
        style={{ perspective: "1400px" }}
        onClick={toggleFlip}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-full h-full relative transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* ============================================================ */}
          {/* SIDE 1: FRONT FACE (NXC Phoenix Logo & Metal Branding)     */}
          {/* ============================================================ */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[18px] p-5 sm:p-7 flex flex-col justify-between overflow-hidden border ${finishStyles.border} ${finishStyles.shadow} bg-gradient-to-br ${finishStyles.gradient}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Fine Brushed Texture / Metallic Grain */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)",
              }}
            />

            {/* High-Gloss Diagonal Glaze & Reflection */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${finishStyles.glaze} pointer-events-none`} />

            {/* Dynamic Interactive Specular Glare (Reacts to mouse tilt) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-35 transition-opacity duration-300 group-hover:opacity-75"
              style={{
                background: `radial-gradient(circle 260px at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, ${finishStyles.shimmer}, transparent 70%)`,
              }}
            />

            {/* Top Bar: Brand Title & Contactless NFC Symbol */}
            <div className="relative z-10 flex items-center justify-between">
              <span className={`font-cinzel text-xs font-semibold tracking-[0.35em] uppercase ${finishStyles.textPrimary}`}>
                NXC VERSE
              </span>

              {/* Contactless Wave */}
              <div className={finishStyles.textSecondary}>
                <svg className="w-5 h-5 stroke-current filter drop-shadow-sm" fill="none" viewBox="0 0 24 24">
                  <path d="M12 4c4.418 0 8 3.582 8 8s-3.582 8-8 8" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M12 8c2.209 0 4 1.791 4 4s-1.791 4-4 4" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Center: Main Official NXC Phoenix Logo */}
            <div className="relative z-10 w-48 h-64 sm:w-52 sm:h-72 mx-auto my-auto flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={NXC_LOGO_DATA_URI}
                alt="NXC Verse Official Logo"
                style={{
                  mixBlendMode: finishStyles.logoBlend,
                }}
                className={`max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-300 ${finishStyles.logoFilter}`}
              />
            </div>
          </div>

          {/* ============================================================ */}
          {/* SIDE 2: BACK FACE (Name, Designation, Real QR Code)         */}
          {/* ============================================================ */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[18px] p-5 sm:p-7 flex flex-col justify-between overflow-hidden border ${finishStyles.border} ${finishStyles.shadow} bg-gradient-to-br ${finishStyles.gradient}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Brushed Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)",
              }}
            />

            {/* High-Gloss Diagonal Glaze & Reflection */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${finishStyles.glaze} pointer-events-none`} />

            {/* Dynamic Interactive Specular Glare */}
            <div
              className="absolute inset-0 pointer-events-none opacity-35 transition-opacity duration-300 group-hover:opacity-75"
              style={{
                background: `radial-gradient(circle 260px at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, ${finishStyles.shimmer}, transparent 70%)`,
              }}
            />

            {/* Top Bar: Company Name & NFC Chip Indicator */}
            <div className="relative z-10 flex items-center justify-between pb-2.5 sm:pb-3 border-b border-black/10 dark:border-white/15">
              <span className={`font-cinzel text-[10px] sm:text-[11px] font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase ${finishStyles.textPrimary}`}>
                {company.toUpperCase()}
              </span>
              <span className="font-mono text-[9px] text-[#A0A0B0] uppercase tracking-wider">
                NTAG216
              </span>
            </div>

            {/* Center: Dynamic QR Code with Laser Engraved Aesthetics */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-3">
              <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-lg border border-black/10">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Laser QR Matrix"
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#111] flex items-center justify-center font-mono text-[10px] text-white">
                    GENERATING QR
                  </div>
                )}
              </div>

              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#8E8E98] uppercase">
                SCAN TO CONNECT
              </span>
            </div>

            {/* Bottom Bar: Owner Full Name, Designation & Serial */}
            <div className="relative z-10 pt-2.5 sm:pt-3 border-t border-black/10 dark:border-white/15 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-cinzel font-medium text-xs sm:text-sm tracking-wide ${finishStyles.textPrimary}`}>
                    {name.toUpperCase()}
                  </h3>
                  <p className="font-sans text-[10px] sm:text-[11px] text-[#8E8E98]">
                    {designation}
                  </p>
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] text-[#8E8E98] tracking-widest uppercase">
                  {engraving}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Flip Button Below Card */}
      {showFlipButton && (
        <button
          type="button"
          onClick={toggleFlip}
          className="mt-4 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 text-xs font-mono text-[#D0D0DC] hover:text-white flex items-center gap-1.5 transition-all btn-interactive shadow-sm"
          aria-label="Flip Card"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#00A2FF]" />
          <span>{isFlipped ? "VIEW FRONT FACE" : "FLIP TO BACK"}</span>
        </button>
      )}
    </div>
  );
}
