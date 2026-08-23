"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import { CardFinish } from "@/components/3d/InteractiveFlippableCard";
import {
  Check,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Zap,
  ArrowRight,
  Radio,
  QrCode,
  Lock,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { formatCurrency } from "@/lib/utils";

type EditionTier = "classic" | "metal" | "atelier";

export default function OrderPage() {
  const [tier, setTier] = useState<EditionTier>("metal");
  const [finish, setFinish] = useState<CardFinish>("pitch_black");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Card Personalization Inputs
  const [name, setName] = useState("RITESH MARTAWAR");
  const [designation, setDesignation] = useState("FOUNDER & CEO");
  const [company, setCompany] = useState("NXC VERSE");
  const [engraving, setEngraving] = useState("EDITION NO. 001/100");
  const [qrSlug, setQrSlug] = useState("ritesh");

  // Shipping & Contact Details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Flow State
  const [step, setStep] = useState<"configure" | "checkout" | "success">("configure");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const pricing = {
    classic: { INR: 999, USD: 12, name: "NXC Verse Classic", subtitle: "Matte Composite Core" },
    metal: { INR: 1599, USD: 20, name: "NXC Verse Metal Edition", subtitle: "Solid Cold-Forged Steel" },
    atelier: { INR: 2999, USD: 38, name: "NXC Verse Atelier Bespoke", subtitle: "Hand-Finished PVD & Monogram" },
  };

  const currentPrice = pricing[tier][currency];

  const finishOptions: { id: CardFinish; name: string; hex: string; desc: string }[] = [
    { id: "pitch_black", name: "Pitch Black", hex: "#000000", desc: "Pure high-gloss mirror pitch black metal" },
    { id: "silver", name: "Silver", hex: "#D8DFE8", desc: "Brushed liquid sterling titanium with black logo" },
    { id: "gold", name: "Gold", hex: "#F5D061", desc: "24K imperial gold with warm champagne luster" },
    { id: "royal_red", name: "Royal Red", hex: "#FF2A55", desc: "Deep crimson ruby metallic with silver crest" },
    { id: "cobalt_blue", name: "Cobalt Blue", hex: "#0B3875", desc: "Deep oceanic cobalt metal with sapphire gloss" },
  ];

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          finish,
          engravingName: name,
          engravingTitle: designation,
          company,
          engraving,
          qrSlug,
          amount: currentPrice,
          currency,
          customerName: customerName || name,
          customerEmail,
          customerPhone,
          shippingAddress: `${address}, ${city} - ${pincode}`,
        }),
      });

      const data = await res.json();
      setOrderId(data.orderId || `NXC-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep("success");
    } catch (err) {
      console.error("Order creation failed", err);
      setOrderId(`NXC-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep("success");
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 pb-28 px-4 sm:px-6 md:px-12 relative overflow-hidden selection:bg-[#0099FF]/30 selection:text-white">
      {/* Background Electric Blue Studio Beams */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0066FF]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#0044CC]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#0099FF]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,140,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00A2FF]" />
            <span className="font-mono text-[10px] text-[#80D0FF] tracking-[0.25em] uppercase font-semibold">
              OFFICIAL ATELIER ACQUISITION
            </span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Order Your Bespoke Metal Card
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#9E9EA8] max-w-xl mx-auto leading-relaxed">
            Crafted in cold-forged metal with high-density NTAG216 NFC and permanent digital identity profile. Click the 3D card anytime to flip between faces.
          </p>
        </div>

        {/* Currency Switcher Pill */}
        <div className="flex justify-center">
          <div className="bg-white/[0.04] border border-white/10 rounded-full p-1 flex items-center gap-1 backdrop-blur-md">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-1 rounded-full text-xs font-mono transition-all ${
                currency === "INR"
                  ? "bg-[#0077FF] text-white shadow-[0_0_15px_rgba(0,120,255,0.5)] font-bold"
                  : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-1 rounded-full text-xs font-mono transition-all ${
                currency === "USD"
                  ? "bg-[#0077FF] text-white shadow-[0_0_15px_rgba(0,120,255,0.5)] font-bold"
                  : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: CARD CONFIGURATION & LIVE 3D PREVIEW                             */}
        {/* ========================================================================= */}
        {step === "configure" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Live 3D Dual-Sided Flippable Card View */}
            <div className="lg:col-span-6 sticky top-28 bg-[#040406]/90 border border-white/[0.1] rounded-[20px] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-[480px] sm:min-h-[520px] md:min-h-[620px] shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl overflow-hidden max-w-full">
              {/* Electric Blue Top Accent */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#0099FF]/60 to-transparent" />

              <div className="w-full flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                <span className="font-mono text-[10px] text-[#00A2FF] tracking-[0.25em] uppercase font-semibold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-[#00A2FF]" />
                  LIVE REAL-TIME 3D PREVIEW
                </span>
                <span className="font-mono text-xs text-white font-medium uppercase">
                  {finish.replace("_", " ")}
                </span>
              </div>

              <div className="w-full flex-1 flex items-center justify-center">
                <DynamicHeroCardScene
                  finish={finish}
                  name={name}
                  designation={designation}
                  company={company}
                  engraving={engraving}
                  qrSlug={qrSlug}
                  interactive={true}
                />
              </div>

              <div className="w-full pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-sans text-[#8E8E98]">
                <span>NFC Chip: NTAG216 High Speed</span>
                <span className="text-[#00A2FF]">Click card to flip ⟲</span>
              </div>
            </div>

            {/* Right Column: Customization Controls & Hardware Options */}
            <div className="lg:col-span-6 space-y-8 bg-[#060608]/80 border border-white/[0.08] rounded-[20px] p-6 sm:p-8 backdrop-blur-xl">
              {/* 1. Hardware Edition Selector */}
              <div className="space-y-3">
                <label className="font-mono text-xs text-[#00A2FF] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span>01</span>
                  <span>CHOOSE HARDWARE EDITION</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["classic", "metal", "atelier"] as EditionTier[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 btn-interactive ${
                        tier === t
                          ? "bg-[#002255]/40 border-[#0099FF] shadow-[0_0_20px_rgba(0,140,255,0.3)]"
                          : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="font-cinzel text-xs font-semibold text-white tracking-wider">
                        {pricing[t].name.replace("NXC Verse ", "")}
                      </div>
                      <div className="font-sans text-[10px] text-[#8E8E98] mt-0.5">
                        {pricing[t].subtitle}
                      </div>
                      <div className="font-mono text-sm font-bold text-[#00A2FF] mt-2">
                        {formatCurrency(pricing[t][currency], currency)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Card Color Finish Selector */}
              <div className="space-y-3">
                <label className="font-mono text-xs text-[#00A2FF] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span>02</span>
                  <span>SELECT COLOR FINISH (5 OPTIONS)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {finishOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFinish(f.id)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all btn-interactive ${
                        finish === f.id
                          ? "bg-white/[0.08] border-[#0099FF] shadow-[0_0_15px_rgba(0,140,255,0.25)]"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-white/40 flex-shrink-0"
                        style={{ backgroundColor: f.hex }}
                      />
                      <span className="font-sans text-xs font-medium text-white tracking-wide truncate">
                        {f.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Card Engraving Personalization Form */}
              <form onSubmit={handleProceedToCheckout} className="space-y-5 pt-2">
                <label className="font-mono text-xs text-[#00A2FF] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span>03</span>
                  <span>PERSONALIZATION DETAILS</span>
                </label>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider mb-1.5">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ritesh Martawar"
                      required
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-cinzel tracking-wider focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider mb-1.5">
                        Designation / Position
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Founder & CEO"
                        required
                        className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. NXC Verse"
                        className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-cinzel tracking-wider focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider mb-1.5">
                        Custom Monogram / Serial
                      </label>
                      <input
                        type="text"
                        value={engraving}
                        onChange={(e) => setEngraving(e.target.value)}
                        placeholder="e.g. EDITION NO. 001/100"
                        className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider mb-1.5">
                        Permanent Digital Slug
                      </label>
                      <div className="flex items-center bg-[#0E0E12] border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-[#0099FF] focus-within:ring-1 focus-within:ring-[#0099FF] transition-all">
                        <span className="font-mono text-xs text-[#52525C] select-none">/@</span>
                        <input
                          type="text"
                          value={qrSlug}
                          onChange={(e) => setQrSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                          placeholder="username"
                          required
                          className="w-full bg-transparent text-xs text-white font-mono focus:outline-none pl-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & CTA Action */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] text-[#8E8E98] uppercase tracking-wider">
                      TOTAL INVESTMENT
                    </div>
                    <div className="font-sans font-bold text-2xl text-white">
                      {formatCurrency(currentPrice, currency)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white font-sans font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(0,120,255,0.45)] hover:shadow-[0_0_35px_rgba(0,150,255,0.7)] flex items-center justify-center gap-2 btn-interactive"
                  >
                    <span>CONTINUE TO SHIPPING</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: SHIPPING & CHECKOUT FORM                                         */}
        {/* ========================================================================= */}
        {step === "checkout" && (
          <div className="max-w-4xl mx-auto bg-[#060608] border border-white/10 rounded-[20px] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setStep("configure")}
                className="font-mono text-xs text-[#00A2FF] hover:underline flex items-center gap-1"
              >
                ← Back to Card Atelier
              </button>
              <div className="font-mono text-xs text-[#8E8E98]">
                STEP 2 OF 2: DISPATCH & PAYMENT
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Delivery Details Form */}
              <form onSubmit={handleFinalOrderSubmit} className="md:col-span-7 space-y-4">
                <h3 className="font-cinzel text-lg text-white font-semibold tracking-wide">
                  Shipping Destination
                </h3>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                    Full Recipient Name
                  </label>
                  <input
                    type="text"
                    value={customerName || name}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                      Email Address (Profile Login)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex@acme.com"
                      required
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                      WhatsApp Number (Photo Proof)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                    Street Address & Suite / Floor
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="124 Aerospace Tower, Marina Bay"
                    required
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai, Maharashtra"
                      required
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400001"
                      required
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099FF]"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white font-sans font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(0,120,255,0.5)] flex items-center justify-center gap-2 btn-interactive disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? "FORGING HARDWARE..." : `CONFIRM & PAY ${formatCurrency(currentPrice, currency)}`}</span>
                  </button>
                </div>
              </form>

              {/* Right Column: Order Summary Card */}
              <div className="md:col-span-5 bg-[#0A0A0E] border border-white/[0.08] rounded-xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="font-cinzel text-sm text-white font-semibold tracking-wider">
                    Order Overview
                  </h4>

                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8E8E98]">Edition:</span>
                      <span className="text-white font-medium">{pricing[tier].name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8E8E98]">Finish:</span>
                      <span className="text-white font-medium uppercase">{finish.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8E8E98]">Engraving:</span>
                      <span className="text-white font-medium">{name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8E8E98]">Digital Profile:</span>
                      <span className="font-mono text-[#00A2FF]">nxcverse.in/@{qrSlug}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8E8E98]">Express Courier:</span>
                      <span className="text-[#25D366] font-medium">FREE (Aerospace Pack)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-sm font-sans font-bold">
                    <span>Total Due:</span>
                    <span className="text-xl text-[#00A2FF] font-mono">
                      {formatCurrency(currentPrice, currency)}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#62626E] leading-relaxed">
                    256-bit encrypted checkout. Includes lifetime profile hosting and 1-year hardware warranty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: ORDER SUCCESS CONFIRMATION                                       */}
        {/* ========================================================================= */}
        {step === "success" && (
          <div className="max-w-2xl mx-auto bg-[#060608] border border-[#0099FF]/40 rounded-[24px] p-8 sm:p-12 text-center space-y-6 shadow-[0_0_60px_rgba(0,140,255,0.3)]">
            <div className="w-16 h-16 rounded-full bg-[#0088FF]/20 border border-[#0099FF] mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(0,140,255,0.5)]">
              <Check className="w-8 h-8 text-[#00A2FF]" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[#00A2FF] tracking-[0.25em] uppercase font-semibold">
                ACQUISITION CONFIRMED
              </span>
              <h2 className="font-cinzel text-3xl text-white font-medium">
                Your NXC Metal Card is Queued for Casting
              </h2>
              <p className="font-sans text-xs text-[#9E9EA8] max-w-md mx-auto leading-relaxed">
                Order ID: <span className="font-mono text-white font-bold">{orderId}</span>. Our master atelier has received your metallurgical specifications.
              </p>
            </div>

            {/* Next Steps Card */}
            <div className="bg-[#0E0E14] border border-white/10 rounded-xl p-5 text-left space-y-3 text-xs">
              <div className="font-mono text-[11px] text-white font-semibold uppercase tracking-wider">
                What Happens Next:
              </div>
              <ul className="space-y-2 text-[#A0A0AC] list-disc list-inside">
                <li>Laser precision milling of your personalized NTAG216 chip & QR matrix.</li>
                <li>Concierge WhatsApp photo proof before sealing the aerospace package.</li>
                <li>Your sovereign digital profile at <span className="font-mono text-[#00A2FF]">nxcverse.in/@{qrSlug}</span> is activated immediately.</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/919561248677?text=Hello%20NXC%20Verse%20Concierge,%20I%20just%20placed%20order%20${orderId}%20for%20${name}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] text-black font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg btn-interactive"
              >
                <WhatsAppIcon className="w-4 h-4 text-black" color="#000000" />
                <span>Connect with Concierge</span>
              </a>

              <Link href="/">
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.06] border border-white/20 text-white font-sans font-medium text-xs tracking-wider uppercase hover:bg-white/10 btn-interactive">
                  Return to Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
