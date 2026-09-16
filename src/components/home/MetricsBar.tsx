import React from "react";
import { Zap, QrCode, Cpu, Smartphone } from "lucide-react";

export function MetricsBar() {
  const stats = [
    {
      icon: Zap,
      value: "0.1 SEC",
      label: "Contactless NFC Tap Speed",
    },
    {
      icon: QrCode,
      value: "DUAL LINK",
      label: "NFC Chip + Dynamic QR Matrix",
    },
    {
      icon: Cpu,
      value: "CNC METAL",
      label: "Aerospace-Grade Precision Milled",
    },
    {
      icon: Smartphone,
      value: "ZERO APP",
      label: "100% Native Smartphone Link",
    },
  ];

  return (
    <div className="w-full bg-[#000000] border-y border-white/[0.08] py-7 px-4 sm:px-6 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center gap-3 sm:gap-4 justify-start md:justify-center min-w-0">
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#0E0E12] border border-white/10 text-[#E2E0DC] flex items-center justify-center shrink-0 shadow-inner">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E2E0DC] stroke-[1.5]" />
              </div>
              <div className="text-left space-y-0.5 min-w-0">
                <p className="font-cinzel font-medium text-base sm:text-xl text-white tracking-tight truncate">
                  {stat.value}
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-[#9E9EA8] tracking-normal font-normal break-words">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
