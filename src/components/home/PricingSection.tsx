"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { Check } from "lucide-react";

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
      tier: "classic" as const,
      name: "NXC Verse Classic",
      badge: "CLASSIC",
      priceInr: 999,
      priceUsd: 12,
      duration: "Matte Composite Body",
      description: "Obsidian matte composite body with high-density NTAG216 NFC chip and precision laser QR code.",
      features: [
        "Permanent Sovereign URL (nxcverse.in/@you)",
        "Precision NFC chip + Dynamic QR matrix",
        "1-Click .VCF contact sync for recipients",
        "Permanent profile hosting & edge caching",
        "Real-time contact details updating",
        "Standard analytics dashboard",
      ],
      isPopular: false,
    },
    {
      tier: "metal" as const,
      name: "NXC Verse Metal",
      badge: "RECOMMENDED",
      priceInr: 1599,
      priceUsd: 20,
      duration: "Cold-Forged Metal Chassis",
      description: "Solid cold-forged stainless steel and brushed titanium body with diamond-cut chamfered edges.",
      features: [
        "Aerospace Grade Metal Chassis (Titanium / Obsidian)",
        "Permanent Sovereign URL (nxcverse.in/@you)",
        "Priority edge caching & cloud hosting",
        "Etched silver Phoenix emblem or custom crest",
        "Full analytics (scans, device types, locations)",
        "Zero subscription fees or recurring costs",
        "Priority concierge hardware support",
      ],
      isPopular: true,
    },
    {
      tier: "atelier" as const,
      name: "NXC Verse Atelier",
      badge: "BESPOKE MONOGRAM",
      priceInr: 2999,
      priceUsd: 38,
      duration: "Hand-Finished PVD & Serialization",
      description: "Individually serialized bespoke metal card with hand-finished PVD coating and micro-engraving.",
      features: [
        "Hand-finished PVD Dark Obsidian / Royal Finishes",
        "Custom Monogram & Micro-engraving Included",
        "Permanent Sovereign URL (nxcverse.in/@you)",
        "Permanent profile hosting with instant updates",
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
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 relative z-10">
        {/* Header & Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-[#8E8E98] uppercase tracking-[0.22em] font-medium">
              ACQUISITION TIERS
            </span>
            <h2 className="font-cinzel font-medium text-2xl sm:text-3xl md:text-5xl text-white tracking-tight">
              Craftsmanship meets sovereign identity.
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#9E9EA8]">
              A single physical commission. Zero recurring monthly subscriptions.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2">
          {plans.map((p) => {
            const price = currency === "INR" ? p.priceInr : p.priceUsd;
            return (
              <div
                key={p.tier}
                className={`relative rounded-[22px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                  p.isPopular
                    ? "bg-[#09090C] border border-white/40 shadow-[0_24px_60px_rgba(0,0,0,0.95)]"
                    : "bg-[#060608] border border-white/[0.08] hover:border-white/20 shadow-lg"
                }`}
              >
                {/* Most Popular Badge */}
                {p.isPopular && (
                  <div className="absolute -top-3.5 left-6 sm:left-8 px-3.5 py-1 rounded-full bg-white text-black font-mono text-[9px] font-bold tracking-widest uppercase shadow-md border border-white z-30">
                    <span>{p.badge}</span>
                  </div>
                )}

                <div className="space-y-6 text-left">
                  <div>
                    <span className="font-mono text-[10px] text-[#70707C] uppercase tracking-widest block mb-1">
                      {p.duration}
                    </span>
                    <h3 className="font-cinzel font-semibold text-xl sm:text-2xl text-white">
                      {p.name}
                    </h3>
                  </div>

                  {/* Price Block */}
                  <div className="pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-semibold text-3xl sm:text-4xl text-white tracking-tight">
                        {formatCurrency(price, currency)}
                      </span>
                      <span className="font-sans text-xs text-[#70707C]">/ card</span>
                    </div>
                    <p className="font-sans text-xs text-[#9E9EA8] mt-2.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="pt-5 border-t border-white/[0.08] space-y-2.5">
                    <span className="font-mono text-[9px] text-[#70707C] uppercase tracking-widest block">
                      INCLUDED WITH COMMISSION:
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
                <div className="pt-7">
                  <Link href={`/order?tier=${p.tier}`} className="block w-full btn-interactive">
                    <Button
                      variant={p.isPopular ? "primary" : "outline"}
                      size="lg"
                      className={`w-full min-h-[46px] justify-center text-xs tracking-[0.14em] uppercase rounded-full ${
                        p.isPopular
                          ? "bg-white text-black hover:bg-[#EAE8E4] font-semibold border-none shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                          : "border-white/20 hover:border-white/40 text-white"
                      }`}
                    >
                      ORDER {p.name.toUpperCase()}
                    </Button>
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
          <form onSubmit={handleOrder} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-sans font-medium text-[#9E9EA8] uppercase tracking-wider mb-1">
                Full Name for Card Engraving
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Julian Vance"
                className="w-full bg-[#141418] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#9E9EA8] uppercase tracking-wider mb-1">
                Email Address (For Order & Activation)
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. julian@vancecapital.com"
                className="w-full bg-[#141418] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#141418] border border-white/10 flex items-center justify-between text-xs font-sans text-[#9E9EA8]">
              <span>Gateway:</span>
              <span className="font-mono text-white uppercase text-[11px]">
                {currency === "INR" ? "Razorpay Secure (UPI, Cards)" : "Stripe International"}
              </span>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full justify-center text-xs tracking-wider rounded-full">
                CONFIRM & PROCEED ({formatCurrency(selectedPlan?.price || 0, currency)})
              </Button>
            </div>
          </form>
        )}

        {checkoutStep === "processing" && (
          <div className="py-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-sans text-sm text-white">Connecting to Secure Payment Gateway...</p>
            <p className="font-mono text-xs text-[#70707C]">Creating permanent sovereign record...</p>
          </div>
        )}

        {checkoutStep === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-[#25D366] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel font-medium text-lg text-white">
                Order Confirmed
              </h4>
              <p className="font-sans text-xs text-[#9E9EA8] mt-1">
                Your card has been queued for precision laser engraving and dispatch.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full justify-center text-xs rounded-full">
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
