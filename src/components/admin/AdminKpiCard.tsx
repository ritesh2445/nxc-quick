"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface AdminKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  accentColor?: "gold" | "emerald" | "cyan" | "purple" | "crimson";
  highlight?: boolean;
}

export function AdminKpiCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  highlight = false,
}: AdminKpiCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#0B0B0F] border transition-all duration-300 p-5 ${
        highlight
          ? "border-white/20 shadow-[0_4px_24px_rgba(255,255,255,0.03)]"
          : "border-white/[0.08] hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-medium">
            {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-cinzel text-white tracking-tight">
            {value}
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-neutral-200 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:text-white">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.05] text-xs">
        {trend ? (
          <div
            className={`flex items-center gap-1 font-mono text-[11px] ${
              trend.isPositive ? "text-emerald-400/90" : "text-neutral-400"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{trend.value}</span>
            <span className="text-neutral-500 font-sans ml-1">vs last cycle</span>
          </div>
        ) : subtitle ? (
          <span className="text-neutral-400 font-mono text-[11px]">{subtitle}</span>
        ) : (
          <span className="text-neutral-500 font-mono text-[10px]">Real-time Telemetry</span>
        )}
      </div>
    </div>
  );
}
