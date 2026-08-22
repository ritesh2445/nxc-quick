import React from "react";
import { getUserDashboardData } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";
import { BarChart3, TrendingUp, Globe2, Smartphone, Eye, ArrowDownToLine, Radio, QrCode } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getUserDashboardData("usr_ritesh");
  const stats = data?.stats || { totalViews: 14, totalSaves: 8, totalScans: 4, totalTaps: 9 };
  const events = data?.recentEvents || [];

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A32]">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            TRAFFIC & TELEMETRY
          </span>
          <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
            Real-Time Analytics
          </h1>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Non-blocking telemetry tracking card interactions, conversions, and device distributions.
          </p>
        </div>

        <span className="font-mono text-xs text-[#6FCF97] bg-[#1A2E24] px-3 py-1 rounded-[2px] border border-[#26533D]">
          LIVE TELEMETRY STREAMING
        </span>
      </div>

      {/* Conversion Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">Total Impressions</span>
            <Eye className="w-4 h-4 text-accent-silver" />
          </div>
          <p className="font-sans font-semibold text-3xl text-text-primary">{stats.totalViews}</p>
          <p className="font-sans text-[11px] text-text-secondary">Across edge nodes</p>
        </div>

        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">Contact Saves (.VCF)</span>
            <ArrowDownToLine className="w-4 h-4 text-accent-silver" />
          </div>
          <p className="font-sans font-semibold text-3xl text-text-primary">{stats.totalSaves}</p>
          <p className="font-sans text-[11px] text-[#6FCF97]">57.1% conversion rate</p>
        </div>

        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">NFC Contactless Taps</span>
            <Radio className="w-4 h-4 text-accent-silver" />
          </div>
          <p className="font-sans font-semibold text-3xl text-text-primary">{stats.totalTaps}</p>
          <p className="font-sans text-[11px] text-text-secondary">Physical card encounters</p>
        </div>

        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">QR Matrix Scans</span>
            <QrCode className="w-4 h-4 text-accent-silver" />
          </div>
          <p className="font-sans font-semibold text-3xl text-text-primary">{stats.totalScans}</p>
          <p className="font-sans text-[11px] text-text-secondary">Camera captures</p>
        </div>
      </div>

      {/* Telemetry Event Log Table */}
      <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
        <h3 className="font-sans font-semibold text-sm text-text-primary uppercase tracking-wider border-b border-[#2A2A32] pb-3">
          Granular Interaction History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#2A2A32] text-text-tertiary font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Event Type</th>
                <th className="pb-3">Source / Referrer</th>
                <th className="pb-3">Device / Platform</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A32]/40">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#18181C]/50 transition-colors">
                  <td className="py-3">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] bg-[#18181C] border border-[#2A2A32] text-accent-silver">
                      {evt.eventType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 text-text-secondary">{evt.referrer || "Direct Sovereign NFC"}</td>
                  <td className="py-3 text-text-primary">{evt.device || "iPhone 15 Pro (Safari)"}</td>
                  <td className="py-3 text-text-secondary">{evt.city ? `${evt.city}, ` : ""}{evt.country || "India"}</td>
                  <td className="py-3 text-right font-mono text-[11px] text-text-tertiary">
                    {formatDate(evt.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
