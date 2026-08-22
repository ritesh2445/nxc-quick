"use client";

import React from "react";
import { Cpu, ShieldCheck, Zap, QrCode, Smartphone, Sparkles, Layers, RefreshCw } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      badge: "HARDWARE ENGINE",
      title: "0.1s Contactless NFC Tap",
      description:
        "High-permeability NTAG216 transceiver chip embedded within cold metal. Triggers instantaneous profile exchange on all modern iPhone & Android devices without needing any third-party app.",
    },
    {
      icon: Layers,
      badge: "AEROSPACE METALLURGY",
      title: "24g Cold-Forged Metal",
      description:
        "Engineered from solid aerospace-grade stainless steel and cold-milled titanium. Diamond-cut edge chamfering, PVD ceramic scratch-resistant shield, and IP68 waterproof immersion rating.",
    },
    {
      icon: QrCode,
      badge: "DYNAMIC MATRIX",
      title: "Laser-Milled QR Code",
      description:
        "Precision laser-etched matrix down to 10-micron tolerance. Dynamically redirects to your sovereign profile, allowing you to update numbers, titles, and links anytime without changing your physical card.",
    },
    {
      icon: Smartphone,
      badge: "DIGITAL IDENTITY",
      title: "1-Click Direct Phonebook Sync",
      description:
        "Recipients can save your complete contact card (.vcf) directly into their phone's native address book in a single tap, with full name, designation, direct dials, emails, and social handles.",
    },
    {
      icon: ShieldCheck,
      badge: "SOVEREIGN PRIVACY",
      title: "Privacy First & Live Analytics",
      description:
        "Real-time telemetry on scan counts, device distributions, and interactions. End-to-end HTTPS encrypted profile infrastructure with zero data brokering or unwanted advertising.",
    },
    {
      icon: Sparkles,
      badge: "LIFETIME VALUE",
      title: "Zero Mandatory Subscriptions",
      description:
        "A single hardware commission gives you permanent card ownership and digital identity hosting. No recurring monthly fees or paywalls to keep your primary contact card working.",
    },
  ];

  return (
    <section id="features" className="w-full py-28 md:py-36 px-6 bg-[#000000] border-t border-white/[0.08] relative overflow-hidden text-left">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#9CA8B8]/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs text-[#8E8E98] uppercase tracking-[0.25em] font-medium">
              CORE CAPABILITIES & ENGINEERING
            </span>
            <h2 className="font-sans font-medium text-3xl md:text-5xl text-white tracking-tight">
              Aerospace precision. Sovereign control.
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#9E9EA8] leading-relaxed">
              Every detail engineered to eliminate disposable paper cards forever and deliver an unforgettable tactile networking experience.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E0E12] border border-white/10 text-xs font-mono text-[#E2E0DC]">
            <Sparkles className="w-3.5 h-3.5 text-[#E2E0DC]" />
            <span>NXC HARDWARE ARCHITECTURE</span>
          </div>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#060608] hover:bg-[#0B0B0E] border border-white/[0.08] hover:border-white/25 rounded-[16px] p-7 md:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95)] hover:-translate-y-1.5"
              >
                {/* Subtle top glare highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-[10px] bg-[#0E0E12] border border-white/15 text-white shadow-inner group-hover:border-white/40 group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5 text-[#E2E0DC]" />
                    </div>
                    <span className="font-mono text-[9px] text-[#62626E] group-hover:text-[#A8A8B4] tracking-[0.2em] uppercase font-semibold transition-colors">
                      {f.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-sans font-semibold text-lg text-white group-hover:text-[#F2F0EC] transition-colors">
                      {f.title}
                    </h3>
                    <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#62626E] group-hover:text-[#9E9EA8] transition-colors">
                  <span>SPECIFICATION 0{idx + 1}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">INCLUDED →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
