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
  accentColor = "gold",
  highlight = false,
}: AdminKpiCardProps) {
  const colorMap = {
    gold: {
      border: "hover:border-amber-500/40",
      glow: "group-hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      badge: "text-amber-400",
    },
    emerald: {
      border: "hover:border-emerald-500/40",
      glow: "group-hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      badge: "text-emerald-400",
    },
    cyan: {
      border: "hover:border-cyan-500/40",
      glow: "group-hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      badge: "text-cyan-400",
    },
    purple: {
      border: "hover:border-purple-500/40",
      glow: "group-hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      badge: "text-purple-400",
    },
    crimson: {
      border: "hover:border-rose-500/40",
      glow: "group-hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]",
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      badge: "text-rose-400",
    },
  };

  const scheme = colorMap[accentColor] || colorMap.gold;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#0C0C12] border transition-all duration-300 p-5 ${
        highlight
          ? "border-amber-500/40 shadow-[0_4px_30px_rgba(245,158,11,0.08)]"
          : "border-white/10"
      } ${scheme.border} ${scheme.glow}`}
    >
      {/* Background ambient light */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">
            {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-cinzel text-white tracking-tight">
            {value}
          </div>
        </div>

        <div
          className={`p-2.5 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${scheme.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5 text-xs">
        {trend ? (
          <div
            className={`flex items-center gap-1 font-mono text-[11px] ${
              trend.isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{trend.value}</span>
            <span className="text-neutral-300 font-sans ml-1">vs last cycle</span>
          </div>
        ) : subtitle ? (
          <span className="text-neutral-300 font-mono text-[11px]">{subtitle}</span>
        ) : (
          <span className="text-neutral-400 font-mono text-[10px]">Real-time Telemetry</span>
        )}
      </div>
    </div>
  );
}
