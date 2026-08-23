"use client";

import React, { useReducer, useState } from "react";
import Link from "next/link";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { Check, Sparkles, QrCode, ArrowRight, RefreshCw } from "lucide-react";

type Variant = "verse" | "metal" | "atelier";
export type Finish = "silver" | "gold" | "royal_red" | "pitch_black" | "cobalt_blue" | "matte_black";
type Material = "matte" | "brushed" | "mirror" | "premium_metal";

interface CardConfigState {
  variant: Variant;
  finish: Finish;
  material: Material;
  name: string;
  designation: string;
  company: string;
  logoKey: string | null;
  engraving: string;
  showQR: boolean;
}

type Action =
  | { type: "SET_VARIANT"; payload: Variant }
  | { type: "SET_FINISH"; payload: Finish }
  | { type: "SET_MATERIAL"; payload: Material }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESIGNATION"; payload: string }
  | { type: "SET_COMPANY"; payload: string }
  | { type: "SET_ENGRAVING"; payload: string }
  | { type: "TOGGLE_QR" }
  | { type: "RESET" };

const initialState: CardConfigState = {
  variant: "metal",
  finish: "pitch_black",
  material: "matte",
  name: "RITESH MARTAWAR",
  designation: "FOUNDER & CEO",
  company: "NXC Verse",
  logoKey: "phoenix",
  engraving: "EDITION NO. 001/100",
  showQR: true,
};

function reducer(state: CardConfigState, action: Action): CardConfigState {
  switch (action.type) {
    case "SET_VARIANT":
      return { ...state, variant: action.payload };
    case "SET_FINISH":
      return { ...state, finish: action.payload };
    case "SET_MATERIAL":
      return { ...state, material: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESIGNATION":
      return { ...state, designation: action.payload };
    case "SET_COMPANY":
      return { ...state, company: action.payload };
    case "SET_ENGRAVING":
      return { ...state, engraving: action.payload };
    case "TOGGLE_QR":
      return { ...state, showQR: !state.showQR };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function CustomizePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderStep, setOrderStep] = useState<"form" | "processing" | "success">("form");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const pricingMap = {
    verse: { INR: 999, USD: 12, name: "NXC Verse Classic" },
    metal: { INR: 1599, USD: 20, name: "NXC Verse Metal" },
    atelier: { INR: 2999, USD: 38, name: "NXC Verse Atelier" },
  };

  const currentPrice = pricingMap[state.variant][currency];

  const finishes = [
    { id: "silver" as Finish, name: "Silver", hex: "#E2E2EC", tier: "Metal & Atelier" },
    { id: "gold" as Finish, name: "Gold", hex: "#D8B466", tier: "Atelier Bespoke" },
    { id: "royal_red" as Finish, name: "Royal Red", hex: "#781827", tier: "Atelier Bespoke" },
    { id: "pitch_black" as Finish, name: "Pitch Black", hex: "#050507", tier: "All Editions" },
    { id: "cobalt_blue" as Finish, name: "Cobalt Blue", hex: "#0B3875", tier: "Metal Edition" },
  ];

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStep("processing");

    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: state.variant,
          finish: state.finish,
          material: state.material,
          engravingName: state.name,
          engravingTitle: state.designation,
          amount: currentPrice,
          currency,
          customerName: state.name,
          customerEmail,
          customerPhone,
        }),
      });

      if (res.ok) {
        setOrderStep("success");
      } else {
        setOrderStep("form");
      }
    } catch {
      setOrderStep("form");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pt-24 pb-16 px-4 sm:px-6 md:px-8 text-left overflow-x-hidden max-w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs text-[#8E8E98] uppercase tracking-[0.25em] font-medium">
              THE ATELIER STUDIO
            </span>
            <h1 className="font-sans font-medium text-2xl md:text-4xl text-white tracking-tight">
              Bespoke Card Configurator
            </h1>
            <p className="font-sans text-xs text-[#9E9EA8] mt-1">
              Click the card or use the button below to inspect both sides (Front NXC Logo & Back QR Identity).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="p-2 text-xs font-mono text-[#8E8E98] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#0E0E12] border border-white/10 shadow-inner">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                  currency === "INR" ? "bg-white text-black font-semibold shadow-sm" : "text-[#9E9EA8] hover:text-white"
                }`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                  currency === "USD" ? "bg-white text-black font-semibold shadow-sm" : "text-[#9E9EA8] hover:text-white"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* 60 / 40 Configurator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (60%): Real-Time Dual-Sided Flippable 3D Card Scene */}
          <div className="lg:col-span-7 bg-[#060608] border border-white/[0.12] rounded-[14px] p-4 sm:p-6 md:p-8 relative flex flex-col items-center justify-center min-h-[480px] sm:min-h-[540px] lg:min-h-[640px] shadow-[0_30px_80px_rgba(0,0,0,0.95)] overflow-hidden max-w-full">
            <DynamicHeroCardScene
              finish={state.finish}
              name={state.name || "YOUR NAME"}
              designation={state.designation || "YOUR DESIGNATION"}
              company={state.company || "NXC Verse"}
              qrSlug="ritesh"
              engraving={state.engraving || "EDITION NO. 001/100"}
              isHero={false}
              showFlipButton={true}
            />

            {/* Bottom Scene HUD */}
            <div className="w-full pt-4 mt-2 flex items-center justify-between border-t border-white/[0.08]">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-[#62626E] uppercase tracking-widest block">
                  PHYSICAL SPECIFICATION
                </span>
                <span className="font-mono text-xs text-[#E2E0DC]">
                  {state.finish.toUpperCase()} · {state.material.toUpperCase()}
                </span>
              </div>
              <div className="text-right space-y-0.5">
                <span className="font-mono text-[10px] text-[#62626E] uppercase tracking-widest block">
                  HARDWARE INVESTMENT
                </span>
                <span className="font-sans font-medium text-sm text-white">
                  {formatCurrency(currentPrice, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (40%): Luxury Control Panel */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Variant Selector */}
            <div className="bg-[#060608] border border-white/[0.1] rounded-[10px] p-5 space-y-3 shadow-lg">
              <label className="block font-mono text-[11px] text-text-tertiary uppercase tracking-widest">
                01. Hardware Edition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["verse", "metal", "atelier"] as Variant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => dispatch({ type: "SET_VARIANT", payload: v })}
                    className={`p-3 rounded-[2px] border text-center transition-all ${
                      state.variant === v
                        ? "bg-[#18181C] border-[#F2F0EC] text-white shadow-md"
                        : "bg-[#0E0E10] border-[#2A2A32] text-text-secondary hover:border-[#3A3A45]"
                    }`}
                  >
                    <span className="font-sans font-semibold text-xs capitalize block">{v}</span>
                    <span className="font-mono text-[10px] text-accent-silver block mt-0.5">
                      {formatCurrency(pricingMap[v][currency], currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Finish & Material Selector */}
            <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-3">
              <label className="block font-mono text-[11px] text-text-tertiary uppercase tracking-widest">
                02. Metal Finish & Hue
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => dispatch({ type: "SET_FINISH", payload: f.id })}
                    className={`p-2.5 rounded-[2px] border flex items-center gap-2.5 transition-all text-left ${
                      state.finish === f.id
                        ? "bg-[#18181C] border-[#F2F0EC] shadow-md"
                        : "bg-[#0E0E10] border-[#2A2A32] hover:border-[#3A3A45]"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-inner"
                      style={{ backgroundColor: f.hex }}
                    />
                    <span className="font-sans text-xs text-text-primary truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Laser Engraving Personalization */}
            <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-4">
              <label className="block font-mono text-[11px] text-text-tertiary uppercase tracking-widest">
                03. Back Face Engraving & Details
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-sans text-text-secondary mb-1">
                    Cardholder Name (Back Side)
                  </label>
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                    maxLength={30}
                    className="w-full bg-[#0E0E10] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-silver/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-text-secondary mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={state.designation}
                    onChange={(e) => dispatch({ type: "SET_DESIGNATION", payload: e.target.value })}
                    maxLength={35}
                    className="w-full bg-[#0E0E10] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-silver/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-text-secondary mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={state.company}
                    onChange={(e) => dispatch({ type: "SET_COMPANY", payload: e.target.value })}
                    maxLength={30}
                    className="w-full bg-[#0E0E10] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-silver/60"
                  />
                </div>

                {state.variant === "atelier" && (
                  <div>
                    <label className="block text-xs font-sans text-text-secondary mb-1">
                      Atelier Micro-Engraving (Bottom Line)
                    </label>
                    <input
                      type="text"
                      value={state.engraving}
                      onChange={(e) => dispatch({ type: "SET_ENGRAVING", payload: e.target.value })}
                      placeholder="e.g. BESPOKE EDITION #01"
                      className="w-full bg-[#0E0E10] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-accent-champagne font-mono focus:outline-none focus:border-accent-champagne"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 4. Action & Checkout Trigger */}
            <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest block">
                    TOTAL HARDWARE INVESTMENT
                  </span>
                  <span className="font-sans font-medium text-2xl text-[#F2F0EC]">
                    {formatCurrency(currentPrice, currency)}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#6FCF97] bg-[#1A2E24] px-2 py-1 rounded-[2px] border border-[#26533D]">
                  INCLUDES NFC + QR
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setIsOrderModalOpen(true);
                  setOrderStep("form");
                }}
                className="w-full justify-center text-xs tracking-widest h-12"
              >
                PROCEED TO ORDER THIS DESIGN <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Complete Your Hardware Commission"
        subtitle={`${pricingMap[state.variant].name} · ${state.finish.toUpperCase()} Finish`}
      >
        {orderStep === "form" && (
          <form onSubmit={handleOrderSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-sans font-medium text-text-secondary uppercase tracking-wider mb-1">
                Engraving Name Confirmed
              </label>
              <input
                type="text"
                disabled
                value={state.name}
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3 py-2 text-sm text-text-primary opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-text-secondary uppercase tracking-wider mb-1">
                Email Address (For Sovereign Account & Shipping)
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-[#111114] border border-[#2A2A32] rounded-[2px] px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-text-secondary uppercase tracking-wider mb-1">
                Phone Number (For Delivery Tracking)
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#111114] border border-[#2A2A32] rounded-[2px] px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                COMMISSION CARD ({formatCurrency(currentPrice, currency)})
              </Button>
            </div>
          </form>
        )}

        {orderStep === "processing" && (
          <div className="py-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-accent-silver border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-sans text-sm text-text-primary">Generating hardware manufacturing record...</p>
          </div>
        )}

        {orderStep === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1A2E24] border border-[#26533D] text-[#6FCF97] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-sans font-semibold text-lg text-text-primary">
                Design Commissioned
              </h4>
              <p className="font-sans text-xs text-text-secondary mt-1">
                Your bespoke {state.finish} card is entering the laser engraving queue.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full justify-center">
                  ACCESS YOUR DASHBOARD
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
