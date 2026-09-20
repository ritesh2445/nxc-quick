"use client";

import React, { useEffect } from "react";
import { X, Printer, Cpu, Crosshair, Sparkles, CheckCircle2 } from "lucide-react";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";

interface LaserSpecModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LaserSpecModal({ order, isOpen, onClose }: LaserSpecModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const laserFont = order.laserFont || "Cinzel";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    laserFont
  )}:wght@400;600;700;800&display=swap`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />

      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none print:p-0 print:bg-white">
        <div className="relative w-full max-w-3xl bg-[#09090E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white print:border-0 print:bg-white print:text-black print:rounded-none">
          {/* Top Bar (Hidden on print) */}
          <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-neutral-950/80 print:hidden">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-white" />
              <span className="font-cinzel text-sm font-bold tracking-wider">
                WORKSHOP LASER JOB SPECIFICATION
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Job Ticket</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Blueprint Sheet */}
          <div className="p-8 space-y-6 print:p-6 print:space-y-4 font-mono">
            {/* Ticket Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 print:border-neutral-300">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest print:text-neutral-500">
                  NXC ATELIER · PRECISION CNC & FIBER ENGRAVING
                </div>
                <div className="text-xl font-bold font-cinzel text-white print:text-black mt-1">
                  JOB TICKET #{order.orderNumber}
                </div>
                <div className="text-xs text-neutral-400 print:text-neutral-600 mt-0.5">
                  Specification: ISO/IEC 7810 ID-1 (85.60 x 53.98 x 0.80 mm)
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/20 text-xs font-semibold uppercase print:border-neutral-400 print:text-black">
                  {order.tier || "METAL"} EDITION
                </span>
                <div className="text-[11px] text-neutral-400 print:text-neutral-600 mt-2">
                  Finish: <strong className="text-white print:text-black uppercase">{order.finish?.replace(/_/g, " ") || "PITCH BLACK"}</strong>
                </div>
              </div>
            </div>

            {/* Visual Calibration Box with Crosshairs */}
            <div className="relative w-full aspect-[1.586] max-w-xl mx-auto rounded-xl border border-dashed border-white/20 bg-neutral-950 p-6 flex flex-col justify-between overflow-hidden print:border-neutral-400 print:bg-neutral-50">
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
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border border-white/20 p-1 flex items-center justify-center bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={NXC_LOGO_DATA_URI}
                      alt="NXC Official Emblem"
                      className="max-w-full max-h-full object-contain filter invert opacity-90"
                    />
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] font-bold tracking-widest text-white print:text-black block">
                      NXC VERSE
                    </span>
                    <span className="text-[8px] text-neutral-400 font-mono">
                      MILLING X: 12mm, Y: 12mm
                    </span>
                  </div>
                </div>

                <div className="border border-white/20 px-2 py-1 rounded text-[9px] text-neutral-300 print:text-black print:border-neutral-400 font-mono text-right">
                  <span>NTAG216 RF CAVITY</span>
                  <span className="text-[7px] text-neutral-500 block">13.56 MHz ANTENNA</span>
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

            {/* Laser Parameter Matrix */}
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

            {/* Operator Signoff */}
            <div className="pt-4 border-t border-white/10 print:border-neutral-300 flex justify-between items-center text-[11px] text-neutral-400 print:text-neutral-600">
              <div>
                Client: <strong>{order.customerName}</strong> ({order.customerPhone ? "Verified WhatsApp" : order.customerEmail})
              </div>
              <div className="border-b border-white/30 print:border-black w-40 pb-1 text-center">
                Operator Sign-Off
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
