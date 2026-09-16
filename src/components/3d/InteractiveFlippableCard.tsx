"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import QRCode from "qrcode";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";
import { cn } from "@/lib/utils";

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
  fontStyle?: "cinzel" | "sans" | "mono";
  activeFace?: "front" | "back";
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
  fontStyle = "cinzel",
  activeFace,
  onFlipChange,
}: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(activeFace === "back");
  const [isFlipping, setIsFlipping] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const flipTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Physics-based spring / lerp damping refs for phone gyroscope & touch
  const targetTiltRef = React.useRef({ x: 0, y: 0 });
  const currentTiltRef = React.useRef({ x: 0, y: 0 });
  const isGyroActiveRef = React.useRef(false);
  const isTouchingRef = React.useRef(false);
  const touchStartRef = React.useRef({ x: 0, y: 0 });
  const hasMovedTouchRef = React.useRef(false);
  const rafIdRef = React.useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Liquid metallic spring damping loop running at display refresh rate (60Hz / 120Hz)
  useEffect(() => {
    if (!interactiveTilt) return;

    let running = true;
    const animate = () => {
      if (!running) return;

      if (!isFlipping) {
        // Fluid metallic spring damping: tracks phone tilt closely while removing micro-jitter
        const lerpFactor = isTouchingRef.current ? 0.32 : 0.16;
        const dx = targetTiltRef.current.x - currentTiltRef.current.x;
        const dy = targetTiltRef.current.y - currentTiltRef.current.y;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
          currentTiltRef.current.x += dx * lerpFactor;
          currentTiltRef.current.y += dy * lerpFactor;

          setTilt({
            x: Number(currentTiltRef.current.x.toFixed(2)),
            y: Number(currentTiltRef.current.y.toFixed(2)),
          });
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [interactiveTilt, isFlipping]);

  // Hardware Gyroscope / Accelerometer listener (phone movement)
  useEffect(() => {
    if (!interactiveTilt) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isFlipping || isTouchingRef.current) return;
      if (e.beta === null || e.gamma === null) return;

      isGyroActiveRef.current = true;

      // Natural portrait resting angle when looking at phone in hand is ~42° pitch
      const restingBeta = 42;
      const rawBetaDelta = e.beta - restingBeta;

      // Generous responsive scaling: 1° of phone rotation produces ~1.35° of card tilt, clamped to ±28° and ±34°
      const targetX = Math.max(-28, Math.min(28, -rawBetaDelta * 1.35));
      const targetY = isFlipped
        ? Math.max(-34, Math.min(34, -e.gamma * 1.5))
        : Math.max(-34, Math.min(34, e.gamma * 1.5));

      targetTiltRef.current = { x: targetX, y: targetY };
    };

    window.addEventListener("deviceorientation", handleOrientation, { passive: true });

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [interactiveTilt, isFlipping, isFlipped]);

  // iOS Safari requires DeviceOrientationEvent permission initiated from a user gesture
  const enableMotionOnGesture = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function"
    ) {
      try {
        await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
      } catch {
        // Handled silently
      }
    }
  };

  const toggleFlip = () => {
    if (isFlipping) return;
    enableMotionOnGesture();
    const next = !isFlipped;
    setIsFlipped(next);
    setIsFlipping(true);
    targetTiltRef.current = { x: 0, y: 0 };
    currentTiltRef.current = { x: 0, y: 0 };
    setTilt({ x: 0, y: 0 }); // Clean vertical axis rotation
    if (onFlipChange) onFlipChange(next);

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      setIsFlipping(false);
    }, 750);
  };

  // Sync activeFace if controlled from parent
  useEffect(() => {
    if (activeFace === "back" && !isFlipped) {
      toggleFlip();
    } else if (activeFace === "front" && isFlipped) {
      toggleFlip();
    }
  }, [activeFace]);

  // Touch drag for mobile interaction
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    enableMotionOnGesture();
    if (e.touches.length !== 1) return;
    isTouchingRef.current = true;
    hasMovedTouchRef.current = false;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactiveTilt || isFlipping || !isTouchingRef.current) return;
    if (e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;

    if (Math.hypot(dx, dy) > 8) {
      hasMovedTouchRef.current = true;
    }

    const maxDragDist = 90;
    const normX = Math.max(-1, Math.min(1, dx / maxDragDist));
    const normY = Math.max(-1, Math.min(1, dy / maxDragDist));

    targetTiltRef.current = {
      x: normY * -28,
      y: isFlipped ? normX * -34 : normX * 34,
    };
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    if (!hasMovedTouchRef.current) {
      // Clean tap without drag triggers flip
      toggleFlip();
    } else {
      // If phone gyro is not providing values, return gently to center
      if (!isGyroActiveRef.current) {
        targetTiltRef.current = { x: 0, y: 0 };
      }
    }
  };

  // Mouse hover tilt for desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt || isFlipping) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const yNorm = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetTiltRef.current = {
      x: isFlipped ? yNorm * 22 : yNorm * -22,
      y: isFlipped ? xNorm * -26 : xNorm * 26,
    };
  };

  const handleMouseLeave = () => {
    if (!isFlipping && !isGyroActiveRef.current) {
      targetTiltRef.current = { x: 0, y: 0 };
    }
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

  // 5 Master Luxury Finishes: Silver, Gold, Royal Red, Pitch Black, Cobalt Blue
  const finishStyles = {
    silver: {
      id: "silver",
      name: "Silver",
      bg: "bg-[#B8C2D1]",
      border: "border-[#7E8B9E]/70",
      textPrimary: "text-[#000000] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-semibold",
      textSecondary: "text-[#1A1E26] font-medium",
      accentHex: "#000000",
      gradient: "from-[#7E8899] via-[#E2E8F2] via-[#A2ADC0] via-[#FFFFFF] via-[#C8D1E0] to-[#8E98AA]",
      shimmer: "rgba(255, 255, 255, 0.75)",
      glow: "shadow-[0_24px_60px_rgba(0,0,0,0.9),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(0,0,0,0.3)]",
      glaze: "from-white/[0.5] via-transparent to-black/[0.15]",
      logoFilter: "brightness-0 opacity-100",
      logoBlend: "multiply" as const,
      qrBezel: "border-[#687588] bg-[#F2F5F9] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.8)]",
      qrReticle: "border-black/30",
      qrLabel: "text-[#2A303C]",
    },
    gold: {
      id: "gold",
      name: "Gold",
      bg: "bg-[#181002]",
      border: "border-[#F5D061]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#FFFFFF] font-normal",
      accentHex: "#FFFFFF",
      gradient: "from-[#1C1202] via-[#483006] via-[#94721A] via-[#ECC968] via-[#5A3F0C] via-[#1A1002] to-[#382607]",
      shimmer: "rgba(245, 208, 97, 0.45)",
      glow: "shadow-[0_24px_60px_rgba(0,0,0,0.95),inset_0_2px_3px_rgba(255,240,180,0.7),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-[#FFF2CC]/[0.35] via-transparent to-[#D8B466]/[0.2]",
      logoFilter: "sepia-[0.7] brightness-135 contrast-120 drop-shadow-[0_0_12px_rgba(245,208,97,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#ECC968] bg-[#FFFDF5] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(245,208,97,0.5)]",
      qrReticle: "border-[#ECC968]/50",
      qrLabel: "text-[#D8B466]",
    },
    royal_red: {
      id: "royal_red",
      name: "Royal Red",
      bg: "bg-[#180004]",
      border: "border-[#FF2A55]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#FFFFFF] font-normal",
      accentHex: "#FFFFFF",
      gradient: "from-[#1C0005] via-[#4E020E] via-[#9E1026] via-[#F0264B] via-[#580312] via-[#180004] to-[#35010A]",
      shimmer: "rgba(255, 42, 85, 0.45)",
      glow: "shadow-[0_24px_60px_rgba(0,0,0,0.95),inset_0_2px_3px_rgba(255,180,195,0.7),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.3] via-transparent to-[#FF2A55]/[0.25]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_12px_rgba(255,100,130,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#FF2A55]/80 bg-[#FFFFFF] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,100,130,0.4)]",
      qrReticle: "border-[#FF2A55]/50",
      qrLabel: "text-[#FF8099]",
    },
    pitch_black: {
      id: "pitch_black",
      name: "Pitch Black",
      bg: "bg-[#000000]",
      border: "border-white/25",
      textPrimary: "text-[#FFFFFF] drop-shadow-sm font-normal",
      textSecondary: "text-[#D0D0DC] font-normal",
      accentHex: "#FFFFFF",
      gradient: "from-[#000000] via-[#050508] to-[#000000]",
      shimmer: "rgba(255, 255, 255, 0.35)",
      glow: "shadow-[0_24px_60px_rgba(0,0,0,0.98),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.95)]",
      glaze: "from-white/[0.16] via-transparent to-white/[0.04]",
      logoFilter: "brightness-115 contrast-105 drop-shadow-[0_0_14px_rgba(255,255,255,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-white/30 bg-[#FFFFFF] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.15)]",
      qrReticle: "border-white/30",
      qrLabel: "text-[#A0A0AA]",
    },
    cobalt_blue: {
      id: "cobalt_blue",
      name: "Cobalt Blue",
      bg: "bg-[#030B1C]",
      border: "border-[#0077EE]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#7EB5F0] font-normal",
      accentHex: "#0077EE",
      gradient: "from-[#020A18] via-[#08224E] via-[#0C387C] via-[#1457B8] via-[#0A2656] via-[#020A18] to-[#051630]",
      shimmer: "rgba(0, 120, 240, 0.45)",
      glow: "shadow-[0_24px_60px_rgba(0,0,0,0.95),inset_0_2px_3px_rgba(100,180,255,0.6),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.28] via-transparent to-[#0088FF]/[0.22]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_12px_rgba(100,180,255,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#0088FF]/80 bg-[#FFFFFF] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(100,180,255,0.4)]",
      qrReticle: "border-[#0088FF]/50",
      qrLabel: "text-[#7EB5F0]",
    },
  }[normalizedFinish];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-3 px-2 max-w-full overflow-visible">
      {/* 3D Perspective Flip Container */}
      <div
        className="w-[250px] h-[395px] min-[360px]:w-[270px] min-[360px]:h-[425px] sm:w-[310px] sm:h-[490px] md:w-[325px] md:h-[510px] max-w-full cursor-pointer group relative touch-manipulation"
        style={{
          perspective: "1200px",
          WebkitPerspective: "1200px",
        }}
        onClick={() => {
          if (typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches) {
            toggleFlip();
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
            transition: isFlipping
              ? "transform 750ms cubic-bezier(0.4, 0.0, 0.2, 1)"
              : "none",
            willChange: "transform",
          }}
        >
          {/* ============================================================ */}
          {/* SIDE 1: FRONT FACE (NXC Phoenix Logo & Metal Branding)     */}
          {/* ============================================================ */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[16px] sm:rounded-[18px] p-5 sm:p-7 flex flex-col justify-between border ${finishStyles.border} ${finishStyles.glow} bg-gradient-to-br ${finishStyles.gradient}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(1.5px)",
              WebkitTransform: "translateZ(1.5px)",
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              pointerEvents: isFlipped ? "none" : "auto",
            }}
          >
            {/* Fine Brushed Texture / Metallic Grain */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay rounded-[16px] sm:rounded-[18px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
              }}
            />

            {/* High-Gloss Diagonal Glaze & Reflection */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${finishStyles.glaze} pointer-events-none rounded-[16px] sm:rounded-[18px]`} />

            {/* Dynamic Interactive Specular Glare (Reacts smoothly to cursor and phone movement) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 group-hover:opacity-75 rounded-[16px] sm:rounded-[18px]"
              style={{
                background: `radial-gradient(circle 260px at ${50 + (tilt.y / 34) * 36}% ${50 + (tilt.x / 28) * 36}%, ${finishStyles.shimmer}, transparent 70%)`,
              }}
            />

            {/* Top Bar: Brand Title & NFC Symbol */}
            <div className="relative flex items-center justify-between">
              <span className={`font-cinzel text-[11px] sm:text-xs font-semibold tracking-[0.32em] uppercase ${finishStyles.textPrimary}`}>
                NXC VERSE
              </span>

              {/* Contactless Wave */}
              <div className={finishStyles.textSecondary}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current filter drop-shadow-sm" fill="none" viewBox="0 0 24 24">
                  <path d="M12 4c4.418 0 8 3.582 8 8s-3.582 8-8 8" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M12 8c2.209 0 4 1.791 4 4s-1.791 4-4 4" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Center: Main NXC Official Emblem */}
            <div className="relative w-44 h-56 sm:w-50 sm:h-64 mx-auto my-auto flex items-center justify-center">
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
            className={`absolute inset-0 w-full h-full rounded-[16px] sm:rounded-[18px] p-5 sm:p-7 flex flex-col justify-between border ${finishStyles.border} ${finishStyles.glow} bg-gradient-to-br ${finishStyles.gradient}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1.5px)",
              WebkitTransform: "rotateY(180deg) translateZ(1.5px)",
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              pointerEvents: isFlipped ? "auto" : "none",
            }}
          >
            {/* Brushed Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay rounded-[16px] sm:rounded-[18px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
              }}
            />

            {/* High-Gloss Diagonal Glaze & Reflection */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${finishStyles.glaze} pointer-events-none rounded-[16px] sm:rounded-[18px]`} />

            {/* Dynamic Interactive Specular Glare */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 group-hover:opacity-75 rounded-[16px] sm:rounded-[18px]"
              style={{
                background: `radial-gradient(circle 260px at ${50 + (tilt.y / 34) * 36}% ${50 + (tilt.x / 28) * 36}%, ${finishStyles.shimmer}, transparent 70%)`,
              }}
            />

            {/* Top Bar: Company Name & NFC Chip UID */}
            <div className="relative flex items-center justify-between pb-2.5 sm:pb-3 border-b border-black/10 dark:border-white/10">
              <span
                className={cn(
                  "text-[10px] sm:text-[11px] font-medium tracking-[0.2em] sm:tracking-[0.24em] uppercase truncate max-w-[160px]",
                  fontStyle === "cinzel" && "font-cinzel",
                  fontStyle === "sans" && "font-sans font-semibold tracking-[0.16em]",
                  fontStyle === "mono" && "font-mono font-medium tracking-[0.18em]",
                  finishStyles.textPrimary
                )}
              >
                {company.toUpperCase()}
              </span>
              <span className={`font-mono text-[9px] sm:text-[10px] font-medium tracking-widest shrink-0 ${finishStyles.textSecondary}`}>
                04:A2:8F:E1:99
              </span>
            </div>

            {/* Center Area: Name & Position (Natural text flow, no line-splitting bug), then Real Scannable QR */}
            <div className="relative flex flex-col items-center text-center space-y-2.5 sm:space-y-3.5 my-auto">
              {/* Identity Personalization (Natural wrapping, max 2 lines) */}
              <div className="space-y-0.5 sm:space-y-1 max-w-[230px]">
                <h3
                  className={cn(
                    "text-base min-[360px]:text-lg sm:text-xl uppercase leading-snug line-clamp-2",
                    fontStyle === "cinzel" && "font-cinzel font-medium tracking-[0.14em]",
                    fontStyle === "sans" && "font-sans font-bold tracking-[0.06em]",
                    fontStyle === "mono" && "font-mono font-semibold tracking-[0.12em]",
                    finishStyles.textPrimary
                  )}
                >
                  {name}
                </h3>
                <p
                  className={cn(
                    "text-[10px] sm:text-[11px] uppercase",
                    fontStyle === "cinzel" && "font-sans font-medium tracking-[0.18em]",
                    fontStyle === "sans" && "font-sans font-medium tracking-[0.14em]",
                    fontStyle === "mono" && "font-mono font-normal tracking-[0.16em]",
                    finishStyles.textSecondary
                  )}
                >
                  {designation}
                </p>
              </div>

              {/* Recessed CNC-Milled Laser QR Matrix (Clean, Pure QR Inlay at Perfect Proportion) */}
              <div className="relative flex flex-col items-center">
                {/* Recessed Inset Compartment */}
                <div className={`p-1.5 sm:p-2 rounded-[10px] sm:rounded-[12px] border ${finishStyles.qrBezel} relative`}>
                  <div className="w-[96px] h-[96px] min-[360px]:w-[106px] min-[360px]:h-[106px] sm:w-[124px] sm:h-[124px] relative flex items-center justify-center p-0.5 sm:p-1">
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrDataUrl}
                        alt="Real Digital Profile QR Code"
                        className="w-full h-full object-contain pointer-events-none select-none rounded-[3px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/10 animate-pulse rounded" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Custom Engraving / Serial Line */}
            <div className="relative pt-2.5 sm:pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-center text-[9px]">
              <span
                className={cn(
                  "uppercase truncate max-w-[220px]",
                  fontStyle === "cinzel" && "font-mono tracking-[0.25em]",
                  fontStyle === "sans" && "font-sans font-semibold tracking-[0.2em]",
                  fontStyle === "mono" && "font-mono tracking-[0.22em]",
                  finishStyles.textSecondary
                )}
              >
                {engraving}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flip Trigger Button Below Card (44px min touch height on mobile) */}
      {showFlipButton && (
        <button
          type="button"
          onClick={toggleFlip}
          disabled={isFlipping}
          className="mt-3.5 min-h-[40px] px-4 py-2 rounded-full bg-[#121217] border border-white/10 hover:border-white/25 text-xs font-mono text-[#A0A0AA] hover:text-white flex items-center gap-2 transition-all shadow-sm active:scale-95 btn-interactive disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-700 ease-in-out ${isFlipped ? "rotate-180 text-white" : ""}`} />
          <span>{isFlipped ? "Show Front (Logo)" : "Flip Card (QR Side)"}</span>
        </button>
      )}
    </div>
  );
}
