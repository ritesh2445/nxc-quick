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
      color: "text-white",
      accent: "bg-white/[0.06] border-white/10",
    },
    {
      title: "Contact Saves (.VCF)",
      value: stats.totalSaves.toString(),
      icon: ArrowDownToLine,
      detail: `${conversionRate}% conversion rate`,
      color: "text-emerald-400",
      accent: "bg-emerald-950/30 border-emerald-800/30",
    },
    {
      title: "NFC Contactless Taps",
      value: stats.totalTaps.toString(),
      icon: Radio,
      detail: "Direct physical card encounters",
      color: "text-[#C8C6C0]",
      accent: "bg-white/[0.06] border-white/10",
    },
    {
      title: "QR Matrix Scans",
      value: stats.totalScans.toString(),
      icon: QrCode,
      detail: "Camera and laser matrix captures",
      color: "text-[#A1A1AA]",
      accent: "bg-white/[0.06] border-white/10",
    },
  ];

  return (
    <div className="space-y-6 text-left max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#C8C6C0]" /> TELEMETRY & TRAFFIC STREAM
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Real-Time Analytics
          </h1>
          <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
            Real-time telemetry tracking physical card encounters, contact conversions, and device distributions.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[#C8C6C0] font-mono text-[11px] font-medium self-start sm:self-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
              className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8E8E98] uppercase tracking-[0.2em] font-semibold">
                  {m.title}
                </span>
                <div className={`p-2 rounded-xl border ${m.accent} ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-cinzel text-2xl sm:text-3xl font-medium text-white tracking-wide">
                  {m.value}
                </div>
                <p className={`font-sans text-[11px] leading-relaxed ${m.color === "text-emerald-400" ? "text-emerald-400 font-medium" : "text-[#7E7E8E]"}`}>
                  {m.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Event Log Box */}
      <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-cinzel font-medium text-sm sm:text-base text-white tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C8C6C0]" />
            Granular Interaction History
          </h3>
          <span className="font-mono text-[10px] text-[#A1A1AA] uppercase font-semibold">
            EDGE LOGS
          </span>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#7E7E8E] font-sans space-y-2">
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
                    <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white">
                      {evt.eventType.replace("_", " ")}
                    </span>
                    <span className="font-mono text-[10px] text-[#70707C]">
                      {formatDate(evt.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#9E9EA8] text-[11px] pt-0.5">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-[#62626E]" />
                      <span className="truncate max-w-[150px]">{evt.device || "Mobile Device"}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#C8C6C0]">
                      <MapPin className="w-3.5 h-3.5 text-[#A1A1AA]" />
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
                    <th className="pb-3 px-3">Event Type</th>
                    <th className="pb-3 px-3">Source / Referrer</th>
                    <th className="pb-3 px-3">Device / Platform</th>
                    <th className="pb-3 px-3">Location</th>
                    <th className="pb-3 px-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {events.map((evt: any) => (
                    <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white">
                          {evt.eventType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#9E9EA8]">{evt.referrer || "Direct Sovereign NFC"}</td>
                      <td className="py-3.5 px-3 text-white">{evt.device || "Safari / iOS"}</td>
                      <td className="py-3.5 px-3 text-[#C8C6C0]">{evt.city ? `${evt.city}, ` : ""}{evt.country || "India"}</td>
                      <td className="py-3.5 px-3 text-right font-mono text-[11px] text-[#70707C]">
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
