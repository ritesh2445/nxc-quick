"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import { CardFinish } from "@/components/3d/InteractiveFlippableCard";
import { ArrowUpRight, Check, Eye } from "lucide-react";

interface DesignItem {
  id: string;
  name: string;
  category: "classic" | "metal" | "executive" | "creator" | "atelier";
  finish: CardFinish;
  material: string;
  tier: string;
  priceInr: number;
  description: string;
  features: string[];
}

export default function DesignsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalDesign, setActiveModalDesign] = useState<DesignItem | null>(null);

  const designs: DesignItem[] = [
    {
      id: "pitch-black",
      name: "Pitch Black Phoenix",
      category: "classic",
      finish: "pitch_black",
      material: "High-Gloss Piano Pitch Black",
      tier: "NXC Verse Metal",
      priceInr: 1599,
      description: "Ultra-glossy piano pitch black metal body with brilliant laser-etched silver phoenix emblem.",
      features: ["High-Gloss Piano Metal", "NTAG216 High Speed NFC", "Laser Precision QR Matrix", "2-Year Digital Profile"],
    },
    {
      id: "silver-mirror",
      name: "Liquid Silver Mirror",
      category: "metal",
      finish: "silver",
      material: "Electroplated Liquid Silver",
      tier: "NXC Verse Metal",
      priceInr: 1599,
      description: "High-specular electroplated liquid silver alloy with laser-milled dark titanium typography.",
      features: ["Electroplated Specular Finish", "Laser-Milled Dark Details", "Tactile Weight 24 grams", "2-Year Digital Profile"],
    },
    {
      id: "gold-royal",
      name: "24K Royal Gold Atelier",
      category: "atelier",
      finish: "gold",
      material: "Infused 24K Gold Alloy",
      tier: "NXC Verse Atelier",
      priceInr: 2999,
      description: "Infused 24K warm royal gold finish with brushed champagne luster and diamond-cut edges.",
      features: ["Infused 24K Royal Gold Finish", "Custom Monogram Engraving", "VIP Concierge Setup", "3-Year Priority Profile"],
    },
    {
      id: "royal-red-exec",
      name: "Royal Red Executive",
      category: "executive",
      finish: "royal_red",
      material: "Crimson Ruby Metallic Metal",
      tier: "NXC Verse Atelier",
      priceInr: 2999,
      description: "Deep crimson ruby metallic body with high-gloss specular reflections and silver crest.",
      features: ["Deep Crimson Ruby Anodizing", "Diamond-Cut Edge Chamfer", "Silver Phoenix Emblem", "3-Year Priority Profile"],
    },
    {
      id: "cobalt-blue-sovereign",
      name: "Cobalt Blue Sovereign",
      category: "metal",
      finish: "cobalt_blue",
      material: "Oceanic Cobalt Sapphire Alloy",
      tier: "NXC Verse Metal",
      priceInr: 1599,
      description: "Deep oceanic cobalt metal finish with high-gloss sapphire specular reflections and electric blue halo.",
      features: ["Deep Oceanic Cobalt Anodizing", "Sapphire Specular Light Dispersion", "Electric Blue Core Glow", "2-Year Digital Profile"],
    },
  ];

  const categories = [
    { id: "all", label: "All Works" },
    { id: "classic", label: "Classic" },
    { id: "metal", label: "Metal" },
    { id: "executive", label: "Executive" },
    { id: "atelier", label: "Atelier" },
  ];

  const filteredDesigns = selectedCategory === "all"
    ? designs
    : designs.filter((d) => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#000000] pt-24 pb-20 px-6 md:px-10 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="font-mono text-xs text-[#8E8E98] uppercase tracking-[0.25em] font-medium">
            THE HARDWARE COLLECTION
          </span>
          <h1 className="font-sans font-medium text-3xl md:text-5xl text-white tracking-tight">
            Permanent Masterpieces.
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#9E9EA8] leading-relaxed">
            Every card in the NXC Verse collection is individually manufactured to aerospace tolerances, calibrated for instant NFC contact transfer, and paired to a sovereign digital profile.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-1.5 text-xs font-sans rounded-full transition-all ${
                selectedCategory === c.id
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-[#0A0A0E] border border-white/10 text-[#9E9EA8] hover:text-white hover:border-white/30"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((d) => (
            <div
              key={d.id}
              className="group bg-[#060608] border border-white/[0.1] rounded-[14px] p-6 flex flex-col justify-between hover:border-white/30 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] hover:-translate-y-1"
            >
              <div className="space-y-6">
                {/* Dual-Sided Card Frame */}
                <div className="relative w-full bg-[#000000] border border-white/[0.08] rounded-[10px] overflow-hidden flex items-center justify-center p-4">
                  <DynamicHeroCardScene
                    finish={d.finish}
                    name="RITESH MARTAWAR"
                    designation="FOUNDER & CEO"
                    company="NXC Verse"
                    isHero={false}
                    showFlipButton={true}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#E2E0DC] tracking-widest uppercase font-medium">
                      {d.tier}
                    </span>
                    <span className="font-sans text-xs font-medium text-white">
                      ₹{d.priceInr.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <h3 className="font-sans font-semibold text-lg text-white mt-1">
                    {d.name}
                  </h3>
                  <p className="font-sans text-xs text-[#9E9EA8] mt-2 line-clamp-2">
                    {d.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center gap-3">
                <Link href={`/customize?finish=${d.finish}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full justify-center text-xs tracking-wider">
                    CUSTOMIZE THIS <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveModalDesign(d)}
                  className="text-xs"
                >
                  SPECS
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect Specs Modal */}
      <Modal
        isOpen={!!activeModalDesign}
        onClose={() => setActiveModalDesign(null)}
        title={activeModalDesign?.name}
        subtitle={`${activeModalDesign?.material} · ₹${activeModalDesign?.priceInr.toLocaleString("en-IN")}`}
      >
        {activeModalDesign && (
          <div className="space-y-6 text-left">
            <p className="font-sans text-xs text-text-secondary leading-relaxed">
              {activeModalDesign.description}
            </p>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest block">
                TECHNICAL HIGHLIGHTS:
              </span>
              {activeModalDesign.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-sans text-text-primary">
                  <Check className="w-3.5 h-3.5 text-accent-silver" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#2A2A32]">
              <Link href={`/customize?finish=${activeModalDesign.finish}`}>
                <Button variant="primary" size="lg" className="w-full justify-center">
                  CONFIGURE & ORDER THIS EDITION <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
