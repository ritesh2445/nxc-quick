import React from "react";
import Link from "next/link";
import { getUserDashboardData } from "@/lib/db/queries";
import {
  Eye,
  ArrowDownToLine,
  QrCode,
  Radio,
  ExternalLink,
  Edit,
  CreditCard,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Query primary customer account data
  const data = await getUserDashboardData("usr_ritesh");

  if (!data) {
    return <div className="p-8 text-[#9E9EA8]">Account data not found.</div>;
  }

  const { profile, card, subscription, stats, recentEvents } = data;

  const statCards = [
    {
      title: "Profile Views",
      value: stats.totalViews.toString(),
      icon: Eye,
      detail: "Unique visitors to your sovereign URL",
      color: "text-[#00A2FF]",
    },
    {
      title: "Contact Saves",
      value: stats.totalSaves.toString(),
      icon: ArrowDownToLine,
      detail: "1-Click .VCF contact downloads",
      color: "text-[#66C2FF]",
    },
    {
      title: "QR Scans",
      value: stats.totalScans.toString(),
      icon: QrCode,
      detail: "Physical card laser QR matrix scans",
      color: "text-[#80D0FF]",
    },
    {
      title: "NFC Taps",
      value: stats.totalTaps.toString(),
      icon: Radio,
      detail: "Direct contactless hardware taps",
      color: "text-[#0077FF]",
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> CLIENT CONSOLE · SOVEREIGN IDENTITY
          </span>
          <h1 className="font-cinzel font-medium text-2xl md:text-3xl text-white tracking-tight mt-1">
            Welcome back, {profile.fullName}
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
            Your physical NFC card is active and linked to <code className="font-mono text-white font-medium bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">nxcverse.in/@{profile.username}</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/@${profile.username}`} target="_blank" className="btn-interactive">
            <button className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/20 hover:border-[#0099FF]/50 text-xs font-sans text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5 shadow-sm">
              <ExternalLink className="w-3.5 h-3.5 text-[#00A2FF]" />
              <span>View Live Profile</span>
            </button>
          </Link>
          <Link href="/dashboard/profile" className="btn-interactive">
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white text-xs font-sans font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,120,255,0.4)] flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Metrics Grid (Glassmorphism & Electric Blue Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-5 space-y-3 backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] hover:border-[#0099FF]/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8E8E98] uppercase tracking-[0.2em] font-semibold">
                  {s.title}
                </span>
                <div className="p-2 rounded-xl bg-white/[0.03] text-[#00A2FF] border border-white/[0.08] group-hover:border-[#0099FF]/40 group-hover:shadow-[0_0_10px_rgba(0,140,255,0.3)] transition-all">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-cinzel text-3xl font-medium text-white tracking-wide">
                  {s.value}
                </div>
                <p className="font-sans text-[11px] text-[#7E7E8E] leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Section: Active Card Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Physical Hardware Status */}
        <div className="lg:col-span-6 bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel text-base font-medium text-white tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#00A2FF]" />
              Physical Hardware
            </h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0055FF]/15 border border-[#0099FF]/40 text-[#80D0FF] font-mono text-[10px] font-semibold tracking-wider">
              <CheckCircle className="w-3 h-3 text-[#00A2FF]" />
              HARDWARE PAIRED
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-[#8E8E98]">Edition:</span>
              <span className="text-white font-medium capitalize">{card ? card.variant : "NXC Metal Edition"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-[#8E8E98]">Metallurgical Finish:</span>
              <span className="text-white font-medium uppercase">{card ? card.finish.replace("_", " ") : "PITCH BLACK"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-[#8E8E98]">NFC Chip UID:</span>
              <span className="font-mono text-[#00A2FF] font-semibold">{card ? card.nfcUid : "04:A2:8F:E1:99"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.04]">
              <span className="text-[#8E8E98]">Engraving Serial:</span>
              <span className="font-mono text-white">{card?.customEngraving || "EDITION NO. 001/100"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#8E8E98]">Warranty Status:</span>
              <span className="text-[#25D366] font-medium">LIFETIME COVERAGE</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/dashboard/card" className="block w-full btn-interactive">
              <button className="w-full py-3 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#0099FF]/50 text-white font-sans font-semibold text-xs tracking-wider uppercase transition-all">
                Manage Physical Card & NFC
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Real-Time Event Feed */}
        <div className="lg:col-span-6 bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel text-base font-medium text-white tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00A2FF]" />
              Real-Time Activity
            </h3>
            <span className="font-mono text-[10px] text-[#8E8E98]">
              LIVE STREAM
            </span>
          </div>

          <div className="space-y-3">
            {recentEvents && recentEvents.length > 0 ? (
              recentEvents.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-sans"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#0099FF] shadow-[0_0_6px_#0099FF]" />
                    <span className="text-white font-medium capitalize">{ev.eventType.replace("_", " ")}</span>
                    <span className="text-[#7E7E8E]">· {ev.referrer || "Direct"}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#7E7E8E]">
                    {formatDate(ev.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-[#7E7E8E] font-sans">
                No recent activity recorded yet. Tap your card to generate analytics.
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link href="/dashboard/analytics" className="block w-full btn-interactive">
              <button className="w-full py-3 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#0099FF]/50 text-white font-sans font-semibold text-xs tracking-wider uppercase transition-all">
                View Detailed Analytics
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
