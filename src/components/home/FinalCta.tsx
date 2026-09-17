import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";
import { PhoenixEmblem } from "@/components/3d/PhoenixSvg";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function FinalCta() {
  return (
    <section className="w-full py-20 sm:py-28 md:py-32 px-4 sm:px-6 bg-[#000000] border-t border-white/[0.08] relative overflow-hidden text-center select-none">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        {/* Subtle Watermark NXC Logo */}
        <div className="w-14 sm:w-16 h-18 sm:h-20 mx-auto opacity-80 flex items-center justify-center">
          <PhoenixEmblem />
        </div>

        <div className="space-y-3">
          <h2 className="font-cinzel font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Make an impression that stays.
          </h2>
          <p className="font-sans text-xs sm:text-base text-[#9E9EA8] max-w-lg mx-auto leading-relaxed">
            Your physical metal card introduces you. Your sovereign digital identity keeps you connected forever.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/order" className="btn-interactive">
            <Button variant="primary" size="lg" className="min-h-[46px] px-8 bg-white text-black font-semibold hover:bg-[#EAE8E4] shadow-[0_4px_24px_rgba(255,255,255,0.18)] border-none rounded-full text-xs tracking-wider">
              <span>ACQUIRE YOUR CARD</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          <a
            href="https://wa.me/919561248677"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[46px] px-6 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 text-white font-sans font-medium flex items-center gap-2 text-xs tracking-wider transition-all shadow-sm btn-interactive"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
            <span>WhatsApp Contact</span>
          </a>
        </div>

        <div className="pt-6">
          <span className="font-mono text-[10px] text-[#62626E] tracking-[0.22em] uppercase">
            SHIPPED GLOBALLY · READY IN 48 HOURS · LIFETIME WARRANTY
          </span>
        </div>
      </div>
    </section>
  );
}
