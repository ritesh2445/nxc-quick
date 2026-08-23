"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { Check, Shield, Zap, Sparkles, ArrowRight } from "lucide-react";

export function PricingSection() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [selectedPlan, setSelectedPlan] = useState<{
    tier: "verse" | "metal" | "atelier";
    name: string;
    price: number;
  } | null>(null);

  const [checkoutStep, setCheckoutStep] = useState<"form" | "processing" | "success">("form");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const plans = [
    {
      tier: "verse" as const,
      name: "NXC Verse",
      badge: "CLASSIC",
      priceInr: 999,
      priceUsd: 12,
      duration: "1-Year Digital Profile Included",
      description: "Obsidian matte composite body with high-density NTAG216 NFC chip and precision laser QR code.",
      features: [
        "Permanent Sovereign URL (nxcverse.in/@you)",
        "Precision NFC chip + Dynamic QR code",
        "1-Click .VCF contact sync for recipients",
        "1-Year profile hosting & edge caching",
        "Real-time contact details updating",
        "Standard analytics dashboard",
      ],
      isPopular: false,
    },
    {
      tier: "metal" as const,
      name: "NXC Verse Metal",
      badge: "MOST POPULAR",
      priceInr: 1599,
      priceUsd: 20,
      duration: "2-Year Digital Profile Included",
      description: "Solid cold-forged stainless steel and brushed titanium body with diamond-cut chamfered edges.",
      features: [
        "Aerospace Grade Metal Chassis (Titanium / Obsidian)",
        "Permanent Sovereign URL (nxcverse.in/@you)",
        "2-Year profile hosting & priority edge caching",
        "Etched silver Phoenix emblem or custom crest",
        "Full analytics (scans, device types, locations)",
        "Zero subscription fees for 2 full years",
        "Priority concierge hardware support",
      ],
      isPopular: true,
    },
    {
      tier: "atelier" as const,
      name: "NXC Verse Atelier",
      badge: "BESPOKE MASTERPIECE",
      priceInr: 2999,
      priceUsd: 38,
      duration: "3-Year Digital Profile Included",
      description: "Individually serialized bespoke metal card with hand-finished PVD coating and micro-engraving.",
      features: [
        "Hand-finished PVD Dark Obsidian / Forged Carbon",
        "Custom Monogram & Micro-engraving Included",
        "Permanent Sovereign URL (nxcverse.in/@you)",
        "3-Year profile hosting with instant updates",
        "Dedicated VIP Concierge & bespoke profile design",
        "Real-time deep analytics & geo-distribution",
        "Lifetime hardware replacement warranty",
      ],
      isPopular: false,
    },
  ];

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !customerEmail || !customerName) return;

    setCheckoutStep("processing");

    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedPlan.tier,
          currency,
          amount: selectedPlan.price,
          customerName,
          customerEmail,
          finish: selectedPlan.tier === "atelier" ? "carbon" : "obsidian",
          material: selectedPlan.tier === "verse" ? "matte" : "premium_metal",
          engravingName: customerName,
        }),
      });

      if (res.ok) {
        setCheckoutStep("success");
      } else {
        setCheckoutStep("form");
      }
    } catch {
      setCheckoutStep("form");
    }
  };

  return (
    <section id="pricing" className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#000000] relative overflow-hidden">
      {/* Radial Spotlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Header & Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-10">
          <div className="space-y-3 text-left">
            <span className="font-mono text-xs text-[#8E8E98] uppercase tracking-[0.25em] font-medium">
              ACQUISITION TIERS
            </span>
            <h2 className="font-sans font-medium text-2xl sm:text-3xl md:text-5xl text-white tracking-tight">
              Craftsmanship meets eternal identity.
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#9E9EA8]">
              A single physical investment. No recurring monthly charges.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#0E0E12] border border-white/10 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-1 text-xs font-mono rounded-full transition-all ${
                currency === "INR" ? "bg-white text-black font-semibold shadow-sm" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-1 text-xs font-mono rounded-full transition-all ${
                currency === "USD" ? "bg-white text-black font-semibold shadow-sm" : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* 3 Tier Product Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((p) => {
            const price = currency === "INR" ? p.priceInr : p.priceUsd;
            return (
              <div
                key={p.tier}
                className={`relative rounded-[20px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                  p.isPopular
                    ? "bg-[#0B0B0E] border-2 border-white/40 shadow-[0_30px_70px_rgba(0,0,0,0.98),0_0_30px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.3)] scale-[1.02]"
                    : "bg-[#060608] border border-white/[0.1] hover:border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:-translate-y-1"
                }`}
              >
                {/* Badge */}
                {p.isPopular && (
                  <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-white text-black font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_4px_15px_rgba(255,255,255,0.3)]">
                    {p.badge}
                  </div>
                )}

                <div className="space-y-6 text-left">
                  <div>
                    <span className="font-mono text-[11px] text-[#70707C] uppercase tracking-widest block mb-1">
                      {p.duration}
                    </span>
                    <h3 className="font-sans font-semibold text-2xl text-white">
                      {p.name}
                    </h3>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-medium text-4xl md:text-5xl text-white tracking-tight">
                        {formatCurrency(price, currency)}
                      </span>
                      <span className="font-sans text-xs text-[#70707C]">/ complete card</span>
                    </div>
                    <p className="font-sans text-xs text-[#9E9EA8] mt-3 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="pt-6 border-t border-white/[0.08] space-y-3">
                    <span className="font-mono text-[10px] text-[#70707C] uppercase tracking-widest block">
                      INCLUDED WITH HARDWARE:
                    </span>
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-[#E2E0DC] shrink-0 mt-0.5" />
                        <span className="font-sans text-xs text-[#9E9EA8]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-8 space-y-3">
                  <Link href={`/order?tier=${p.tier}`} className="block w-full btn-interactive">
                    <Button
                      variant={p.isPopular ? "primary" : "secondary"}
                      size="lg"
                      className={`w-full justify-center text-xs tracking-widest ${
                        p.isPopular
                          ? "bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white shadow-[0_0_25px_rgba(0,120,255,0.4)]"
                          : ""
                      }`}
                    >
                      ORDER {p.name.toUpperCase()}
                    </Button>
                  </Link>

                  <Link href={`/customize?tier=${p.tier}`} className="block text-center btn-interactive">
                    <span className="font-mono text-[10px] text-[#70707C] hover:text-[#00A2FF] tracking-wider uppercase inline-flex items-center gap-1 transition-colors">
                      Customize in Atelier <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instant Checkout Gateway Modal */}
      <Modal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        title={selectedPlan ? `Acquire ${selectedPlan.name}` : ""}
        subtitle={selectedPlan ? `${formatCurrency(selectedPlan.price, currency)} · Includes Physical Card & Digital Identity` : ""}
      >
        {checkoutStep === "form" && (
          <form onSubmit={handleOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-text-secondary uppercase tracking-wider mb-1">
                Full Name for Card Engraving
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Julian Vance"
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[6px] px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-text-secondary uppercase tracking-wider mb-1">
                Email Address (For Order & Activation)
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. julian@vancecapital.com"
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[6px] px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div className="p-3.5 rounded-[6px] bg-[#18181C] border border-[#2A2A32] flex items-center justify-between text-xs font-sans text-text-secondary">
              <span>Gateway:</span>
              <span className="font-mono text-accent-silver uppercase">
                {currency === "INR" ? "Razorpay Secure (UPI, Cards, NetBanking)" : "Stripe International"}
              </span>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                CONFIRM & PROCEED ({formatCurrency(selectedPlan?.price || 0, currency)})
              </Button>
            </div>
          </form>
        )}

        {checkoutStep === "processing" && (
          <div className="py-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent-silver border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-sans text-sm text-text-primary">Connecting to Secure Payment Gateway...</p>
            <p className="font-mono text-xs text-text-tertiary">Creating permanent sovereign record...</p>
          </div>
        )}

        {checkoutStep === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1A2E24] border border-[#26533D] text-[#6FCF97] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-lg text-text-primary">
                Order Confirmed
              </h4>
              <p className="font-sans text-xs text-text-secondary mt-1">
                Your card has been queued for precision laser engraving and dispatch.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full justify-center">
                  GO TO CLIENT DASHBOARD
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
