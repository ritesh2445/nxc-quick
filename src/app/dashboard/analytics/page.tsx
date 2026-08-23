import React from "react";
import { getUserDashboardData } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Smartphone,
  Eye,
  ArrowDownToLine,
  Radio,
  QrCode,
  Sparkles,
  Activity,
  MapPin,
  Laptop,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getUserDashboardData("usr_ritesh");
  const stats = data?.stats || { totalViews: 14, totalSaves: 8, totalScans: 4, totalTaps: 9 };
  const events = data?.recentEvents || [];

  const conversionRate = stats.totalViews > 0
    ? ((stats.totalSaves / stats.totalViews) * 100).toFixed(1)
    : "0";

  const metricCards = [
    {
      title: "Total Impressions",
      value: stats.totalViews.toString(),
      icon: Eye,
      detail: "Unique visitors across edge nodes",
      color: "text-[#00A2FF]",
      accent: "bg-[#0055FF]/15 border-[#0099FF]/40",
    },
    {
      title: "Contact Saves (.VCF)",
      value: stats.totalSaves.toString(),
      icon: ArrowDownToLine,
      detail: `${conversionRate}% conversion rate`,
      color: "text-[#25D366]",
      accent: "bg-[#25D366]/10 border-[#25D366]/30",
    },
    {
      title: "NFC Contactless Taps",
      value: stats.totalTaps.toString(),
      icon: Radio,
      detail: "Direct physical card encounters",
      color: "text-[#00E5FF]",
      accent: "bg-[#00E5FF]/15 border-[#00E5FF]/30",
    },
    {
      title: "QR Matrix Scans",
      value: stats.totalScans.toString(),
      icon: QrCode,
      detail: "Camera and laser matrix captures",
      color: "text-[#70A5FF]",
      accent: "bg-[#0055FF]/15 border-[#0055FF]/30",
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> TRAFFIC & TELEMETRY STREAM
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Real-Time Analytics
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
            Real-time telemetry tracking physical card encounters, contact conversions, and device distributions.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0055FF]/15 border border-[#0099FF]/40 text-[#80D0FF] font-mono text-[11px] font-semibold self-start sm:self-auto shadow-[0_0_15px_rgba(0,140,255,0.2)]">
          <div className="w-2 h-2 rounded-full bg-[#00A2FF] animate-pulse" />
          <span>LIVE TELEMETRY ACTIVE</span>
        </div>
      </div>

      {/* Conversion & Telemetry Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metricCards.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] hover:border-[#0099FF]/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8E8E98] uppercase tracking-[0.2em] font-semibold">
                  {m.title}
                </span>
                <div className={`p-2 rounded-xl border ${m.accent} ${m.color} group-hover:shadow-[0_0_10px_rgba(0,140,255,0.3)] transition-all`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-cinzel text-2xl sm:text-3xl font-medium text-white tracking-wide">
                  {m.value}
                </div>
                <p className={`font-sans text-[11px] leading-relaxed ${m.color === "text-[#25D366]" ? "text-[#25D366] font-medium" : "text-[#7E7E8E]"}`}>
                  {m.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Event Log Box */}
      <div className="bg-[#06060A]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-6 space-y-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-cinzel font-medium text-sm sm:text-base text-white tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00A2FF]" />
            Granular Interaction History
          </h3>
          <span className="font-mono text-[10px] text-[#00A2FF] uppercase font-semibold">
            EDGE LOGS
          </span>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#7E7E8E] font-sans space-y-2">
            <Activity className="w-8 h-8 text-[#42424E] mx-auto stroke-[1.2]" />
            <p>No telemetry events logged yet. Tap your physical NFC card to generate telemetry.</p>
          </div>
        ) : (
          <>
            {/* Mobile Event Feed (< md screens) */}
            <div className="md:hidden divide-y divide-white/[0.05]">
              {events.map((evt: any) => (
                <div key={evt.id} className="py-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-full bg-[#0055FF]/15 border border-[#0099FF]/30 text-[#80D0FF]">
                      {evt.eventType.replace("_", " ")}
                    </span>
                    <span className="font-mono text-[10px] text-[#70707C]">
                      {formatDate(evt.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#9E9EA8] text-[11px] pt-0.5">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-[#62626E]" />
                      <span className="truncate max-w-[150px]">{evt.device || "Mobile Device"}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#C8C6C0]">
                      <MapPin className="w-3 h-3 text-[#00A2FF]" />
                      <span>{evt.city ? `${evt.city}, ` : ""}{evt.country || "India"}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8E8E98] font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-3 px-2">Event Type</th>
                    <th className="pb-3 px-2">Source / Referrer</th>
                    <th className="pb-3 px-2">Device / Platform</th>
                    <th className="pb-3 px-2">Location</th>
                    <th className="pb-3 px-2 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {events.map((evt: any) => (
                    <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#0055FF]/15 border border-[#0099FF]/30 text-[#80D0FF]">
                          {evt.eventType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#9E9EA8]">{evt.referrer || "Direct Sovereign NFC"}</td>
                      <td className="py-3 px-2 text-white">{evt.device || "Safari / iOS"}</td>
                      <td className="py-3 px-2 text-[#C8C6C0]">{evt.city ? `${evt.city}, ` : ""}{evt.country || "India"}</td>
                      <td className="py-3 px-2 text-right font-mono text-[11px] text-[#70707C]">
                        {formatDate(evt.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
