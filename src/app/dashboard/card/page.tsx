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
  Sparkles,
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
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> COMMISSIONED HARDWARE
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Card & NFC
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
            Manage your physical NFC card, QR matrix, and security status.
          </p>
        </div>

        <Link href="/order" className="shrink-0 btn-interactive">
          <button className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white text-xs font-sans font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,120,255,0.35)] flex items-center justify-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Order Hardware</span>
          </button>
        </Link>
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ============================== */}
        {/* Left: 3D Card Preview          */}
        {/* ============================== */}
        <div className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> 3D HARDWARE VIEW
            </span>
            <span className="font-mono text-[10px] text-white font-medium uppercase tracking-wider">
              PITCH BLACK
            </span>
          </div>

          {/* Card 3D Scene — constrained container, no overflow */}
          <div className="w-full flex items-center justify-center overflow-hidden rounded-xl bg-[#020204]/60 py-4">
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
          <div className="border-t border-white/[0.07] pt-4 space-y-0 text-xs font-sans">
            {[
              { label: "Chassis Material", value: "High-Gloss Pitch Black Metal" },
              { label: "NFC Chipset", value: "NTAG216 — 888 Bytes" },
              { label: "NFC Chip UID", value: "04:A2:8F:E1:99:3B:80", mono: true, accent: true },
              { label: "Broadcasting URL", value: "nxcverse.in/@ritesh", mono: true },
            ].map(({ label, value, mono, accent }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                <span className="text-[#8E8E98]">{label}:</span>
                <span className={`${mono ? "font-mono" : "font-medium"} ${accent ? "text-[#00A2FF]" : "text-white"} text-right ml-2 break-all max-w-[55%]`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================== */}
        {/* Right: QR + Security           */}
        {/* ============================== */}
        <div className="flex flex-col gap-5">
          {/* QR Matrix */}
          <div className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-5 space-y-4 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-cinzel font-semibold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#00A2FF]" /> Laser QR Matrix
              </h3>
              <span className="font-mono text-[9px] text-[#00A2FF] uppercase font-semibold bg-[#0033AA]/20 px-2 py-0.5 rounded-full border border-[#0066FF]/30">
                HIGH ECC
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="shrink-0 p-2.5 bg-white rounded-xl shadow-lg border border-white/20">
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
                <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                  Precision laser engraved permanently on the back of your card. Always routes to your sovereign profile URL.
                </p>
                <button
                  onClick={downloadQrImage}
                  disabled={!qrSvg}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#0099FF]/50 text-xs font-sans text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-1.5 btn-interactive disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5 text-[#00A2FF]" />
                  <span>Download High-Res QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hardware Security */}
          <div className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-5 space-y-4 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-cinzel font-semibold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00A2FF]" /> Hardware Security
              </h3>
              <span
                className={`font-mono text-[9px] uppercase px-2.5 py-0.5 rounded-full font-semibold border ${
                  cardLocked
                    ? "bg-[#2A1C1C] text-[#FF4D70] border-[#FF2A55]/40"
                    : "bg-[#0055FF]/15 text-[#80D0FF] border-[#0099FF]/40"
                }`}
              >
                {cardLocked ? "LOCKED" : "ACTIVE"}
              </span>
            </div>

            <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
              If your card is misplaced, freeze NFC and QR redirection instantly. Unlock any time.
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
                  <Shield className="w-3.5 h-3.5" />
                  <span>UNLOCK HARDWARE</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#FF4D70]" />
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
