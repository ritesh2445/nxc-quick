"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Shield,
  Radio,
  Zap,
} from "lucide-react";

export function MaterialShowcase() {
  const [activeFinish, setActiveFinish] = useState<"silver" | "gold" | "royal_red" | "pitch_black" | "cobalt_blue">("pitch_black");

  const finishes = [
    {
      id: "pitch_black" as const,
      name: "Pitch Black",
      tier: "Metal Edition",
      description: "High-gloss mirror piano pitch black metal body with brilliant laser-etched platinum phoenix emblem.",
      hex: "#000000",
      accent: "#FFFFFF",
      borderColor: "border-white/50",
      activeBg: "bg-[#0E0E12]",
      gradient: "from-[#000000] via-[#1A1A22] to-[#000000]",
    },
    {
      id: "silver" as const,
      name: "Silver",
      tier: "Metal Edition",
      description: "High-specular electroplated liquid silver alloy with laser-milled solid pitch black crest & typography.",
      hex: "#DDE2EA",
      accent: "#000000",
      borderColor: "border-white/60",
      activeBg: "bg-[#111116]",
      gradient: "from-[#7E8899] via-[#E2E8F2] to-[#8E98AA]",
    },
    {
      id: "gold" as const,
      name: "Gold",
      tier: "Atelier Bespoke",
      description: "Infused 24K warm royal gold finish with brushed champagne luster, warm ambient glow, and diamond-cut edges.",
      hex: "#F5D061",
      accent: "#181002",
      borderColor: "border-[#F5D061]/80",
      activeBg: "bg-[#141006]",
      gradient: "from-[#483006] via-[#ECC968] to-[#382607]",
    },
    {
      id: "royal_red" as const,
      name: "Royal Red",
      tier: "Atelier Bespoke",
      description: "Deep crimson ruby metallic body with high-gloss specular reflections, silver crest, and executive prestige.",
      hex: "#FF2A55",
      accent: "#FFFFFF",
      borderColor: "border-[#FF2A55]/80",
      activeBg: "bg-[#150408]",
      gradient: "from-[#4E020E] via-[#F0264B] to-[#35010A]",
    },
    {
      id: "cobalt_blue" as const,
      name: "Cobalt Blue",
      tier: "Metal Edition",
      description: "Deep oceanic cobalt metal finish with high-gloss sapphire specular reflections, vibrant luster, and executive prestige.",
      hex: "#0B3875",
      accent: "#FFFFFF",
      borderColor: "border-[#0077EE]/80",
      activeBg: "bg-[#040C1A]",
      gradient: "from-[#08224E] via-[#1457B8] to-[#051630]",
    },
  ] as const;

  const current = finishes.find((f) => f.id === activeFinish) || finishes[0];

  return (
    <section id="products" className="w-full py-20 sm:py-28 px-4 sm:px-6 md:px-10 bg-[#000000] border-y border-white/[0.08] relative overflow-hidden">
      {/* Dynamic Ambient Edge Lighting Spotlights */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 relative z-10">
        {/* Section Header */}
        <div className="text-left max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2E0DC]" />
            <span className="font-mono text-[10px] text-[#C8C6C0] uppercase tracking-[0.25em] font-semibold">
              METALLURGY GALLERY
            </span>
          </div>
          <h2 className="font-cinzel font-medium text-2xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Forged in metal. Finished by hand.
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#9E9EA8] leading-relaxed">
            Select a finish to preview its dynamic metallic luster and light reflections. Tap the 3D card anytime to flip between front and back faces.
          </p>
        </div>

        {/* 2 Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Dual-Sided Card Viewer */}
          <div className="lg:col-span-7 relative bg-[#060608] border border-white/[0.1] rounded-[24px] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px] md:min-h-[580px] shadow-[0_24px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl max-w-full">
            <DynamicHeroCardScene
              finish={activeFinish}
              name="Ritesh Martawar"
              designation="FOUNDER & CEO"
              company="NXC Verse"
              qrSlug="ritesh"
              isHero={false}
              showFlipButton={true}
            />

            <div className="w-full pt-4 mt-2 flex items-center justify-between border-t border-white/[0.08] pointer-events-none text-[11px] font-sans">
              <span className="font-mono text-[10px] text-[#A0A0AA] uppercase tracking-[0.22em] font-semibold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#E2E0DC]" />
                DUAL-SIDED 3D PREVIEW
              </span>
              <span className="font-mono text-xs text-white font-medium tracking-wider">
                {current.name.toUpperCase()} EDITION
              </span>
            </div>
          </div>

          {/* Right Column: High-End Material Selector Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Master Panel Container */}
            <div className="bg-[#08080A] border border-white/[0.1] rounded-[24px] p-3 sm:p-4 space-y-2.5 backdrop-blur-2xl shadow-xl">
              {finishes.map((f) => {
                const isActive = activeFinish === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFinish(f.id)}
                    className={`w-full min-h-[52px] p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group btn-interactive ${
                      isActive
                        ? `${f.activeBg} ${f.borderColor} shadow-md`
                        : "bg-white/[0.02] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      {/* Rich Material Swatch with Metallic Sheen */}
                      <div
                        className="w-8 h-8 rounded-lg border border-white/30 shadow-md flex items-center justify-center transition-all duration-200 group-hover:scale-105 relative overflow-hidden shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${f.hex}, ${f.accent}22)`,
                        }}
                      >
                        {isActive && (
                          <div className="w-4 h-4 rounded-full bg-black/70 border border-white/60 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Finish Name & Tier Category */}
                      <div>
                        <h4 className="font-cinzel font-medium text-sm text-white tracking-wide">
                          {f.name}
                        </h4>
                        <span className="font-mono text-[10px] text-[#7E7E8E] tracking-widest uppercase">
                          {f.tier}
                        </span>
                      </div>
                    </div>

                    {/* Right Selection Status */}
                    <div className="relative z-10 flex items-center gap-1.5">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/25 font-mono text-[10px] text-white font-medium tracking-widest uppercase">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-[#62626E] group-hover:text-white font-medium transition-colors">
                          <span>SELECT</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#52525C] group-hover:text-white" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Active Finish Specification Card */}
            <div className="p-5 rounded-[22px] bg-[#08080A] border border-white/[0.1] space-y-4 shadow-xl">
              <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                {current.description}
              </p>

              {/* Hardware Spec Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#D0D0DC] flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#A09E9A]" /> 24g Cold-Forged
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#D0D0DC] flex items-center gap-1">
                  <Radio className="w-3 h-3 text-[#A09E9A]" /> NTAG216 High Speed
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#25D366] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#25D366]" /> Lifetime Warranty
                </span>
              </div>

              {/* Primary Action Button */}
              <Link href={`/order?finish=${current.id}`} className="block btn-interactive">
                <button className="w-full min-h-[46px] py-3 rounded-full bg-white text-black font-sans font-semibold text-xs tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:bg-[#EAE8E4] flex items-center justify-center gap-2 transition-colors">
                  <span>ORDER IN {current.name.toUpperCase()}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
