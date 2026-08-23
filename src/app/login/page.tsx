"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DynamicHeroCardScene } from "@/components/3d/DynamicHeroCardScene";
import { CardFinish } from "@/components/3d/InteractiveFlippableCard";
import {
  Lock,
  Mail,
  User,
  AtSign,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  CreditCard,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");

  // Card Selection for Onboarding
  const [selectedTier, setSelectedTier] = useState<"classic" | "metal" | "atelier">("metal");
  const [selectedFinish, setSelectedFinish] = useState<CardFinish>("pitch_black");

  const finishes: { id: CardFinish; name: string; hex: string }[] = [
    { id: "pitch_black", name: "Pitch Black", hex: "#000000" },
    { id: "silver", name: "Silver", hex: "#D8DFE8" },
    { id: "gold", name: "Gold", hex: "#F5D061" },
    { id: "royal_red", name: "Royal Red", hex: "#FF2A55" },
    { id: "cobalt_blue", name: "Cobalt Blue", hex: "#0B3875" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Step 1 -> Step 2
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill out all required fields.");
      return;
    }
    setError(null);
    setRegisterStep(2);
  };

  // Step 2 -> Step 3
  const handleStep2Next = () => {
    setError(null);
    setRegisterStep(3);
  };

  // Complete Registration with Free Digital Profile (Skipped physical card)
  const handleCompleteDigitalOnly = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          username,
          designation: designation || "Executive Member",
          company: company || "Sovereign Network",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create digital profile");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  // Complete Registration and Proceed with Card Order
  const handleOrderCardAndRegister = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
          finish: selectedFinish,
          engravingName: fullName.toUpperCase(),
          engravingTitle: designation.toUpperCase() || "FOUNDER & CEO",
          customerName: fullName,
          customerEmail: email,
          customerPassword: password,
          company: company || "NXC Verse",
          currency: "INR",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate card commission");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to process card order");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("ritesh@nxcverse.in");
    setPassword("ritesh123");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ritesh@nxcverse.in", password: "ritesh123" }),
      });

      if (!res.ok) throw new Error("Demo login failed");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col px-4 relative overflow-hidden text-left">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#0099FF]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Standalone Top Bar */}
      <div className="flex items-center justify-between py-4 relative z-10">
        <Link href="/" className="flex items-center gap-2 font-cinzel text-sm font-semibold tracking-[0.25em] text-white uppercase hover:text-[#00A2FF] transition-colors">
          <span className="text-[#00A2FF]">NXC</span> VERSE
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-sans text-[#9E9EA8] hover:text-white transition-all">
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Site</span>
        </Link>
      </div>

      {/* Main Container — centred vertically in remaining space */}
      <div className="flex-1 flex items-center justify-center py-8">
      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0055FF]/20 to-[#0088FF]/10 border border-[#0099FF]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,140,255,0.25)] mb-1">
            <Lock className="w-5 h-5 text-[#00A2FF]" />
          </div>
          <div className="space-y-1">
            <h1 className="font-cinzel text-xl sm:text-2xl font-medium tracking-wide text-white">
              {mode === "login" ? "Client Access Portal" : "Sovereign Identity Onboarding"}
            </h1>
            <p className="font-sans text-xs text-[#9E9EA8]">
              {mode === "login"
                ? "Manage digital profiles, live hardware cards & captured leads."
                : "Step-by-step master profile creation & optional hardware pairing."}
            </p>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-[#050508]/90 border border-white/[0.1] rounded-[24px] p-5 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.98)] backdrop-blur-2xl space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
                mode === "login"
                  ? "bg-gradient-to-r from-[#0055FF] to-[#0088FF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]"
                  : "text-[#8E8E98] hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setRegisterStep(1);
                setError(null);
              }}
              className={`py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
                mode === "register"
                  ? "bg-gradient-to-r from-[#0055FF] to-[#0088FF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]"
                  : "text-[#8E8E98] hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-[12px] bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* SIGN IN FORM                                              */}
          {/* ========================================================= */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#62626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] pl-10 pr-4 py-3 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] font-sans text-[#62626E]">
                    Default: ritesh123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#62626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] pl-10 pr-4 py-3 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full justify-center tracking-widest text-xs py-3.5 rounded-full mt-2"
              >
                ACCESS CONSOLE <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </form>
          ) : (
            /* ========================================================= */
            /* MULTI-STEP REGISTRATION & OPTIONAL CARD FLOW (FLOW B)      */
            /* ========================================================= */
            <div className="space-y-5">
              {/* Progress Indicators */}
              <div className="flex items-center justify-between px-2 text-[10px] font-mono text-[#8E8E98] border-b border-white/[0.06] pb-3">
                <span className={registerStep >= 1 ? "text-[#00A2FF] font-semibold" : ""}>
                  1. Identity
                </span>
                <span>→</span>
                <span className={registerStep >= 2 ? "text-[#00A2FF] font-semibold" : ""}>
                  2. Card Option
                </span>
                <span>→</span>
                <span className={registerStep >= 3 ? "text-[#00A2FF] font-semibold" : ""}>
                  3. Launch
                </span>
              </div>

              {/* STEP 1: Basic Identity Information */}
              {registerStep === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!username) {
                          setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));
                        }
                      }}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                      Username Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="handle"
                      className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] font-mono"
                    />
                    <p className="font-sans text-[10px] text-[#00A2FF] mt-1">
                      ✦ Sovereign URL: nxcverse.in/@{username || "yourname"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Managing Director"
                        className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3 py-2 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Apex Capital"
                        className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3 py-2 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full justify-center tracking-widest text-xs py-3 rounded-full mt-2"
                  >
                    CONTINUE TO STEP 2 <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </form>
              )}

              {/* STEP 2: Choose Physical Card Option or Preview */}
              {registerStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-widest">
                      OPTIONAL HARDWARE UPGRADE
                    </span>
                    <h3 className="font-cinzel text-base font-medium text-white">
                      Select Physical Hardware Finish
                    </h3>
                  </div>

                  {/* 3D Card Miniature Preview */}
                  <div className="w-full aspect-[4/3] max-w-[280px] mx-auto flex items-center justify-center">
                    <DynamicHeroCardScene
                      finish={selectedFinish}
                      name={fullName || "SOVEREIGN MEMBER"}
                      designation={designation || "FOUNDER"}
                      company={company || "NXC VERSE"}
                      qrSlug={username || "preview"}
                      showFlipButton={false}
                    />
                  </div>

                  {/* Finish Selector */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {finishes.map((f) => {
                      const isActive = selectedFinish === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFinish(f.id)}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            isActive
                              ? "bg-[#0A0A12] border-[#0099FF] shadow-[0_0_12px_rgba(0,140,255,0.4)]"
                              : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full border border-white/30"
                            style={{ backgroundColor: f.hex }}
                          />
                          <span className="font-mono text-[8px] text-[#8E8E98] truncate w-full">
                            {f.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#8E8E98] hover:text-white"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleStep2Next}
                      className="flex-1 justify-center tracking-widest text-xs py-2.5 rounded-full"
                    >
                      PROCEED TO REVIEW <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Choice (Order Card OR Skip for Free Digital Profile) */}
              {registerStep === 3 && (
                <div className="space-y-5 text-center">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2 text-left text-xs">
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-[#8E8E98]">Identity:</span>
                      <span className="text-white font-medium">{fullName} (@{username})</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-[#8E8E98]">Hardware Choice:</span>
                      <span className="text-white capitalize">{selectedFinish.replace("_", " ")} Metal Edition</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8E98]">Digital Profile:</span>
                      <span className="text-[#25D366] font-mono">LIFETIME FREE INCLUDED</span>
                    </div>
                  </div>

                  {/* Primary Option: Order Physical Card */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleOrderCardAndRegister}
                      disabled={loading}
                      className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,120,255,0.4)] hover:shadow-[0_0_30px_rgba(0,150,255,0.6)] flex items-center justify-center gap-2 btn-interactive"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>ORDER {selectedFinish.toUpperCase()} CARD (₹1,599)</span>
                    </button>
                    <p className="font-sans text-[10px] text-[#8E8E98]">
                      Includes laser engraving, contactless NFC chip & lifetime sovereign cloud hosting.
                    </p>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="flex-shrink mx-3 text-[10px] font-mono text-[#62626E] uppercase tracking-wider">
                      OR
                    </span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  {/* Secondary Option: Skip Card for Free Digital Profile */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleCompleteDigitalOnly}
                      disabled={loading}
                      className="w-full py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 text-white font-sans font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 btn-interactive"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00A2FF]" />
                      <span>SKIP FOR NOW — LAUNCH FREE DIGITAL PROFILE</span>
                    </button>
                    <p className="font-sans text-[10px] text-[#7E7E8E]">
                      You can commission a physical aerospace metal card anytime later from your console.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Sign In */}
          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/15 text-xs font-mono text-[#E2E0DC] hover:text-white flex items-center justify-center gap-2 transition-all btn-interactive"
            >
              <Zap className="w-3.5 h-3.5 text-[#00A2FF]" />
              <span>1-CLICK QUICK DEMO SIGN IN (ritesh@nxcverse.in)</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-sans text-[#62626E]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A2FF]" />
              <span>256-Bit Encrypted Sovereign Authentication</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
