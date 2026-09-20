"use client";

import React, { useState } from "react";
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
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
} from "lucide-react";

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
  const [printMode, setPrintMode] = useState<"scale1to1" | "proofSheet" | "clientProof">("scale1to1");
  const [colorStyle, setColorStyle] = useState<"realistic" | "vectorMask">("realistic");
  const [activeSide, setActiveSide] = useState<"both" | "front" | "back">("both");

  if (!isOpen || !cardOrOrder) return null;

  const item = cardOrOrder;
  const laserFont = item.laserFont || "Cinzel";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    laserFont
  )}:wght@400;600;700;800&display=swap`;

  const orderNum = item.orderNumber || item.id || "NXC-2026";
  const name = (item.engravingName || item.customerName || "EXECUTIVE HOLDER").toUpperCase();
  const title = (item.engravingTitle || "MEMBER & CARD HOLDER").toUpperCase();
  const subline = item.customEngraving || "EDITION NO. 001/100 · ATELIER BESPOKE";
  const finish = (item.finish || "pitch_black").toLowerCase();
  const tier = (item.tier || item.variant || "METAL").toUpperCase();
  const qrSlug = item.qrSlug || "ritesh";

  const handlePrint = () => {
    window.print();
  };

  // Metallic finishes styling for realistic preview
  const getRealisticFinishStyles = () => {
    switch (finish) {
      case "pitch_black":
        return {
          bg: "bg-gradient-to-tr from-neutral-950 via-[#111116] to-neutral-950",
          border: "border-neutral-800",
          text: "text-neutral-100",
          subtext: "text-neutral-400",
          accent: "text-amber-400 border-amber-400/40",
          chip: "border-amber-400/30 bg-amber-400/10 text-amber-300",
        };
      case "silver":
        return {
          bg: "bg-gradient-to-tr from-neutral-300 via-neutral-100 to-neutral-400",
          border: "border-white",
          text: "text-neutral-900",
          subtext: "text-neutral-700",
          accent: "text-neutral-900 border-neutral-800",
          chip: "border-neutral-500 bg-neutral-300 text-neutral-900",
        };
      case "gold":
        return {
          bg: "bg-gradient-to-tr from-amber-600 via-amber-200 to-amber-700",
          border: "border-amber-300",
          text: "text-neutral-950",
          subtext: "text-amber-950",
          accent: "text-neutral-950 border-amber-900",
          chip: "border-amber-700 bg-amber-300 text-amber-950",
        };
      case "royal_red":
        return {
          bg: "bg-gradient-to-tr from-rose-950 via-red-900 to-rose-950",
          border: "border-rose-800",
          text: "text-rose-100",
          subtext: "text-rose-300",
          accent: "text-rose-200 border-rose-400",
          chip: "border-rose-400/30 bg-rose-500/10 text-rose-300",
        };
      case "cobalt_blue":
        return {
          bg: "bg-gradient-to-tr from-blue-950 via-slate-900 to-sky-950",
          border: "border-sky-800",
          text: "text-sky-100",
          subtext: "text-sky-300",
          accent: "text-sky-200 border-sky-400",
          chip: "border-sky-400/30 bg-sky-500/10 text-sky-300",
        };
      default:
        return {
          bg: "bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950",
          border: "border-neutral-800",
          text: "text-white",
          subtext: "text-neutral-400",
          accent: "text-amber-400 border-amber-400",
          chip: "border-white/20 bg-white/10 text-white",
        };
    }
  };

  const scheme = colorStyle === "realistic" ? getRealisticFinishStyles() : {
    bg: "bg-white",
    border: "border-black",
    text: "text-black",
    subtext: "text-black",
    accent: "text-black border-black",
    chip: "border-black bg-white text-black",
  };

  const isVectorMask = colorStyle === "vectorMask";

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />

      {/* Scoped Print CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-card-design-root, #printable-card-design-root * {
            visibility: visible;
          }
          #printable-card-design-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card-1to1 {
            width: 85.6mm !important;
            height: 53.98mm !important;
            max-width: 85.6mm !important;
            max-height: 53.98mm !important;
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none print:p-0 print:bg-white print:static">
        <div
          id="printable-card-design-root"
          className="relative w-full max-w-4xl bg-[#09090E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white print:border-0 print:bg-white print:text-black print:rounded-none"
        >
          {/* Top Control Bar (Hidden during printing) */}
          <div className="no-print p-4 px-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/90">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinzel text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  Print Card Design
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                    {orderNum}
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  ISO/IEC 7810 ID-1 standard (85.60 mm × 53.98 mm)
                </p>
              </div>
            </div>

            {/* Print Mode Selectors */}
            <div className="flex items-center gap-2">
              {/* Style selector */}
              <div className="flex items-center bg-neutral-900 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setColorStyle("realistic")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    colorStyle === "realistic"
                      ? "bg-amber-500 text-black font-semibold"
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
                      ? "bg-white text-black font-semibold"
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
                  Both Sides
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
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Design</span>
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
                  NXC ATELIER · HARDWARE PRINT SPECIFICATION
                </span>
                <div className="font-cinzel text-xl font-bold text-white print:text-black mt-0.5">
                  {name}
                </div>
                <div className="text-xs font-mono text-neutral-400 print:text-neutral-600">
                  {orderNum} · Finish: <strong className="text-white print:text-black uppercase">{finish.replace(/_/g, " ")}</strong> · Font: <strong className="text-amber-400 print:text-black">{laserFont}</strong>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-neutral-400 print:text-neutral-600">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 print:border-black print:text-black text-[10px] uppercase font-semibold">
                  {tier} EDITION
                </span>
                <div className="text-[11px] mt-1.5">
                  Scale: <strong>1:1 (85.60 × 53.98 mm)</strong>
                </div>
              </div>
            </div>

            {/* Cards Preview Grid */}
            <div className="space-y-6">
              {/* FRONT FACE */}
              {(activeSide === "both" || activeSide === "front") && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2 print:text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 print:text-black" />
                      FRONT DESIGN (OBVERSE) · 1:1 ACTUAL SIZE (85.60 × 53.98 mm)
                    </span>
                    <span className="text-[10px]">CORNER RADIUS: 3.18 mm</span>
                  </div>

                  {/* 1:1 Physical Scale Front Card */}
                  <div
                    className={`relative mx-auto rounded-[12px] border transition-all duration-300 overflow-hidden flex flex-col justify-between print-card-1to1 ${scheme.bg} ${scheme.border} ${
                      isVectorMask ? "border-2 border-black" : "shadow-2xl"
                    }`}
                    style={{
                      width: "85.6mm",
                      height: "53.98mm",
                      padding: "5mm",
                    }}
                  >
                    {/* Corner Crosshairs for CNC Alignment (Only in Vector Mask) */}
                    {isVectorMask && (
                      <>
                        <div className="absolute top-1 left-1 text-[7px] font-mono text-black font-bold">
                          + (0,0)
                        </div>
                        <div className="absolute bottom-1 right-1 text-[7px] font-mono text-black font-bold">
                          + (85.6, 53.98)
                        </div>
                        <div className="absolute inset-0 border border-dashed border-neutral-300 pointer-events-none" style={{ margin: "3.5mm" }} />
                      </>
                    )}

                    {/* Top Row */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center font-bold text-[9px] ${
                            isVectorMask ? "border-black text-black" : scheme.chip
                          }`}
                        >
                          N
                        </div>
                        <span className={`font-cinzel text-[11px] font-bold tracking-widest ${isVectorMask ? "text-black" : scheme.text}`}>
                          NXC ATELIER
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Wifi className={`w-3.5 h-3.5 rotate-90 ${isVectorMask ? "text-black" : scheme.subtext}`} />
                        <span className={`text-[8px] font-mono tracking-widest uppercase ${isVectorMask ? "text-black font-bold" : scheme.subtext}`}>
                          NTAG216
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Engraved Name and Title in Exact Chosen Google Font */}
                    <div className="z-10 mt-auto">
                      <div
                        className={`text-sm tracking-wider uppercase font-bold truncate leading-tight ${
                          isVectorMask ? "text-black font-extrabold" : scheme.text
                        }`}
                        style={{ fontFamily: `'${laserFont}', sans-serif` }}
                      >
                        {name}
                      </div>

                      {title && (
                        <div
                          className={`text-[9px] tracking-widest uppercase truncate mt-0.5 ${
                            isVectorMask ? "text-black font-semibold" : scheme.subtext
                          }`}
                          style={{ fontFamily: `'${laserFont}', sans-serif` }}
                        >
                          {title}
                        </div>
                      )}

                      <div
                        className={`text-[7px] font-mono tracking-wider mt-1.5 truncate ${
                          isVectorMask ? "text-neutral-700" : scheme.subtext
                        }`}
                      >
                        {subline}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BACK FACE */}
              {(activeSide === "both" || activeSide === "back") && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2 print:text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
                      BACK DESIGN (REVERSE) · NFC ANTENNA & LASER QR CODE
                    </span>
                    <span className="text-[10px]">ISO ID-1 REVERSE</span>
                  </div>

                  {/* 1:1 Physical Scale Back Card */}
                  <div
                    className={`relative mx-auto rounded-[12px] border transition-all duration-300 overflow-hidden flex flex-col justify-between print-card-1to1 ${scheme.bg} ${scheme.border} ${
                      isVectorMask ? "border-2 border-black" : "shadow-2xl"
                    }`}
                    style={{
                      width: "85.6mm",
                      height: "53.98mm",
                      padding: "5mm",
                    }}
                  >
                    {/* Top Row: Magnetic Stripe Simulation or Micro-engraved Security Line */}
                    <div className="w-full">
                      <div
                        className={`w-full h-4 rounded-sm flex items-center justify-between px-2 ${
                          isVectorMask ? "bg-black text-white" : "bg-neutral-900 border border-white/10 text-neutral-400"
                        }`}
                      >
                        <span className="text-[6px] font-mono uppercase tracking-widest">
                          HIGH-COERCIVITY ENCRYPTED NFC · 13.56 MHz
                        </span>
                        <span className="text-[6px] font-mono">ID-1 0.80MM</span>
                      </div>
                    </div>

                    {/* Middle / Bottom Content */}
                    <div className="flex items-end justify-between z-10 mt-auto">
                      <div className="space-y-1 max-w-[50mm]">
                        <div className={`font-cinzel text-[8px] font-bold tracking-wider ${isVectorMask ? "text-black" : scheme.text}`}>
                          NXC SOVEREIGN PROTOCOL
                        </div>
                        <p className={`text-[6.5px] font-mono leading-tight ${isVectorMask ? "text-neutral-800" : scheme.subtext}`}>
                          Tap physical card or scan laser QR for instant sovereign digital profile. Non-transferable atelier hardware.
                        </p>
                        <div className={`text-[7px] font-mono text-amber-400 print:text-black font-semibold pt-0.5`}>
                          https://nxcverse.in/p/{qrSlug}
                        </div>
                      </div>

                      {/* Laser Engraved QR Target */}
                      <div
                        className={`p-1.5 rounded-lg border flex flex-col items-center justify-center shrink-0 ${
                          isVectorMask ? "border-black bg-white" : "border-white/20 bg-black/40"
                        }`}
                      >
                        <div className="w-9 h-9 border border-dashed border-current flex items-center justify-center">
                          <QrCode className="w-7 h-7" />
                        </div>
                        <span className="text-[5px] font-mono uppercase mt-0.5 tracking-tighter">
                          SCAN / TAP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Print Calibration Checklist & Instructions (Hidden in 1:1 if needed, but helpful for printing) */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/5 print:border-neutral-300 print:bg-white text-xs font-mono space-y-2 text-neutral-300 print:text-neutral-800">
              <div className="flex items-center gap-1.5 text-amber-400 print:text-black font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Printer Calibration Instructions:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400 print:text-neutral-700">
                <li>In your browser print dialog, set <strong>Scale to 100% / Actual Size</strong> (do not choose &quot;Fit to Page&quot;).</li>
                <li>Verify dimensions with a physical caliper or standard credit card against the <strong>85.60 mm × 53.98 mm</strong> outline.</li>
                <li>For laser marking stencils or UV flatbed alignment, switch to <strong>Laser Vector Mask</strong> mode.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
