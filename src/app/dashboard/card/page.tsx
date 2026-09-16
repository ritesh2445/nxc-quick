"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import {
  CreditCard,
  QrCode,
  Radio,
  Download,
  Shield,
  Lock,
  Cpu,
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
    <div className="space-y-6 text-left max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#C8C6C0]" /> COMMISSIONED HARDWARE
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Card & NFC
          </h1>
          <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
            Manage your physical NFC card, laser QR matrix, and contactless security status.
          </p>
        </div>

        <Link href="/order" className="shrink-0 btn-interactive">
          <button className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-full bg-white text-black hover:bg-[#E5E5EA] text-xs font-sans font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Commission Card</span>
          </button>
        </Link>
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ============================== */}
        {/* Left: 3D Card Preview          */}
        {/* ============================== */}
        <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#C8C6C0]" /> 3D HARDWARE VIEW
            </span>
            <span className="font-mono text-[10px] text-white/70 font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10">
              PITCH BLACK
            </span>
          </div>

          {/* Card 3D Scene container */}
          <div className="w-full flex items-center justify-center overflow-hidden rounded-xl bg-[#08080C] py-6 sm:py-8 border border-white/[0.04]">
            <div className="w-full max-w-[300px]">
              <DynamicHeroCardScene
                finish="pitch_black"
                name="Ritesh Martawar"
                designation="FOUNDER & CEO"
                showFlipButton={true}
              />
            </div>
          </div>

          {/* Technical Specs */}
          <div className="border-t border-white/[0.07] pt-2 space-y-0 text-xs font-sans">
            {[
              { label: "Chassis Material", value: "High-Gloss Pitch Black Aerospace Metal" },
              { label: "NFC Chipset", value: "NTAG216 — 888 Bytes High-Cap" },
              { label: "NFC Chip UID", value: "04:A2:8F:E1:99:3B:80", mono: true, accent: true },
              { label: "Broadcasting URL", value: "nxcverse.in/@ritesh", mono: true },
            ].map(({ label, value, mono, accent }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                <span className="text-[#8E8E98]">{label}:</span>
                <span className={`${mono ? "font-mono" : "font-medium"} ${accent ? "text-white" : "text-[#D4D2CD]"} text-right ml-2 break-all max-w-[55%]`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================== */}
        {/* Right: QR + Security           */}
        {/* ============================== */}
        <div className="flex flex-col gap-6">
          {/* QR Matrix */}
          <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-cinzel font-medium text-sm sm:text-base text-white uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#C8C6C0]" /> Laser QR Matrix
              </h3>
              <span className="font-mono text-[9px] text-[#A1A1AA] uppercase font-semibold bg-white/[0.05] px-2.5 py-0.5 rounded-full border border-white/10">
                HIGH ECC
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="shrink-0 p-3 bg-white rounded-xl shadow-lg border border-white/20">
                {qrSvg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrSvg} alt="Card QR Code" className="w-28 h-28 object-contain" />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center bg-[#F0F0F0] rounded">
                    <span className="text-[#888] font-mono text-[10px]">Generating…</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-center sm:text-left w-full">
                <p className="font-sans text-xs text-[#8E8E98] leading-relaxed">
                  Precision laser engraved on the rear plate of your metal card. Permanently routes to your sovereign digital profile.
                </p>
                <button
                  onClick={downloadQrImage}
                  disabled={!qrSvg}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-full bg-white/[0.05] border border-white/15 hover:border-white/40 text-xs font-sans text-white hover:bg-white/[0.1] active:scale-[0.98] transition-all flex items-center justify-center gap-2 btn-interactive disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5 text-[#C8C6C0]" />
                  <span>Download High-Res QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hardware Security */}
          <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-cinzel font-medium text-sm sm:text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C8C6C0]" /> Hardware Security
              </h3>
              <span
                className={`font-mono text-[9px] uppercase px-2.5 py-0.5 rounded-full font-semibold border ${
                  cardLocked
                    ? "bg-red-950/40 text-red-400 border-red-800/40"
                    : "bg-emerald-950/30 text-emerald-400 border-emerald-800/40"
                }`}
              >
                {cardLocked ? "LOCKED" : "ACTIVE"}
              </span>
            </div>

            <p className="font-sans text-xs text-[#8E8E98] leading-relaxed">
              If your card is misplaced or temporarily separated, freeze NFC contactless broadcasting and QR redirection immediately. Unlock anytime with one tap.
            </p>

            <button
              onClick={() => setCardLocked(!cardLocked)}
              className={`w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 btn-interactive active:scale-[0.98] ${
                cardLocked
                  ? "bg-white text-black hover:bg-[#E5E5EA] shadow-lg"
                  : "bg-red-950/20 border border-red-900/30 hover:border-red-700/50 text-red-300"
              }`}
            >
              {cardLocked ? (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>UNLOCK HARDWARE</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>FREEZE CARD</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
