// import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function BrandLogo({
  className,
  size = "md",
  href = "/",
}: BrandLogoProps) {
  const content = (
    <div
      className={cn(
        "group relative inline-flex items-center gap-2.5 sm:gap-3 focus:outline-none select-none cursor-pointer py-1 transition-opacity hover:opacity-90",
        className
      )}
    >
      {/* 1. Official NXC Logo Emblem (Clean, Retina-Crisp, Understated Luxury) */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
          size === "sm" && "w-6 h-6",
          size === "md" && "w-7 h-7 sm:w-8 sm:h-8",
          size === "lg" && "w-9 h-9 sm:w-10 sm:h-10"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/logo-no-bg.webp"
          alt="NXC Verse Logo"
          width={40}
          height={54}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] brightness-105 pointer-events-none select-none"
        />
      </div>

      {/* 2. Brand Wordmark (Refined Roman Luxury Serif + Subtitle) */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-cinzel font-semibold tracking-[0.22em] text-white transition-colors flex items-center",
            size === "sm" && "text-xs tracking-[0.2em]",
            size === "md" && "text-sm sm:text-base md:text-lg tracking-[0.22em]",
            size === "lg" && "text-lg sm:text-xl tracking-[0.24em]"
          )}
        >
          <span>NXC</span>
          &nbsp;
          <span className="font-light text-[#D4D2CD] group-hover:text-white transition-colors">
            VERSE
          </span>
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
