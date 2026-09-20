"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Command,
  Flame,
} from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: React.ReactNode;
}

export function AdminHeader({
  title,
  subtitle,
  badge,
  onRefresh,
  isRefreshing = false,
  actions,
}: AdminHeaderProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full bg-[#07070B]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Title, badge, and breadcrumb */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              {title}
            </h1>
            {badge && (
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-0.5 tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: Edge telemetry, fast actions & refresh */}
        <div className="flex items-center gap-3">
          {/* Edge Node Telemetry Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-white/10 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-400">Node:</span>
            <span className="text-white font-medium">BOM-IN-01</span>
            <span className="text-neutral-600">|</span>
            <span className="text-emerald-400 font-medium">18ms</span>
          </div>

          {/* Quick Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Live Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin text-amber-400" : ""}`}
              />
            </button>
          )}

          {/* Custom Action Slots */}
          {actions}
        </div>
      </div>
    </header>
  );
}
