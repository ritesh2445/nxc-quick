import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "silver" | "titanium" | "champagne" | "outline" | "success" | "dark";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "outline", size = "sm", children, ...props }: BadgeProps) {
  const base = "inline-flex items-center font-mono font-medium uppercase rounded-[2px] select-none tracking-widest";

  const variants = {
    silver: "bg-[#222228] text-accent-silver border border-[#3A3A45]",
    titanium: "bg-[#18181C] text-accent-titanium border border-[#2A2A32]",
    champagne: "bg-[#2A241C] text-accent-champagne border border-[#4A3D2A]",
    outline: "bg-transparent text-text-secondary border border-border",
    success: "bg-[#1A2E24] text-[#6FCF97] border border-[#26533D]",
    dark: "bg-[#111114] text-text-tertiary border border-border",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
