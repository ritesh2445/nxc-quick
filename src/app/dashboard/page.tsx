import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
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
  TrendingUp,
  Shield,
  PlusCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentUser();
  const userId = session?.user?.id || "usr_ritesh";

  // Query account data from D1 / SQLite database
  const data = await getUserDashboardData(userId);

  if (!data) {
    return <div className="p-8 text-[#9E9EA8]">Account data not found.</div>;
  }

  const { profile, card, cards, stats, recentEvents } = data;

  const statCards = [
    {
      title: "Profile Views",
      value: stats.totalViews.toString(),
      icon: Eye,
      detail: "Unique visitors to your sovereign URL",
      color: "text-[#E2E0DC]",
    },
    {
      title: "Contact Saves",
      value: stats.totalSaves.toString(),
      icon: ArrowDownToLine,
      detail: "1-Click .VCF contact downloads",
      color: "text-[#E2E0DC]",
    },
    {
      title: "QR Scans",
      value: stats.totalScans.toString(),
      icon: QrCode,
      detail: "Laser QR matrix scans",
      color: "text-[#E2E0DC]",
    },
    {
      title: "NFC Taps",
      value: stats.totalTaps.toString(),
      icon: Radio,
      detail: "Contactless hardware taps",
      color: "text-[#E2E0DC]",
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div className="space-y-1">
          <span className="font-mono text-[10px] sm:text-[11px] text-[#8E8E98] uppercase tracking-[0.24em] font-medium flex items-center gap-1.5">
            CLIENT CONSOLE · SOVEREIGN IDENTITY
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Welcome back, {profile.fullName}
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] flex flex-wrap items-center gap-1.5 pt-0.5">
            <span>Linked to:</span>
            <code className="font-mono text-white font-medium bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10 break-all text-[11px]">
              nxcverse.in/@{profile.username}
            </code>
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0">
          <Link href={`/@${profile.username}`} target="_blank" className="flex-1 sm:flex-initial btn-interactive">
            <button className="w-full min-h-[42px] px-4 sm:px-5 py-2 rounded-full bg-white/[0.04] border border-white/20 hover:border-white/40 text-xs font-sans text-white hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <ExternalLink className="w-3.5 h-3.5 text-[#A09E9A]" />
              <span>View Live Profile</span>
            </button>
          </Link>
          <Link href="/dashboard/profile" className="flex-1 sm:flex-initial btn-interactive">
            <button className="w-full min-h-[42px] px-4 sm:px-5 py-2 rounded-full bg-white text-black text-xs font-sans font-semibold tracking-wider uppercase transition-colors hover:bg-[#EAE8E4] flex items-center justify-center gap-1.5 shadow-sm">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#08080A] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden backdrop-blur-xl shadow-md hover:border-white/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[11px] text-[#8E8E98] uppercase tracking-wider">
                  {s.title}
                </span>
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>

              <div>
                <div className="font-cinzel text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  {s.value}
                </div>
                <p className="font-sans text-[11px] text-[#7E7E8E] mt-1 line-clamp-1">
                  {s.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Physical Hardware Status */}
        <div className="lg:col-span-6 bg-[#08080A] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-5 backdrop-blur-xl shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel text-sm sm:text-base font-medium text-white tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C8C6C0]" />
              Physical Hardware
            </h3>
            {card ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/20 text-[#E2E0DC] font-mono text-[10px] font-medium tracking-wider">
                <CheckCircle className="w-3 h-3 text-[#25D366]" />
                HARDWARE PAIRED ({cards.length})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-medium tracking-wider">
                DIGITAL IDENTITY ACTIVE
              </span>
            )}
          </div>

          {card ? (
            <div className="space-y-2.5 font-sans text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#8E8E98]">Edition:</span>
                <span className="text-white font-medium capitalize">{card.variant} Metal Edition</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#8E8E98]">Metallurgical Finish:</span>
                <span className="text-white font-medium uppercase">{card.finish.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#8E8E98]">NFC Chip Status:</span>
                <span className="font-mono text-white font-semibold">{card.nfcUid || "ACTIVATED / NTAG216"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#8E8E98]">Engraving:</span>
                <span className="font-mono text-white truncate max-w-[160px] sm:max-w-none">{card.customEngraving || profile.fullName.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8E8E98]">Warranty:</span>
                <span className="text-[#25D366] font-medium">LIFETIME SOVEREIGN GUARANTEE</span>
              </div>

              <div className="pt-2 flex gap-2">
                <Link href="/dashboard/card" className="flex-1 btn-interactive">
                  <button className="w-full min-h-[42px] py-2 rounded-full bg-white/[0.04] border border-white/15 hover:border-white/30 text-white font-sans font-medium text-xs tracking-wider uppercase transition-colors">
                    Manage Card
                  </button>
                </Link>
                <Link href="/order" className="btn-interactive">
                  <button className="min-h-[42px] px-4 py-2 rounded-full bg-white/[0.04] border border-white/15 hover:border-white/30 text-white font-sans font-medium text-xs flex items-center gap-1.5 transition-colors">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Card</span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center py-3">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Shield className="w-4 h-4 text-[#A09E9A]" />
                  <span>Sovereign Digital Identity Tier</span>
                </div>
                <p className="text-[#8E8E98] text-[11px] leading-relaxed">
                  Your digital identity profile at <code className="text-white">nxcverse.in/@{profile.username}</code> is fully active with vCard downloads and lead capture enabled.
                </p>
              </div>

              <Link href="/order" className="block w-full btn-interactive">
                <button className="w-full min-h-[46px] py-3 rounded-full bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase hover:bg-[#EAE8E4] flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <CreditCard className="w-4 h-4" />
                  <span>Commission Aerospace Metal Card (₹1,599)</span>
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Event Feed */}
        <div className="lg:col-span-6 bg-[#08080A] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-5 backdrop-blur-xl shadow-md">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel text-sm sm:text-base font-medium text-white tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C8C6C0]" />
              Real-Time Activity
            </h3>
            <span className="font-mono text-[10px] text-[#A0A0AA] uppercase tracking-wider font-semibold">
              LIVE STREAM
            </span>
          </div>

          <div className="space-y-2.5">
            {recentEvents && recentEvents.length > 0 ? (
              recentEvents.map((ev: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-sans gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    <span className="text-white font-medium capitalize truncate">{ev.eventType.replace("_", " ")}</span>
                    <span className="text-[#7E7E8E] truncate text-[11px]">· {ev.referrer || "Direct"}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#7E7E8E] shrink-0">
                    {formatDate(ev.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-[#7E7E8E] font-sans">
                No recent activity recorded yet. Share your sovereign profile to generate live telemetry.
              </div>
            )}
          </div>

          <div className="pt-1">
            <Link href="/dashboard/analytics" className="block w-full btn-interactive">
              <button className="w-full min-h-[42px] py-2.5 rounded-full bg-white/[0.04] border border-white/15 hover:border-white/30 text-white font-sans font-medium text-xs tracking-wider uppercase transition-colors">
                View Detailed Analytics
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
