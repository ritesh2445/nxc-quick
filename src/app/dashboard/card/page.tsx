"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import {
  CreditCard,
  QrCode,
  Radio,
  Download,
  CheckCircle,
  Shield,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function CardDashboardPage() {
  const [qrSvg, setQrSvg] = useState<string>("");
  const [cardLocked, setCardLocked] = useState(false);

  useEffect(() => {
    fetch("/api/qr/generate?text=https://nxcverse.in/@ritesh")
      .then((res) => res.json())
      .then((data) => {
        if (data.dataUrl) setQrSvg(data.dataUrl);
      })
      .catch(() => {});
  }, []);

  const downloadQrImage = () => {
    if (!qrSvg) return;
    const a = document.createElement("a");
    a.href = qrSvg;
    a.download = "NXC_Verse_Matrix_ritesh.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> COMMISSIONED HARDWARE
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Card & NFC Management
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
            Manage your physical NFC visiting card, laser-engraved QR matrix, and security status.
          </p>
        </div>

        <Link href="/order" className="w-full sm:w-auto btn-interactive">
          <button className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white text-xs font-sans font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,120,255,0.4)] flex items-center justify-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Order Additional Hardware</span>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: 3D Card Preview */}
        <div className="lg:col-span-6 bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-6 md:p-7 space-y-5 sm:space-y-6 flex flex-col items-center shadow-2xl backdrop-blur-xl">
          <div className="w-full flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> 3D HARDWARE VIEW
            </span>
            <span className="font-mono text-xs text-white font-medium">
              PITCH BLACK EDITION
            </span>
          </div>

          <div className="w-full aspect-[4/3] max-w-[340px] flex items-center justify-center mx-auto">
            <DynamicHeroCardScene finish="pitch_black" name="Ritesh Martawar" designation="FOUNDER & CEO" />
          </div>

          {/* Technical Specs List */}
          <div className="w-full pt-4 border-t border-white/[0.08] space-y-2 text-xs font-sans">
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#8E8E98]">Chassis Material:</span>
              <span className="text-white font-medium">High-Gloss Pitch Black Metal</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#8E8E98]">NFC Chipset:</span>
              <span className="text-white font-medium">NTAG216 (888 Bytes)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#8E8E98]">NFC Chip UID:</span>
              <span className="font-mono text-[#00A2FF]">04:A2:8F:E1:99:3B:80</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#8E8E98]">Broadcasting URL:</span>
              <span className="font-mono text-white break-all">https://nxcverse.in/@ritesh</span>
            </div>
          </div>
        </div>

        {/* Right Column: QR Matrix & Security Timeline */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* QR Code Matrix Box */}
          <div className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-6 space-y-4 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-cinzel font-semibold text-sm text-white uppercase tracking-wider">
                Permanent Laser QR Matrix
              </h3>
              <span className="font-mono text-[10px] text-[#00A2FF] uppercase font-semibold">
                ERROR CORRECTION HIGH
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 pt-2">
              <div className="p-3 bg-white rounded-xl shrink-0 shadow-lg border border-white/20">
                {qrSvg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrSvg} alt="Card QR Code" className="w-32 h-32 sm:w-36 sm:h-36 object-contain" />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-black font-mono text-xs">
                    Generating...
                  </div>
                )}
              </div>

              <div className="space-y-3 text-center sm:text-left w-full">
                <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                  Precision laser engraved on the back of your card. Always points to your sovereign link.
                </p>
                <button
                  onClick={downloadQrImage}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#0099FF]/50 text-xs font-sans text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-1.5 btn-interactive"
                >
                  <Download className="w-3.5 h-3.5 text-[#00A2FF]" />
                  <span>Download High-Res QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security & Lock Controller */}
          <div className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-6 space-y-4 backdrop-blur-xl shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <h3 className="font-cinzel font-semibold text-sm text-white uppercase tracking-wider">
                Hardware Security & Lock
              </h3>
              <span className={`font-mono text-[10px] uppercase px-3 py-1 rounded-full font-semibold ${
                cardLocked ? "bg-[#2A1C1C] text-[#FF4D70] border border-[#FF2A55]/40" : "bg-[#0055FF]/15 text-[#80D0FF] border border-[#0099FF]/40"
              }`}>
                {cardLocked ? "TEMPORARILY LOCKED" : "ACTIVE BROADCASTING"}
              </span>
            </div>

            <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
              If your card is misplaced or temporarily out of your possession, you can freeze your NFC and QR redirection instantly.
            </p>

            <button
              onClick={() => setCardLocked(!cardLocked)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 btn-interactive ${
                cardLocked
                  ? "bg-gradient-to-r from-[#0055FF] to-[#00A2FF] text-white shadow-[0_0_20px_rgba(0,120,255,0.4)]"
                  : "bg-white/[0.04] border border-white/15 hover:border-[#FF2A55]/50 text-white"
              }`}
            >
              {cardLocked ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>UNLOCK PHYSICAL HARDWARE</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#FF4D70]" />
                  <span>FREEZE PHYSICAL CARD</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
