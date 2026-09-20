"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Cpu,
  Crosshair,
  Sparkles,
  Radio,
  QrCode,
  Layers,
  CheckCircle2,
  FileText,
} from "lucide-react";
import QRCode from "qrcode";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";

interface LaserSpecModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LaserSpecModal({ order, isOpen, onClose }: LaserSpecModalProps) {
  const [viewMode, setViewMode] = useState<"realistic" | "blueprint">("realistic");
  const [cardSide, setCardSide] = useState<"front" | "back">("back");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !order) return;
    const targetUrl = `https://nxcverse.in/@${order.qrSlug || order.username || "ritesh"}`;
    QRCode.toDataURL(targetUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR for laser spec:", err));
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const laserFont = order.laserFont || "Cinzel";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    laserFont
  )}:wght@400;600;700;800&display=swap`;

  const handlePrint = () => {
    window.print();
  };

  const rawFinish = (order.finish || "pitch_black").toLowerCase();
  const finishKey = rawFinish.includes("gold")
    ? "gold"
    : rawFinish.includes("silver") || rawFinish.includes("chromium")
    ? "silver"
    : rawFinish.includes("red")
    ? "royal_red"
    : rawFinish.includes("blue") || rawFinish.includes("cobalt")
    ? "cobalt_blue"
    : "pitch_black";

  const finishStyles: Record<string, { bgGradient: string; border: string; textClass: string; name: string }> = {
    pitch_black: {
      name: "Pitch Black PVD",
      bgGradient: "from-[#111116] via-[#08080B] to-[#020204]",
      border: "border-white/20",
      textClass: "text-white",
    },
    gold: {
      name: "24K Champagne Gold",
      bgGradient: "from-[#2A1D06] via-[#1A1103] to-[#0F0B02]",
      border: "border-[#ECC968]/70",
      textClass: "text-[#F8E7A2]",
    },
    silver: {
      name: "Silver Chromium",
      bgGradient: "from-[#2B303A] via-[#1E222A] to-[#12151B]",
      border: "border-white/40",
      textClass: "text-white",
    },
    royal_red: {
      name: "Royal Red PVD",
      bgGradient: "from-[#33050C] via-[#200307] to-[#100103]",
      border: "border-[#FF3366]/70",
      textClass: "text-[#FFB3C6]",
    },
    cobalt_blue: {
      name: "Cobalt Blue PVD",
      bgGradient: "from-[#081C3D] via-[#051228] to-[#020914]",
      border: "border-[#0088FF]/70",
      textClass: "text-[#99D6FF]",
    },
  };

  const currentFinish = finishStyles[finishKey] || finishStyles.pitch_black;

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />

      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none print:p-0 print:bg-white">
        <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#09090E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white print:border-0 print:bg-white print:text-black print:rounded-none print:max-h-none">
          {/* Top Bar (Pinned, Hidden on print) */}
          <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-neutral-950/90 shrink-0 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="font-cinzel text-sm font-bold tracking-wider block text-white">
                  WORKSHOP LASER PRODUCTION TICKET
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Order #{order.orderNumber} · {currentFinish.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-sm font-mono"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Job Ticket</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-colors"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Strip (Print hidden) */}
          <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs font-mono print:hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 text-[11px]">Preview Mode:</span>
              <button
                onClick={() => setViewMode("realistic")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "realistic"
                    ? "bg-white text-black font-semibold"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white"
                }`}
              >
                Authentic Metal Card
              </button>
              <button
                onClick={() => setViewMode("blueprint")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "blueprint"
                    ? "bg-white text-black font-semibold"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white"
                }`}
              >
                CNC Calibration Blueprint
              </button>
            </div>

            {viewMode === "realistic" && (
              <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => setCardSide("front")}
                  className={`px-2.5 py-0.5 rounded text-[10px] ${
                    cardSide === "front" ? "bg-white text-black font-semibold" : "text-neutral-400"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setCardSide("back")}
                  className={`px-2.5 py-0.5 rounded text-[10px] ${
                    cardSide === "back" ? "bg-white text-black font-semibold" : "text-neutral-400"
                  }`}
                >
                  Back (Engraved)
                </button>
              </div>
            )}
          </div>

          {/* Scrollable Blueprint Sheet Body */}
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 font-mono print:p-6 print:space-y-4">
            {/* Ticket Header Specs */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 print:border-neutral-300">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest print:text-neutral-500">
                  NXC VERSE · PRECISION MOPA FIBER LASER ATELIER
                </div>
                <div className="text-xl font-bold font-cinzel text-white print:text-black mt-1">
                  JOB TICKET #{order.orderNumber}
                </div>
                <div className="text-xs text-neutral-400 print:text-neutral-600 mt-0.5">
                  Specification: ISO/IEC 7810 ID-1 (85.60 × 53.98 × 0.80 mm Standard)
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/20 text-xs font-semibold uppercase print:border-neutral-400 print:text-black">
                  {order.tier || "METAL"} EDITION
                </span>
                <div className="text-[11px] text-neutral-400 print:text-neutral-600 mt-2">
                  Finish: <strong className="text-white print:text-black uppercase">{currentFinish.name}</strong>
                </div>
              </div>
            </div>

            {/* Main Interactive Card Rendering (Realistic vs Blueprint) */}
            {viewMode === "realistic" ? (
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>REALISTIC BESPOKE METAL FINISH</span>
                  <span>PHYSICAL 1:1 RENDERING</span>
                </div>

                <div
                  className={`relative w-full aspect-[1.586] max-w-xl mx-auto rounded-2xl border ${currentFinish.border} bg-gradient-to-br ${currentFinish.bgGradient} p-6 flex flex-col justify-between overflow-hidden shadow-2xl select-none`}
                >
                  {/* Brushed metallic reflection sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                  {cardSide === "front" ? (
                    <>
                      <div className="flex items-start justify-between z-10">
                        <div className="flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-white/80" />
                          <span className="text-[10px] font-mono tracking-wider uppercase text-white/80">
                            NTAG216 NFC
                          </span>
                        </div>
                        <span className="font-cinzel text-xs font-bold tracking-widest text-white/90">
                          NXC VERSE
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center my-auto z-10 py-4">
                        <div className="w-20 h-20 relative flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={NXC_LOGO_DATA_URI}
                            alt="NXC Official Winged Phoenix"
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)] brightness-110"
                          />
                        </div>
                        <span className="font-cinzel text-sm font-bold tracking-[0.3em] text-white mt-2">
                          NXC VERSE
                        </span>
                        <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mt-0.5">
                          Sovereign Atelier
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 z-10 pt-2 border-t border-white/10">
                        <span>PVD VACUUM COATING</span>
                        <span>0.80MM SURGICAL STEEL</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between z-10">
                        <div>
                          <span className="font-cinzel text-xs font-bold text-white tracking-widest block">
                            {order.company || order.customerCompany || "NXC VERSE"}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-400 tracking-wider">
                            ATELIER BESPOKE NFC
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-neutral-400">
                          UID: {order.nfcUid || "04:A2:8F:E1:99:3B:80"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 my-auto z-10 py-2">
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-xl sm:text-2xl font-bold tracking-wider uppercase truncate ${currentFinish.textClass}`}
                            style={{ fontFamily: `'${laserFont}', sans-serif` }}
                          >
                            {order.engravingName || order.customerName || "RITESH MARTAWAR"}
                          </div>
                          <div
                            className="text-[11px] tracking-widest uppercase text-neutral-300 truncate mt-1"
                            style={{ fontFamily: `'${laserFont}', sans-serif` }}
                          >
                            {order.engravingTitle || order.customerDesignation || "FOUNDER & CEO"}
                          </div>
                          {order.customEngraving && (
                            <div className="text-[9px] font-mono text-neutral-400 truncate mt-1">
                              {order.customEngraving}
                            </div>
                          )}
                        </div>

                        {qrDataUrl && (
                          <div className="w-20 h-20 p-1 bg-white rounded-xl border border-white/30 shadow-lg shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={qrDataUrl}
                              alt="Scannable QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 z-10 pt-2 border-t border-white/10">
                        <span>TAP NFC OR SCAN QR</span>
                        <span>FONT: {laserFont.toUpperCase()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Technical CNC Laser Calibration Blueprint with Crosshairs */
              <div className="relative w-full aspect-[1.586] max-w-xl mx-auto rounded-xl border border-dashed border-white/30 bg-neutral-950 p-6 flex flex-col justify-between overflow-hidden print:border-neutral-400 print:bg-neutral-50 shadow-xl">
                {/* Coordinates markings */}
                <div className="absolute top-2 left-2 text-[9px] text-neutral-500 flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-neutral-400" />
                  (0.00, 0.00) ORIGIN
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] text-neutral-500">
                  (85.60, 53.98) mm
                </div>

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded border border-white/30 p-1 flex items-center justify-center bg-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={NXC_LOGO_DATA_URI}
                        alt="NXC Official Emblem"
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] brightness-110"
                      />
                    </div>
                    <div>
                      <span className="font-cinzel text-[11px] font-bold tracking-widest text-white print:text-black block">
                        NXC VERSE
                      </span>
                      <span className="text-[8.5px] text-neutral-400 font-mono">
                        VECTOR CNC: X: 12.0mm, Y: 12.0mm
                      </span>
                    </div>
                  </div>

                  <div className="border border-white/20 px-2.5 py-1 rounded text-[9px] text-neutral-300 print:text-black print:border-neutral-400 font-mono text-right">
                    <span>NTAG216 RF CAVITY</span>
                    <span className="text-[7.5px] text-neutral-500 block">13.56 MHz ANTENNA</span>
                  </div>
                </div>

                <div className="z-10 mt-auto">
                  <div className="text-[10px] text-neutral-400 print:text-neutral-700 mb-1 font-mono">
                    LASER ENGRAVING COORD [X: 12.0mm, Y: 38.5mm, FONT: {laserFont}]
                  </div>
                  <div
                    className="text-lg sm:text-2xl font-bold tracking-wider uppercase text-white print:text-black border-l-2 border-white pl-3"
                    style={{ fontFamily: `'${laserFont}', sans-serif` }}
                  >
                    {order.engravingName || order.customerName || "RITESH MARTAWAR"}
                  </div>

                  {(order.engravingTitle || order.customerDesignation) && (
                    <div
                      className="text-xs tracking-widest uppercase text-neutral-300 print:text-neutral-700 pl-3 mt-1"
                      style={{ fontFamily: `'${laserFont}', sans-serif` }}
                    >
                      {order.engravingTitle || order.customerDesignation}
                    </div>
                  )}

                  {order.customEngraving && (
                    <div className="text-[10px] text-neutral-400 print:text-neutral-600 pl-3 mt-1">
                      SUB-LINE: {order.customEngraving}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Laser Parameter Calibration Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 print:border-neutral-300 print:bg-white">
                <div className="text-neutral-400 text-[10px]">LASER SOURCE</div>
                <div className="text-white print:text-black font-semibold mt-1">MOPA Fiber 50W</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 print:border-neutral-300 print:bg-white">
                <div className="text-neutral-400 text-[10px]">MARKING SPEED</div>
                <div className="text-white print:text-black font-semibold mt-1">750 mm / sec</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 print:border-neutral-300 print:bg-white">
                <div className="text-neutral-400 text-[10px]">FREQUENCY & PASS</div>
                <div className="text-white print:text-black font-semibold mt-1">35 kHz · 3 Passes</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 print:border-neutral-300 print:bg-white">
                <div className="text-neutral-400 text-[10px]">NFC CHIP CODE</div>
                <div className="text-white print:text-black font-semibold mt-1">NTAG216 (888B)</div>
              </div>
            </div>

            {/* Operator Signoff & Notes */}
            <div className="pt-4 border-t border-white/10 print:border-neutral-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-neutral-400 print:text-neutral-600">
              <div>
                Client: <strong className="text-white print:text-black">{order.customerName || "Member"}</strong> ({order.customerPhone ? "Verified WhatsApp" : order.customerEmail || "Online"})
              </div>
              <div className="border-b border-white/30 print:border-black w-40 pb-1 text-center text-[10px]">
                CNC Quality Inspector
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
