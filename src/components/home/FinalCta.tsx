import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";
import { PhoenixEmblem } from "@/components/3d/PhoenixSvg";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function FinalCta() {
  return (
    <section className="w-full py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-[#000000] border-t border-white/[0.08] relative overflow-hidden text-center select-none">
      {/* Background radial luxury glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        {/* Subtle Watermark NXC Logo */}
        <div className="w-16 sm:w-20 h-20 sm:h-24 mx-auto opacity-85 flex items-center justify-center">
          <PhoenixEmblem />
        </div>

        <div className="space-y-4">
          <h2 className="font-sans font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Make an impression that stays.
          </h2>
          <p className="font-sans text-sm md:text-base text-[#9E9EA8] max-w-lg mx-auto leading-relaxed">
            Your physical card introduces you. Your sovereign digital identity keeps you connected forever.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/order" className="btn-interactive">
            <Button variant="primary" size="lg" className="h-12 px-8 bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white font-bold shadow-[0_0_30px_rgba(0,120,255,0.45)] hover:shadow-[0_0_45px_rgba(0,150,255,0.7)] border-none">
              ACQUIRE YOUR CARD <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/customize" className="btn-interactive">
            <Button variant="outline" size="lg" className="h-12 px-8 border-white/20 hover:border-white/60 text-white backdrop-blur-md">
              CUSTOMIZE ATELIER
            </Button>
          </Link>
          <a
            href="https://wa.me/919561248677"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-6 rounded-full bg-[#0E0E12] border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] hover:text-white flex items-center gap-2 text-xs font-mono tracking-wider transition-all duration-300 hover:shadow-[0_0_25px_rgba(37,211,102,0.35)] btn-interactive"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" /> WhatsApp Concierge
          </a>
        </div>

        <div className="pt-8">
          <span className="font-mono text-[10px] text-[#62626E] tracking-[0.25em] uppercase">
            SHIPPED GLOBALLY · READY IN 48 HOURS · LIFETIME WARRANTY
          </span>
        </div>
      </div>
    </section>
  );
}
