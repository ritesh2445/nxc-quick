import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "champagne" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-accent-silver/40 disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-full tracking-wider cursor-pointer active:scale-[0.98]";

    const variants = {
      primary:
        "bg-gradient-to-b from-[#FAF8F5] via-[#EFECE6] to-[#DFDAD1] text-[#0A0A0B] font-semibold border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_20px_rgba(242,240,236,0.15)] hover:shadow-[0_0_30px_rgba(242,240,236,0.35)] hover:brightness-105 active:brightness-95",
      secondary:
        "bg-[#141418]/90 text-[#F2F0EC] hover:bg-[#1C1C22] border border-white/10 hover:border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]",
      outline:
        "bg-transparent text-[#F2F0EC] border border-white/15 hover:border-white/40 hover:bg-white/[0.04] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
      champagne:
        "bg-gradient-to-b from-[#E8D4BE] via-[#D4B896] to-[#BFA17D] text-[#0A0A0B] font-semibold border border-[#F5E6D3]/40 shadow-[0_4px_20px_rgba(212,184,150,0.25)] hover:shadow-[0_0_30px_rgba(212,184,150,0.45)] hover:brightness-105",
      ghost:
        "bg-transparent text-[#A09E9A] hover:text-[#F2F0EC] hover:bg-white/[0.04]",
      danger:
        "bg-[#8B3A3A] text-[#F2F0EC] hover:bg-[#A34545] border border-red-500/20",
    };

    const sizes = {
      sm: "text-xs px-4 py-1.5 h-8 gap-1.5",
      md: "text-xs md:text-sm px-6 py-2.5 h-10 gap-2",
      lg: "text-xs md:text-sm px-8 py-3.5 h-12 gap-2.5 uppercase tracking-widest font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
