"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import {
  ArrowUpRight,
  Check,
  Sparkles,
  ChevronRight,
  Shield,
  Radio,
  Zap,
} from "lucide-react";

export function MaterialShowcase() {
  const [activeFinish, setActiveFinish] = useState<"silver" | "gold" | "royal_red" | "pitch_black" | "cobalt_blue">("cobalt_blue");

  const finishes = [
    {
      id: "silver" as const,
      name: "Silver",
      tier: "Metal Edition",
      description: "High-specular electroplated liquid silver alloy with laser-milled solid pitch black crest & typography.",
      hex: "#DDE2EA",
      accent: "#000000",
      glowColor: "rgba(220, 230, 245, 0.35)",
      borderColor: "border-white/60",
      activeGlow: "shadow-[0_0_25px_rgba(220,230,245,0.3),inset_0_1px_1px_rgba(255,255,255,0.6)]",
      gradient: "from-[#7E8899] via-[#E2E8F2] to-[#8E98AA]",
    },
    {
      id: "gold" as const,
      name: "Gold",
      tier: "Atelier Bespoke",
      description: "Infused 24K warm royal gold finish with brushed champagne luster, warm ambient glow, and diamond-cut edges.",
      hex: "#F5D061",
      accent: "#181002",
      glowColor: "rgba(245, 208, 97, 0.4)",
      borderColor: "border-[#F5D061]/80",
      activeGlow: "shadow-[0_0_30px_rgba(245,208,97,0.35),inset_0_1px_1px_rgba(255,240,180,0.5)]",
      gradient: "from-[#483006] via-[#ECC968] to-[#382607]",
    },
    {
      id: "royal_red" as const,
      name: "Royal Red",
      tier: "Atelier Bespoke",
      description: "Deep crimson ruby metallic body with high-gloss specular reflections, silver crest, and executive prestige.",
      hex: "#FF2A55",
      accent: "#FFFFFF",
      glowColor: "rgba(255, 42, 85, 0.4)",
      borderColor: "border-[#FF2A55]/80",
      activeGlow: "shadow-[0_0_30px_rgba(255,42,85,0.35),inset_0_1px_1px_rgba(255,180,195,0.5)]",
      gradient: "from-[#4E020E] via-[#F0264B] to-[#35010A]",
    },
    {
      id: "pitch_black" as const,
      name: "Pitch Black",
      tier: "Metal Edition",
      description: "High-gloss mirror piano pitch black metal (#000000) with brilliant laser-etched platinum phoenix emblem.",
      hex: "#000000",
      accent: "#FFFFFF",
      glowColor: "rgba(255, 255, 255, 0.25)",
      borderColor: "border-white/50",
      activeGlow: "shadow-[0_0_25px_rgba(255,255,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]",
      gradient: "from-[#000000] via-[#1A1A22] to-[#000000]",
    },
    {
      id: "cobalt_blue" as const,
      name: "Cobalt Blue",
      tier: "Metal Edition",
      description: "Deep oceanic cobalt metal finish with high-gloss sapphire specular reflections, vibrant luster, and electric blue halo.",
      hex: "#0088FF",
      accent: "#FFFFFF",
      glowColor: "rgba(0, 140, 255, 0.45)",
      borderColor: "border-[#0088FF]/90",
      activeGlow: "shadow-[0_0_35px_rgba(0,140,255,0.4),inset_0_1px_1px_rgba(100,180,255,0.6)]",
      gradient: "from-[#08224E] via-[#1457B8] to-[#051630]",
    },
  ] as const;

  const current = finishes.find((f) => f.id === activeFinish) || finishes[0];

  return (
    <section id="products" className="w-full py-28 px-4 sm:px-6 md:px-10 bg-[#000000] border-y border-white/[0.08] relative overflow-hidden">
      {/* Dynamic Ambient Edge Lighting Spotlights */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#0066FF]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#0033AA]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        {/* Section Header */}
        <div className="text-left max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#0099FF]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#00A2FF]" />
            <span className="font-mono text-[10px] text-[#80D0FF] uppercase tracking-[0.25em] font-semibold">
              THE METALLURGY GALLERY
            </span>
          </div>
          <h2 className="font-cinzel font-medium text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Forged in metal. Finished by hand.
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#9E9EA8] leading-relaxed">
            Select a finish to preview its dynamic metallic luster and light reflections. Click the 3D card anytime to flip between front and back faces.
          </p>
        </div>

        {/* 2 Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Dual-Sided Card Viewer */}
          <div className="lg:col-span-7 relative bg-[#040406]/90 border border-white/[0.1] rounded-[24px] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-[480px] sm:min-h-[540px] md:min-h-[620px] shadow-[0_30px_90px_rgba(0,0,0,0.98)] backdrop-blur-2xl max-w-full">
            {/* Top Glowing Hairline Accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#0099FF]/60 to-transparent" />

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
              <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#00A2FF] animate-pulse" />
                DUAL-SIDED 3D PREVIEW
              </span>
              <span className="font-mono text-xs text-white font-medium tracking-wider">
                {current.name.toUpperCase()} EDITION
              </span>
            </div>
          </div>

          {/* Right Column: High-End Material Selector Panel with Edge Lighting */}
          <div className="lg:col-span-5 space-y-4">
            {/* Master Panel Container */}
            <div className="bg-[#050508]/90 border border-white/[0.1] rounded-[24px] p-3 sm:p-4 space-y-2.5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(0,120,255,0.08)]">
              {finishes.map((f) => {
                const isActive = activeFinish === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFinish(f.id)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group btn-interactive relative overflow-hidden ${
                      isActive
                        ? `bg-[#0A0A10] ${f.borderColor} ${f.activeGlow} scale-[1.01]`
                        : "bg-white/[0.02] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Active Edge Light Sweep */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none animate-gloss-sweep" />
                    )}

                    <div className="flex items-center gap-3.5 relative z-10">
                      {/* Rich Material Swatch with Metallic Sheen */}
                      <div
                        className="w-9 h-9 rounded-xl border border-white/40 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${f.hex}, ${f.accent}22)`,
                          boxShadow: isActive ? `0 0 15px ${f.glowColor}` : "none",
                        }}
                      >
                        {/* Swatch Diagonal Specular Glaze */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/20 pointer-events-none" />

                        {/* Center Selection Symbol */}
                        {isActive && (
                          <div className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm border border-white/60 flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Finish Name & Tier Category */}
                      <div>
                        <h4 className="font-cinzel font-medium text-sm text-white tracking-wide group-hover:text-white transition-colors">
                          {f.name}
                        </h4>
                        <span className="font-mono text-[10px] text-[#7E7E8E] tracking-widest uppercase">
                          {f.tier}
                        </span>
                      </div>
                    </div>

                    {/* Right Selection Status Symbol & Badge */}
                    <div className="relative z-10 flex items-center gap-1.5">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/30 font-mono text-[10px] text-white font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                          <Sparkles className="w-3 h-3 text-[#00A2FF]" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-[#62626E] group-hover:text-white font-medium transition-colors">
                          <span>SELECT</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#52525C] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Active Finish Specification Card */}
            <div className="p-5 rounded-[22px] bg-[#050508]/90 border border-white/[0.1] space-y-4 shadow-xl backdrop-blur-2xl">
              <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                {current.description}
              </p>

              {/* Hardware Spec Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#D0D0DC] flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#00A2FF]" /> 24g Cold-Forged
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#D0D0DC] flex items-center gap-1">
                  <Radio className="w-3 h-3 text-[#00A2FF]" /> NTAG216 High Speed
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#25D366] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#25D366]" /> Lifetime Warranty
                </span>
              </div>

              {/* Primary Action Button */}
              <Link href={`/order?finish=${current.id}`} className="block btn-interactive">
                <button className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white font-sans font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(0,120,255,0.45)] hover:shadow-[0_0_35px_rgba(0,150,255,0.7)] flex items-center justify-center gap-2">
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
