"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import { CardFinish } from "@/components/3d/InteractiveFlippableCard";
import {
  Check,
  ShoppingBag,
  ArrowRight,
  Radio,
  Lock,
  Type,
  Sparkles,
  RotateCw,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { formatCurrency, cn } from "@/lib/utils";

type EditionTier = "classic" | "metal" | "atelier";

function OrderPageContent() {
  const searchParams = useSearchParams();

  // Read incoming query params from marketing & pricing CTAs
  const queryTier = searchParams.get("tier");
  const queryFinish = searchParams.get("finish");

  const [tier, setTier] = useState<EditionTier>(() => {
    if (queryTier === "classic" || queryTier === "verse") return "classic";
    if (queryTier === "atelier") return "atelier";
    return "metal";
  });

  const [finish, setFinish] = useState<CardFinish>(() => {
    if (
      queryFinish &&
      ["pitch_black", "silver", "gold", "royal_red", "cobalt_blue"].includes(queryFinish)
    ) {
      return queryFinish as CardFinish;
    }
    return "pitch_black";
  });

  // Sync state if query parameters change
  useEffect(() => {
    if (queryTier === "classic" || queryTier === "verse") {
      setTier("classic");
    } else if (queryTier === "atelier") {
      setTier("atelier");
    } else if (queryTier === "metal") {
      setTier("metal");
    }

    if (
      queryFinish &&
      ["pitch_black", "silver", "gold", "royal_red", "cobalt_blue"].includes(queryFinish)
    ) {
      setFinish(queryFinish as CardFinish);
    }
  }, [queryTier, queryFinish]);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Card Personalization Inputs
  const [name, setName] = useState("RITESH MARTAWAR");
  const [designation, setDesignation] = useState("FOUNDER & CEO");
  const [company, setCompany] = useState("NXC VERSE");
  const [engraving, setEngraving] = useState("EDITION NO. 001/100");
  const [qrSlug, setQrSlug] = useState("ritesh");
  const [fontStyle, setFontStyle] = useState<"cinzel" | "sans" | "mono">("cinzel");
  const [cardFace, setCardFace] = useState<"front" | "back">("front");

  const getInitials = (fullName: string) => {
    if (!fullName) return "NXC";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
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
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-20 sm:pt-24 pb-20 sm:pb-28 px-4 sm:px-6 md:px-12 relative overflow-x-hidden selection:bg-white/20 selection:text-white safe-pb">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2E0DC]" />
            <span className="font-mono text-[10px] text-[#C8C6C0] tracking-[0.22em] uppercase font-semibold">
              ATELIER ACQUISITION
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Order Your Bespoke Metal Card
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#9E9EA8] max-w-xl mx-auto leading-relaxed">
            Crafted in cold-forged metal with high-density NTAG216 NFC and permanent sovereign digital profile. Tap the 3D card to inspect both faces.
          </p>
        </div>

        {/* Currency Switcher Pill */}
        <div className="flex justify-center">
          <div className="bg-white/[0.04] border border-white/10 rounded-full p-1 flex items-center gap-1 backdrop-blur-md">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-1 rounded-full text-xs font-mono transition-all ${
                currency === "INR"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-[#9E9EA8] hover:text-white"
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-1 rounded-full text-xs font-mono transition-all ${
                currency === "USD"
                  ? "bg-white text-black font-semibold shadow-sm"
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
            {/* Left Column: Live 3D Dual-Sided Card View */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 bg-[#060608] border border-white/[0.1] rounded-[24px] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between min-h-[460px] sm:min-h-[520px] md:min-h-[580px] shadow-[0_24px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl max-w-full">
              {/* Header with Segmented Face Switcher */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#A0A0AA] tracking-[0.22em] uppercase font-semibold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#E2E0DC]" />
                    LIVE 3D INSPECTOR
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="font-mono text-[11px] text-white font-medium uppercase">
                    {finish.replace("_", " ")}
                  </span>
                </div>

                {/* Segmented Face Toggle Pill */}
                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10">
                  <button
                    type="button"
                    onClick={() => setCardFace("front")}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all",
                      cardFace === "front"
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-[#8E8E98] hover:text-white"
                    )}
                  >
                    FRONT (LOGO)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardFace("back")}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all",
                      cardFace === "back"
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-[#8E8E98] hover:text-white"
                    )}
                  >
                    BACK (ENGRAVING)
                  </button>
                </div>
              </div>

              {/* 3D Scene */}
              <div className="w-full flex-1 flex items-center justify-center my-auto py-2">
                <DynamicHeroCardScene
                  finish={finish}
                  name={name}
                  designation={designation}
                  company={company}
                  engraving={engraving}
                  qrSlug={qrSlug}
                  fontStyle={fontStyle}
                  activeFace={cardFace}
                  onFlipChange={(isBack) => setCardFace(isBack ? "back" : "front")}
                  interactive={true}
                />
              </div>

              {/* Inspection Footer Specs */}
              <div className="w-full pt-3.5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#8E8E98]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="text-[#D0D0DC]">CNC TOLERANCE ±0.05MM</span>
                  <span className="text-white/20">·</span>
                  <span>NTAG216 NFC</span>
                </div>
                <div className="text-[#A0A0AA] flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-[#E2E0DC]" />
                  <span>Tap card or drag to inspect 3D tilt</span>
                </div>
              </div>
            </div>

            {/* Right Column: Customization Controls & Hardware Options */}
            <div className="lg:col-span-6 space-y-7 bg-[#08080A] border border-white/[0.08] rounded-[24px] p-5 sm:p-7 md:p-8 backdrop-blur-xl">
              {/* 1. Hardware Edition Selector */}
              <div className="space-y-3">
                <label className="font-mono text-xs text-[#C8C6C0] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span>01</span>
                  <span>CHOOSE HARDWARE EDITION</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["classic", "metal", "atelier"] as EditionTier[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      className={`min-h-[52px] p-3.5 rounded-xl border text-left transition-all duration-200 btn-interactive ${
                        tier === t
                          ? "bg-white/[0.08] border-white/50 shadow-md"
                          : "bg-white/[0.02] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="font-cinzel text-xs font-semibold text-white tracking-wider">
                        {pricing[t].name.replace("NXC Verse ", "")}
                      </div>
                      <div className="font-sans text-[10px] text-[#8E8E98] mt-0.5">
                        {pricing[t].subtitle}
                      </div>
                      <div className="font-mono text-sm font-bold text-white mt-2">
                        {formatCurrency(pricing[t][currency], currency)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Card Color Finish Selector */}
              <div className="space-y-3">
                <label className="font-mono text-xs text-[#C8C6C0] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span>02</span>
                  <span>SELECT COLOR FINISH (5 OPTIONS)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {finishOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFinish(f.id)}
                      className={`min-h-[46px] p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 transition-all btn-interactive ${
                        finish === f.id
                          ? "bg-white/[0.1] border-white/60 shadow-sm"
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

              {/* 3. Laser Typography Style Selector (New Feature) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-[#C8C6C0] uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span>03</span>
                    <span>SELECT LASER TYPOGRAPHY</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#8E8E98]">Deep CNC Laser Infill</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "cinzel" as const,
                      name: "Classic Roman",
                      sub: "Cinzel Serif",
                      badge: "TIMELUXE",
                      sample: "RITESH MARTAWAR",
                      fontClass: "font-cinzel",
                    },
                    {
                      id: "sans" as const,
                      name: "Modern Executive",
                      sub: "Jakarta Sans",
                      badge: "MINIMALIST",
                      sample: "RITESH MARTAWAR",
                      fontClass: "font-sans font-bold",
                    },
                    {
                      id: "mono" as const,
                      name: "Precision Monogram",
                      sub: "JetBrains Mono",
                      badge: "TECHNICAL",
                      sample: "RITESH MARTAWAR",
                      fontClass: "font-mono font-medium",
                    },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFontStyle(f.id);
                        setCardFace("back");
                      }}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all btn-interactive flex flex-col justify-between min-h-[72px]",
                        fontStyle === f.id
                          ? "bg-white/[0.09] border-white/50 shadow-sm"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white">{f.name}</span>
                        <span className="text-[9px] font-mono text-[#8E8E98] tracking-widest px-1.5 py-0.5 rounded bg-white/[0.04]">
                          {f.badge}
                        </span>
                      </div>
                      <div className={cn("text-xs text-white/90 truncate mt-2 tracking-wider", f.fontClass)}>
                        {name || f.sample}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Card Engraving Personalization Form */}
              <form onSubmit={handleProceedToCheckout} className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-[#C8C6C0] uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span>04</span>
                    <span>PERSONALIZATION DETAILS</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#8E8E98]">Auto-updates 3D card</span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider">
                        Cardholder Full Name
                      </label>
                      <span className="text-[10px] font-mono text-[#6E6E7A]">
                        {name.length}/26
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={26}
                      value={name}
                      onFocus={() => setCardFace("back")}
                      onChange={(e) => {
                        setName(e.target.value);
                        setCardFace("back");
                      }}
                      placeholder="e.g. Ritesh Martawar"
                      required
                      className={cn(
                        "w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white tracking-wider focus:outline-none focus:border-white/40 transition-colors",
                        fontStyle === "cinzel" && "font-cinzel",
                        fontStyle === "sans" && "font-sans font-semibold",
                        fontStyle === "mono" && "font-mono"
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider">
                          Designation / Position
                        </label>
                        <span className="text-[10px] font-mono text-[#6E6E7A]">
                          {designation.length}/32
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={32}
                        value={designation}
                        onFocus={() => setCardFace("back")}
                        onChange={(e) => {
                          setDesignation(e.target.value);
                          setCardFace("back");
                        }}
                        placeholder="e.g. Founder & CEO"
                        required
                        className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono tracking-wider focus:outline-none focus:border-white/40 transition-colors"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider">
                          Company Name
                        </label>
                        <span className="text-[10px] font-mono text-[#6E6E7A]">
                          {company.length}/24
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={24}
                        value={company}
                        onFocus={() => setCardFace("back")}
                        onChange={(e) => {
                          setCompany(e.target.value);
                          setCardFace("back");
                        }}
                        placeholder="e.g. NXC Verse"
                        className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-cinzel tracking-wider focus:outline-none focus:border-white/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider">
                          Custom Serial / Inscription
                        </label>
                        <span className="text-[10px] font-mono text-[#6E6E7A]">
                          {engraving.length}/28
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={28}
                        value={engraving}
                        onFocus={() => setCardFace("back")}
                        onChange={(e) => {
                          setEngraving(e.target.value);
                          setCardFace("back");
                        }}
                        placeholder="e.g. EDITION NO. 001/100"
                        className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-white/40 transition-colors"
                      />

                      {/* Quick Monogram Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2">
                        {[
                          `${getInitials(name)} · 001/100`,
                          `FOUNDER · 2026`,
                          `EXECUTIVE NO. 042`,
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setEngraving(preset);
                              setCardFace("back");
                            }}
                            className="px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[9px] font-mono text-[#A0A0AA] hover:text-white transition-colors"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider">
                          Permanent Digital Handle
                        </label>
                        <span className="text-[10px] font-mono text-[#25D366]">
                          Live QR
                        </span>
                      </div>
                      <div className="flex items-center bg-[#121217] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/40 transition-colors">
                        <span className="font-mono text-xs text-[#6E6E7A] select-none">/@</span>
                        <input
                          type="text"
                          value={qrSlug}
                          onFocus={() => setCardFace("back")}
                          onChange={(e) => {
                            setQrSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
                            setCardFace("back");
                          }}
                          placeholder="username"
                          required
                          className="w-full bg-transparent text-xs text-white font-mono focus:outline-none pl-1"
                        />
                      </div>
                      <p className="font-mono text-[9px] text-[#6E6E7A] mt-1 truncate">
                        URL: nxcverse.in/@{qrSlug || "username"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price & CTA Action */}
                <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] text-[#8E8E98] uppercase tracking-wider">
                      TOTAL INVESTMENT
                    </div>
                    <div className="font-sans font-semibold text-2xl sm:text-3xl text-white">
                      {formatCurrency(currentPrice, currency)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="min-h-[48px] px-8 py-3 rounded-full bg-white text-black font-sans font-semibold text-xs tracking-[0.16em] uppercase hover:bg-[#EAE8E4] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.18)] btn-interactive"
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
          <div className="max-w-4xl mx-auto bg-[#08080A] border border-white/10 rounded-[22px] p-5 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl space-y-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setStep("configure")}
                className="font-mono text-xs text-[#C8C6C0] hover:text-white flex items-center gap-1 transition-colors"
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
                <h3 className="font-cinzel text-base sm:text-lg text-white font-medium tracking-wide">
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
                    className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                      Email Address (Login)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex@company.com"
                      required
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                      WhatsApp Number (Proof)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 font-mono"
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
                    placeholder="124 Executive Tower, High Street"
                    required
                    className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
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
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#8E8E98] uppercase mb-1">
                      Postal / PIN Code
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400001"
                      required
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] py-3.5 rounded-full bg-white text-black font-sans font-semibold text-xs tracking-[0.16em] uppercase hover:bg-[#EAE8E4] flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(255,255,255,0.18)] btn-interactive disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? "FORGING HARDWARE..." : `CONFIRM & PAY ${formatCurrency(currentPrice, currency)}`}</span>
                  </button>
                </div>
              </form>

              {/* Right Column: Order Summary Card */}
              <div className="md:col-span-5 bg-[#0D0D11] border border-white/[0.08] rounded-xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="font-cinzel text-sm text-white font-medium tracking-wider">
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
                      <span className="text-white font-medium truncate max-w-[140px]">{name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8E8E98]">Digital Profile:</span>
                      <span className="font-mono text-white">nxcverse.in/@{qrSlug}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8E8E98]">Courier:</span>
                      <span className="text-[#25D366] font-medium">COMPLIMENTARY AIR PACK</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-1.5">
                  <div className="flex justify-between items-center text-sm font-sans font-semibold">
                    <span>Total Due:</span>
                    <span className="text-xl text-white font-mono">
                      {formatCurrency(currentPrice, currency)}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#70707C] leading-relaxed">
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
          <div className="max-w-2xl mx-auto bg-[#08080A] border border-white/20 rounded-[24px] p-6 sm:p-10 md:p-12 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-white">
              <Check className="w-7 h-7 text-[#25D366]" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[#C8C6C0] tracking-[0.22em] uppercase font-semibold">
                ACQUISITION CONFIRMED
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-medium">
                Your NXC Metal Card is Queued for Casting
              </h2>
              <p className="font-sans text-xs text-[#9E9EA8] max-w-md mx-auto leading-relaxed">
                Order ID: <span className="font-mono text-white font-bold">{orderId}</span>. Our master atelier has received your metallurgical specifications.
              </p>
            </div>

            {/* Next Steps Card */}
            <div className="bg-[#101015] border border-white/10 rounded-xl p-5 text-left space-y-2.5 text-xs">
              <div className="font-mono text-[11px] text-white font-semibold uppercase tracking-wider">
                What Happens Next:
              </div>
              <ul className="space-y-1.5 text-[#A0A0AC] list-disc list-inside">
                <li>Laser precision milling of your personalized NTAG216 chip & QR matrix.</li>
                <li>Concierge WhatsApp photo proof before dispatching the aerospace package.</li>
                <li>Your sovereign digital profile at <span className="font-mono text-white">nxcverse.in/@{qrSlug}</span> is activated immediately.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <button className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#EAE8E4] btn-interactive">
                  <span>Access Client Dashboard</span>
                </button>
              </Link>

              <a
                href={`https://wa.me/919561248677?text=Hello%20NXC%20Verse%20Concierge,%20I%20just%20placed%20order%20${orderId}%20for%20${name}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 text-white font-sans font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 btn-interactive"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
                <span>Connect Concierge</span>
              </a>

              <Link href="/">
                <button className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-[#A0A0AC] font-sans font-medium text-xs tracking-wider uppercase hover:text-white btn-interactive">
                  Return Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
