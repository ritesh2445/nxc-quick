"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Sparkles,
  Layers,
  Crop,
  Sun,
  Moon,
  QrCode,
  Wifi,
  CheckCircle2,
  FileText,
  Sliders,
  RotateCw,
} from "lucide-react";
import QRCode from "qrcode";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";
import { cn } from "@/lib/utils";

interface PrintCardDesignModalProps {
  cardOrOrder: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintCardDesignModal({
  cardOrOrder,
  isOpen,
  onClose,
}: PrintCardDesignModalProps) {
  const [colorStyle, setColorStyle] = useState<"realistic" | "vectorMask">("realistic");
  const [activeSide, setActiveSide] = useState<"both" | "front" | "back">("both");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const item = cardOrOrder;

  const rawFont = item?.laserFont || "Cinzel";
  const laserFont = rawFont;
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    laserFont
  )}:wght@400;600;700;800&display=swap`;

  const orderNum = item?.orderNumber || item?.id || "NXC-2026";
  const name = (item?.engravingName || item?.customerName || "RITESH MARTAWAR").toUpperCase();
  const title = (item?.engravingTitle || item?.customerDesignation || "FOUNDER & CEO").toUpperCase();
  const company = (item?.company || item?.customerCompany || "NXC VERSE").toUpperCase();
  const subline = (item?.customEngraving || "EDITION NO. 001/100 · ATELIER BESPOKE").toUpperCase();
  const rawFinish = (item?.finish || "pitch_black").toLowerCase();
  const tier = (item?.tier || item?.variant || "METAL").toUpperCase();
  const qrSlug = item?.qrSlug || item?.username || "ritesh";
  const nfcUid = item?.nfcUid || "04:A2:8F:E1:99:3B:80";

  // Generate real scannable QR Code URL
  useEffect(() => {
    if (!isOpen) return;
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
        console.error("Failed to generate real card QR code", err);
      });
  }, [isOpen, qrSlug]);

  if (!isOpen || !cardOrOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  // Map finish to canonical 5 luxury metal finishes matching InteractiveFlippableCard
  const normalizedFinish: "silver" | "gold" | "royal_red" | "pitch_black" | "cobalt_blue" =
    rawFinish === "mirror" || rawFinish === "titanium" || rawFinish === "silver"
      ? "silver"
      : rawFinish === "champagne" || rawFinish === "gold"
      ? "gold"
      : rawFinish === "royal_red"
      ? "royal_red"
      : rawFinish === "midnight" || rawFinish === "carbon" || rawFinish === "matte_black" || rawFinish === "cobalt_blue"
      ? "cobalt_blue"
      : "pitch_black";

  // Real Authentic Finish Styles from InteractiveFlippableCard
  const finishStyles = {
    silver: {
      name: "Silver Chromium",
      bg: "bg-[#B8C2D1]",
      border: "border-[#7E8B9E]/70",
      textPrimary: "text-[#000000] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-semibold",
      textSecondary: "text-[#1A1E26] font-medium",
      gradient: "from-[#7E8899] via-[#E2E8F2] via-[#A2ADC0] via-[#FFFFFF] via-[#C8D1E0] to-[#8E98AA]",
      shimmer: "rgba(255, 255, 255, 0.75)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.5),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(0,0,0,0.3)]",
      glaze: "from-white/[0.5] via-transparent to-black/[0.15]",
      logoFilter: "brightness-0 opacity-100",
      logoBlend: "multiply" as const,
      qrBezel: "border-[#687588] bg-[#F2F5F9] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.8)]",
      divider: "border-black/20",
    },
    gold: {
      name: "24K Champagne Gold",
      bg: "bg-[#181002]",
      border: "border-[#F5D061]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#ECC968] font-normal",
      gradient: "from-[#1C1202] via-[#483006] via-[#94721A] via-[#ECC968] via-[#5A3F0C] via-[#1A1002] to-[#382607]",
      shimmer: "rgba(245, 208, 97, 0.45)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,240,180,0.7),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-[#FFF2CC]/[0.35] via-transparent to-[#D8B466]/[0.2]",
      logoFilter: "sepia-[0.7] brightness-135 contrast-120 drop-shadow-[0_0_12px_rgba(245,208,97,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#ECC968] bg-[#FFFDF5] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(245,208,97,0.5)]",
      divider: "border-[#ECC968]/30",
    },
    royal_red: {
      name: "Royal Red PVD",
      bg: "bg-[#180004]",
      border: "border-[#FF2A55]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#FF8099] font-normal",
      gradient: "from-[#1C0005] via-[#4E020E] via-[#9E1026] via-[#F0264B] via-[#580312] via-[#180004] to-[#35010A]",
      shimmer: "rgba(255, 42, 85, 0.45)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,180,195,0.7),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.3] via-transparent to-[#FF2A55]/[0.25]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_12px_rgba(255,100,130,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#FF2A55]/80 bg-[#FFFFFF] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,100,130,0.4)]",
      divider: "border-[#FF2A55]/30",
    },
    pitch_black: {
      name: "Pitch Black PVD",
      bg: "bg-[#000000]",
      border: "border-white/25",
      textPrimary: "text-[#FFFFFF] drop-shadow-sm font-normal",
      textSecondary: "text-[#D0D0DC] font-normal",
      gradient: "from-[#000000] via-[#050508] to-[#000000]",
      shimmer: "rgba(255, 255, 255, 0.35)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.95),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.95)]",
      glaze: "from-white/[0.16] via-transparent to-white/[0.04]",
      logoFilter: "brightness-115 contrast-105 drop-shadow-[0_0_14px_rgba(255,255,255,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-white/30 bg-[#FFFFFF] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.15)]",
      divider: "border-white/15",
    },
    cobalt_blue: {
      name: "Cobalt Blue PVD",
      bg: "bg-[#030B1C]",
      border: "border-[#0077EE]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#7EB5F0] font-normal",
      gradient: "from-[#020A18] via-[#08224E] via-[#0C387C] via-[#1457B8] via-[#0A2656] via-[#020A18] to-[#051630]",
      shimmer: "rgba(0, 120, 240, 0.45)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(100,180,255,0.6),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.28] via-transparent to-[#0088FF]/[0.22]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_12px_rgba(100,180,255,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#0088FF]/80 bg-[#FFFFFF] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(100,180,255,0.4)]",
      divider: "border-[#0088FF]/30",
    },
  }[normalizedFinish];

  const isVectorMask = colorStyle === "vectorMask";

  const scheme = isVectorMask
    ? {
        name: "Laser Vector Stencil",
        bg: "bg-white",
        border: "border-2 border-black",
        textPrimary: "text-black font-bold",
        textSecondary: "text-black font-semibold",
        gradient: "from-white to-white",
        shimmer: "transparent",
        glow: "border-2 border-black",
        glaze: "",
        logoFilter: "brightness-0 opacity-100",
        logoBlend: "multiply" as const,
        qrBezel: "border-2 border-black bg-white",
        divider: "border-black",
      }
    : finishStyles;

  // Dimensions
  const isPortrait = orientation === "portrait";
  const cardWidthMm = isPortrait ? "53.98mm" : "85.60mm";
  const cardHeightMm = isPortrait ? "85.60mm" : "53.98mm";

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />

      {/* Scoped Browser Print CSS for 100% 1:1 Scale */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-card-design-root, #printable-card-design-root * {
            visibility: visible !important;
          }
          #printable-card-design-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card-1to1 {
            width: ${cardWidthMm} !important;
            height: ${cardHeightMm} !important;
            max-width: ${cardWidthMm} !important;
            max-height: ${cardHeightMm} !important;
            min-width: ${cardWidthMm} !important;
            min-height: ${cardHeightMm} !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `,
        }}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none print:p-0 print:bg-white print:static">
        <div
          id="printable-card-design-root"
          className="relative w-full max-w-4xl bg-[#09090E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white print:border-0 print:bg-white print:text-black print:rounded-none"
        >
          {/* Top Control Bar (Hidden during printing) */}
          <div className="no-print p-4 px-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/90">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-white/[0.06] text-white border border-white/10">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinzel text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  Official NXC Verse Card Print Studio
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                    {orderNum}
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  ISO/IEC 7810 ID-1 standard ({isPortrait ? "53.98 × 85.60 mm" : "85.60 × 53.98 mm"})
                </p>
              </div>
            </div>

            {/* Print Mode & Orientation Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Orientation Selector */}
              <div className="flex items-center bg-neutral-900 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setOrientation("portrait")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    orientation === "portrait"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="NXC Signature Vertical Metal Card"
                >
                  Portrait (Vertical)
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation("landscape")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    orientation === "landscape"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Traditional Horizontal Card"
                >
                  Landscape
                </button>
              </div>

              {/* Style selector */}
              <div className="flex items-center bg-neutral-900 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setColorStyle("realistic")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    colorStyle === "realistic"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Metallic Render
                </button>
                <button
                  type="button"
                  onClick={() => setColorStyle("vectorMask")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    colorStyle === "vectorMask"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Laser Vector Mask
                </button>
              </div>

              {/* Side selector */}
              <div className="hidden sm:flex items-center bg-neutral-900 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveSide("both")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeSide === "both"
                      ? "bg-neutral-800 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Both
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide("front")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeSide === "front"
                      ? "bg-neutral-800 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide("back")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeSide === "back"
                      ? "bg-neutral-800 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Back
                </button>
              </div>

              {/* Print CTA */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-sm active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print 1:1 Card</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Layout Sheet */}
          <div className="p-6 sm:p-8 space-y-6 print:p-4 print:space-y-4">
            {/* Header info in print sheet */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 print:border-neutral-300">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 print:text-neutral-600 block">
                  NXC VERSE · ATELIER BESPOKE HARDWARE SPECIFICATION
                </span>
                <div className="font-cinzel text-xl font-bold text-white print:text-black mt-0.5">
                  {name}
                </div>
                <div className="text-xs font-mono text-neutral-400 print:text-neutral-600">
                  {orderNum} · Finish:{" "}
                  <strong className="text-white print:text-black uppercase">
                    {finishStyles.name}
                  </strong>{" "}
                  · Font:{" "}
                  <strong className="text-white print:text-black">{laserFont}</strong>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-neutral-400 print:text-neutral-600">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 print:border-black print:text-black text-[10px] uppercase font-semibold">
                  {tier} EDITION
                </span>
                <div className="text-[11px] mt-1.5">
                  Scale:{" "}
                  <strong>
                    1:1 ({isPortrait ? "53.98 × 85.60 mm" : "85.60 × 53.98 mm"})
                  </strong>
                </div>
              </div>
            </div>

            {/* Cards Preview Grid */}
            <div className={`flex flex-wrap gap-8 justify-center items-start`}>
              {/* ============================================================ */}
              {/* SIDE 1: FRONT FACE (NXC Phoenix Logo & Metal Branding)     */}
              {/* ============================================================ */}
              {(activeSide === "both" || activeSide === "front") && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-between w-full text-xs font-mono text-neutral-400 mb-2 print:text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-300 print:text-black" />
                      FRONT (OBVERSE) · 1:1 REAL SCALE
                    </span>
                    <span className="text-[10px]">CORNER: 3.18mm</span>
                  </div>

                  {/* 1:1 Physical Scale Front Card */}
                  <div
                    className={`relative rounded-[12px] border transition-all duration-300 overflow-hidden flex flex-col justify-between print-card-1to1 ${
                      scheme.bg
                    } ${scheme.border} ${scheme.glow} ${
                      isVectorMask ? "border-2 border-black" : "bg-gradient-to-br " + scheme.gradient
                    }`}
                    style={{
                      width: cardWidthMm,
                      height: cardHeightMm,
                      padding: isPortrait ? "4.5mm 4mm" : "4mm 5mm",
                    }}
                  >
                    {/* Metallic Glaze & Shimmer (Realistic Mode) */}
                    {!isVectorMask && (
                      <>
                        <div
                          className={`absolute inset-0 bg-gradient-to-tr ${scheme.glaze} pointer-events-none rounded-[12px]`}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay rounded-[12px]"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
                          }}
                        />
                      </>
                    )}

                    {/* Laser Vector Crosshairs (In Vector Mask Mode) */}
                    {isVectorMask && (
                      <>
                        <div className="absolute top-1 left-1 text-[7px] font-mono text-black font-bold">
                          + (0,0)
                        </div>
                        <div className="absolute bottom-1 right-1 text-[7px] font-mono text-black font-bold">
                          + ({isPortrait ? "54, 85.6" : "85.6, 54"})
                        </div>
                        <div
                          className="absolute inset-0 border border-dashed border-neutral-400 pointer-events-none"
                          style={{ margin: "3mm" }}
                        />
                      </>
                    )}

                    {/* Top Bar: NXC VERSE & Contactless Wave */}
                    <div className="relative flex items-center justify-between z-10">
                      <span
                        className={`font-cinzel ${
                          isPortrait ? "text-[8px]" : "text-[10px]"
                        } font-semibold tracking-[0.32em] uppercase ${scheme.textPrimary}`}
                      >
                        NXC VERSE
                      </span>

                      {/* Contactless Wave Icon */}
                      <div className={scheme.textSecondary}>
                        <svg
                          className={`${
                            isPortrait ? "w-3 h-3" : "w-4 h-4"
                          } stroke-current filter drop-shadow-sm`}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 4c4.418 0 8 3.582 8 8s-3.582 8-8 8"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 8c2.209 0 4 1.791 4 4s-1.791 4-4 4"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        </svg>
                      </div>
                    </div>

                    {/* Center: Real NXC Official Phoenix Emblem */}
                    <div className="relative mx-auto my-auto flex items-center justify-center z-10 w-full flex-1 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={NXC_LOGO_DATA_URI}
                        alt="NXC Verse Official Logo"
                        style={{
                          mixBlendMode: scheme.logoBlend,
                          maxHeight: isPortrait ? "42mm" : "28mm",
                        }}
                        className={`max-w-full object-contain pointer-events-none select-none ${scheme.logoFilter}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SIDE 2: BACK FACE (Name, Designation, Real QR Code)         */}
              {/* ============================================================ */}
              {(activeSide === "both" || activeSide === "back") && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-between w-full text-xs font-mono text-neutral-400 mb-2 print:text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-neutral-300 print:text-black" />
                      BACK (REVERSE) · REAL SCANNABLE QR & CHIP
                    </span>
                    <span className="text-[10px]">ISO ID-1</span>
                  </div>

                  {/* 1:1 Physical Scale Back Card */}
                  <div
                    className={`relative rounded-[12px] border transition-all duration-300 overflow-hidden flex flex-col justify-between print-card-1to1 ${
                      scheme.bg
                    } ${scheme.border} ${scheme.glow} ${
                      isVectorMask ? "border-2 border-black" : "bg-gradient-to-br " + scheme.gradient
                    }`}
                    style={{
                      width: cardWidthMm,
                      height: cardHeightMm,
                      padding: isPortrait ? "4.5mm 4mm" : "4mm 5mm",
                    }}
                  >
                    {/* Metallic Glaze & Shimmer */}
                    {!isVectorMask && (
                      <>
                        <div
                          className={`absolute inset-0 bg-gradient-to-tr ${scheme.glaze} pointer-events-none rounded-[12px]`}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay rounded-[12px]"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
                          }}
                        />
                      </>
                    )}

                    {/* Top Bar: Company Name & NFC Chip UID */}
                    <div
                      className={`relative flex items-center justify-between pb-1 sm:pb-1.5 border-b ${scheme.divider} z-10`}
                    >
                      <span
                        className={`text-[8px] font-medium tracking-[0.2em] uppercase truncate max-w-[130px] ${scheme.textPrimary}`}
                        style={{ fontFamily: `'${laserFont}', sans-serif` }}
                      >
                        {company}
                      </span>
                      <span
                        className={`font-mono text-[7px] font-medium tracking-widest shrink-0 ${scheme.textSecondary}`}
                      >
                        {nfcUid ? nfcUid.slice(0, 14) : "04:A2:8F:E1:99"}
                      </span>
                    </div>

                    {/* Center Area: Name, Title & Real Scannable QR Code */}
                    <div className="relative flex flex-col items-center text-center space-y-1 my-auto z-10 py-1">
                      {/* Identity Details in chosen Laser Font */}
                      <div className="space-y-0.5 max-w-[180px]">
                        <h3
                          style={{ fontFamily: `'${laserFont}', sans-serif` }}
                          className={`text-xs uppercase leading-snug tracking-[0.14em] font-bold ${scheme.textPrimary}`}
                        >
                          {name}
                        </h3>
                        <p
                          style={{ fontFamily: `'${laserFont}', sans-serif` }}
                          className={`text-[7.5px] uppercase tracking-[0.16em] ${scheme.textSecondary}`}
                        >
                          {title}
                        </p>
                      </div>

                      {/* Recessed CNC-Milled Laser QR Matrix with REAL QR CODE */}
                      <div className="relative flex flex-col items-center pt-0.5">
                        <div
                          className={`p-1 rounded-[6px] border ${scheme.qrBezel} relative`}
                        >
                          <div
                            className={`${
                              isPortrait ? "w-[24mm] h-[24mm]" : "w-[22mm] h-[22mm]"
                            } relative flex items-center justify-center`}
                          >
                            {qrDataUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={qrDataUrl}
                                alt="Real Digital Profile QR Code"
                                className="w-full h-full object-contain pointer-events-none select-none rounded-[2px]"
                              />
                            ) : (
                              <div className="w-full h-full bg-black/10 animate-pulse rounded" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Custom Engraving / Serial Line */}
                    <div
                      className={`relative pt-1 border-t ${scheme.divider} flex items-center justify-center text-[6.5px] z-10`}
                    >
                      <span
                        style={{ fontFamily: `'${laserFont}', sans-serif` }}
                        className={`uppercase truncate tracking-[0.2em] ${scheme.textSecondary}`}
                      >
                        {subline}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Print Calibration Checklist & Instructions */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/5 print:border-neutral-300 print:bg-white text-xs font-mono space-y-2 text-neutral-300 print:text-neutral-800">
              <div className="flex items-center gap-1.5 text-white print:text-black font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Atelier Hardware 1:1 Print Calibration:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400 print:text-neutral-700">
                <li>
                  In your browser print dialog, select <strong>Scale: 100% (Actual Size)</strong>. Do not use &quot;Fit to Printable Area&quot;.
                </li>
                <li>
                  The printed card will match the exact physical dimensions of your metal card (<strong>{isPortrait ? "53.98 mm × 85.60 mm" : "85.60 mm × 53.98 mm"}</strong>).
                </li>
                <li>
                  The QR code links directly to the client&apos;s real live profile at{" "}
                  <strong>https://nxcverse.in/@{qrSlug}</strong> and can be scanned immediately with any smartphone camera.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
