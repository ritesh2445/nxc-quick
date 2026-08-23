"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/Button";
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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
          company: company || "NXC Sovereign Network",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account");
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
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-left">
      {/* Ambient background studio glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#0099FF]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center space-y-4">
          <Link href="/">
            <BrandLogo size="lg" />
          </Link>
          <div className="space-y-1">
            <h1 className="font-cinzel text-xl sm:text-2xl font-medium tracking-wide text-white">
              Client Access Portal
            </h1>
            <p className="font-sans text-xs text-[#9E9EA8]">
              Manage sovereign digital profiles, live hardware cards & captured leads.
            </p>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-[#050508]/90 border border-white/[0.1] rounded-[24px] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.98)] backdrop-blur-2xl space-y-6">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setError(null);
              }}
              className={`py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
                tab === "login"
                  ? "bg-gradient-to-r from-[#0055FF] to-[#0088FF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]"
                  : "text-[#8E8E98] hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("register");
                setError(null);
              }}
              className={`py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
                tab === "register"
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

          {/* Sign In Form */}
          {tab === "login" ? (
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
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#62626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                    className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] pl-10 pr-4 py-3 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                  Permanent Username Handle
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-[#62626E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="handle"
                    className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] pl-10 pr-4 py-3 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] transition-colors font-mono"
                  />
                </div>
                <p className="font-sans text-[10px] text-[#00A2FF] mt-1">
                  ✦ Permanent Sovereign URL: nxcverse.in/@{username || "yourname"}
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
                    placeholder="Managing Partner"
                    className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
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
                    className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[10px] px-3 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
              </div>

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
                <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                  Password
                </label>
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
                CREATE ACCOUNT <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </form>
          )}

          {/* Divider & 1-Click Demo Sign In */}
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
  );
}
