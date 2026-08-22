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
      x: isFlipped ? yNorm * 12 : yNorm * -12,
      y: isFlipped ? xNorm * -12 : xNorm * 12,
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

  // 5 Master Luxury Finishes: Silver, Gold, Royal Red, Pitch Black (#000000), Cobalt Blue
  const finishStyles = {
    silver: {
      id: "silver",
      name: "Silver",
      bg: "bg-[#B8C2D1]",
      border: "border-[#7E8B9E]/80",
      textPrimary: "text-[#000000] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-semibold",
      textSecondary: "text-[#1A1E26] font-medium",
      accentHex: "#000000",
      gradient: "from-[#7E8899] via-[#E2E8F2] via-[#A2ADC0] via-[#FFFFFF] via-[#C8D1E0] to-[#8E98AA]",
      shimmer: "rgba(255, 255, 255, 0.85)",
      glow: "shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(180,200,225,0.5),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-2px_3px_rgba(0,0,0,0.35)]",
      glaze: "from-white/[0.6] via-transparent to-black/[0.18]",
      ambientGlow: "bg-white/[0.15]",
      logoFilter: "brightness-0 opacity-100",
      logoBlend: "multiply" as const,
    },
    gold: {
      id: "gold",
      name: "Gold",
      bg: "bg-[#181002]",
      border: "border-[#F5D061]/90",
      textPrimary: "text-[#FFFBE8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#F5D061] font-normal",
      accentHex: "#F5D061",
      gradient: "from-[#1C1202] via-[#483006] via-[#94721A] via-[#ECC968] via-[#5A3F0C] via-[#1A1002] to-[#382607]",
      shimmer: "rgba(245, 208, 97, 0.55)",
      glow: "shadow-[0_30px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,208,97,0.45),inset_0_2px_3px_rgba(255,240,180,0.8),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-[#FFF2CC]/[0.45] via-transparent to-[#D8B466]/[0.25]",
      ambientGlow: "bg-[#F5D061]/[0.12]",
      logoFilter: "sepia-[0.7] brightness-135 contrast-120 drop-shadow-[0_0_15px_rgba(245,208,97,0.7)]",
      logoBlend: "screen" as const,
    },
    royal_red: {
      id: "royal_red",
      name: "Royal Red",
      bg: "bg-[#180004]",
      border: "border-[#FF2A55]/90",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#FF4D70] font-normal",
      accentHex: "#FF2A55",
      gradient: "from-[#1C0005] via-[#4E020E] via-[#9E1026] via-[#F0264B] via-[#580312] via-[#180004] to-[#35010A]",
      shimmer: "rgba(255, 42, 85, 0.5)",
      glow: "shadow-[0_30px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(255,42,85,0.45),inset_0_2px_3px_rgba(255,180,195,0.8),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.35] via-transparent to-[#FF2A55]/[0.3]",
      ambientGlow: "bg-[#FF2A55]/[0.12]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_15px_rgba(255,100,130,0.7)]",
      logoBlend: "screen" as const,
    },
    pitch_black: {
      id: "pitch_black",
      name: "Pitch Black",
      bg: "bg-[#000000]",
      border: "border-white/35",
      textPrimary: "text-[#FFFFFF] drop-shadow-sm font-normal",
      textSecondary: "text-[#E0E0E8] font-normal",
      accentHex: "#FFFFFF",
      gradient: "from-[#000000] via-[#000000] to-[#000000]",
      shimmer: "rgba(255, 255, 255, 0.45)",
      glow: "shadow-[0_30px_80px_rgba(0,0,0,0.98),0_0_25px_rgba(255,255,255,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.45),inset_0_-2px_3px_rgba(0,0,0,0.95)]",
      glaze: "from-white/[0.22] via-transparent to-white/[0.06]",
      ambientGlow: "bg-white/[0.05]",
      logoFilter: "brightness-125 contrast-110 drop-shadow-[0_0_18px_rgba(255,255,255,0.7)]",
      logoBlend: "screen" as const,
    },
    cobalt_blue: {
      id: "cobalt_blue",
      name: "Cobalt Blue",
      bg: "bg-[#030B1C]",
      border: "border-[#0088FF]/90",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#66B8FF] font-normal",
      accentHex: "#0088FF",
      gradient: "from-[#020A18] via-[#08224E] via-[#0C387C] via-[#1457B8] via-[#0A2656] via-[#020A18] to-[#051630]",
      shimmer: "rgba(0, 140, 255, 0.6)",
      glow: "shadow-[0_30px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(0,120,255,0.45),inset_0_2px_3px_rgba(100,180,255,0.7),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.35] via-transparent to-[#0088FF]/[0.3]",
      ambientGlow: "bg-[#0066FF]/[0.15]",
      logoFilter: "brightness-125 contrast-110 drop-shadow-[0_0_15px_rgba(100,180,255,0.7)]",
      logoBlend: "screen" as const,
    },
  }[normalizedFinish];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Outer Ambient Glowing Halo */}
      <div className={`absolute -inset-6 rounded-[36px] blur-3xl pointer-events-none transition-all duration-700 ${finishStyles.ambientGlow}`} />

      {/* 3D Perspective Flip Container */}
      <div
        className="w-[300px] h-[480px] sm:w-[330px] sm:h-[520px] md:w-[340px] md:h-[530px] cursor-pointer group relative z-10"
        style={{ perspective: "1200px" }}
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
            className={`absolute inset-0 w-full h-full rounded-[18px] p-7 flex flex-col justify-between overflow-hidden border ${finishStyles.border} ${finishStyles.glow} bg-gradient-to-br ${finishStyles.gradient}`}
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

            {/* Dynamic Interactive Specular Glare (Reacts to mouse position) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-45 transition-opacity duration-300 group-hover:opacity-85"
              style={{
                background: `radial-gradient(circle 260px at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, ${finishStyles.shimmer}, transparent 70%)`,
              }}
            />

            {/* Gloss Light Sweep Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 animate-gloss-sweep" />
            </div>

            {/* Top Bar: Brand Title & NFC Symbol (Luxury Cinzel Refined Typography) */}
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

            {/* Center: Main Big NXC Logo (Solid Black on Silver, Glowing on Dark Metals) */}
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
            className={`absolute inset-0 w-full h-full rounded-[18px] p-7 flex flex-col justify-between overflow-hidden border ${finishStyles.border} ${finishStyles.glow} bg-gradient-to-br ${finishStyles.gradient}`}
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
              className="absolute inset-0 pointer-events-none opacity-45 transition-opacity duration-300 group-hover:opacity-85"
              style={{
                background: `radial-gradient(circle 260px at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, ${finishStyles.shimmer}, transparent 70%)`,
              }}
            />

            {/* Top Bar: Company Name & NFC Chip UID */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/15">
              <span className={`font-cinzel text-[11px] font-medium tracking-[0.25em] uppercase ${finishStyles.textPrimary}`}>
                {company.toUpperCase()}
              </span>
              <span className={`font-mono text-[10px] font-medium tracking-widest ${finishStyles.textSecondary}`}>
                04:A2:8F:E1:99
              </span>
            </div>

            {/* Center Area: Name & Position FIRST (in 2 distinct lines), then Real Scannable QR Code Below */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 my-auto">
              {/* Identity Personalization (Above QR - Two Lines Stacked) */}
              <div className="space-y-1">
                <h3 className={`font-cinzel text-xl sm:text-[23px] font-normal tracking-[0.18em] uppercase leading-tight ${finishStyles.textPrimary}`}>
                  {name.split(" ").map((word, idx) => (
                    <span key={idx} className="block">
                      {word}
                    </span>
                  ))}
                </h3>
                <p className={`font-tenor text-[11px] font-normal tracking-[0.24em] uppercase ${finishStyles.textSecondary}`}>
                  {designation}
                </p>
              </div>

              {/* Real Scannable Precision QR Matrix (Below Name & Position) */}
              <div className="p-2.5 bg-white rounded-[10px] shadow-[0_12px_36px_rgba(0,0,0,0.85)] border border-white/30">
                <div className="w-28 h-28 sm:w-32 sm:h-32 relative flex items-center justify-center bg-white p-1">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="Real Digital Profile QR Code"
                      className="w-full h-full object-contain pointer-events-none select-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/10 animate-pulse rounded" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom: Custom Engraving / Serial Line (No link) */}
            <div className="relative z-10 pt-3 border-t border-black/10 dark:border-white/15 flex items-center justify-center text-[9px] font-mono">
              <span className={`tracking-[0.3em] uppercase ${finishStyles.textSecondary}`}>
                {engraving}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flip Trigger Button Below Card */}
      {showFlipButton && (
        <button
          type="button"
          onClick={toggleFlip}
          className="mt-4 px-4 py-1.5 rounded-[20px] bg-[#18181C] border border-white/10 hover:border-white/30 text-xs font-mono text-text-secondary hover:text-white flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180 text-accent-silver" : ""}`} />
          <span>{isFlipped ? "Show Front (NXC Logo)" : "Flip Card (Name & QR Side)"}</span>
        </button>
      )}
    </div>
  );
}
