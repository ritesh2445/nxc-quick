import React from "react";
import { Users, CreditCard, Globe, Shield } from "lucide-react";

export function MetricsBar() {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Visionaries Empowered",
    },
    {
      icon: CreditCard,
      value: "50K+",
      label: "Hardware Cards Milled",
    },
    {
      icon: Globe,
      value: "150+",
      label: "Countries Delivered",
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Client Satisfaction",
    },
  ];

  return (
    <div className="w-full bg-[#000000] border-y border-white/[0.08] py-8 px-4 sm:px-6 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center gap-3 sm:gap-4 justify-start md:justify-center min-w-0">
              <div className="p-2.5 sm:p-3 rounded-[10px] bg-[#0E0E12] border border-white/10 text-white flex items-center justify-center shrink-0 shadow-inner">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E2E0DC] stroke-[1.5]" />
              </div>
              <div className="text-left space-y-0.5 min-w-0">
                <p className="font-sans font-medium text-xl sm:text-2xl md:text-3xl text-white tracking-tight truncate">
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

