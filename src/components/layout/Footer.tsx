import React from "react";
import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function Footer() {
  return (
    <footer className="w-full bg-[#000000] border-t border-white/[0.08] pt-16 pb-12 text-left overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-sans font-bold text-xl tracking-[0.25em] text-white">
                NXC <span className="font-light text-[#E2E0DC]">VERSE</span>
              </span>
            </Link>
            <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed max-w-sm">
              Crafting premium NFC and QR visiting cards forged in aerospace-grade metal, paired with a permanent sovereign digital profile.
            </p>
            <div className="pt-2 flex items-center gap-3">
              {/* Glowing Social Links in Footer */}
              <a
                href="https://instagram.com/nxcverse.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-[8px] bg-[#0E0E12] border border-white/10 hover:border-[#E1306C]/60 text-[#9E9EA8] hover:text-white transition-all hover:shadow-[0_0_20px_rgba(225,48,108,0.35)] btn-interactive"
                aria-label="Instagram @nxcverse.in"
              >
                <Instagram className="w-4 h-4 text-[#E1306C]" />
              </a>

              <a
                href="https://wa.me/919561248677"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-[8px] bg-[#0E0E12] border border-white/10 hover:border-[#25D366]/60 text-[#9E9EA8] hover:text-white transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.35)] btn-interactive"
                aria-label="WhatsApp Concierge"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              </a>

              <a
                href="mailto:nxcbadge@gmail.com"
                className="p-2.5 rounded-[8px] bg-[#0E0E12] border border-white/10 hover:border-white/40 text-[#9E9EA8] hover:text-white transition-all"
                aria-label="Email Concierge"
              >
                <Mail className="w-4 h-4 text-[#E2E0DC]" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold text-white tracking-widest uppercase">
              Product & Atelier
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9EA8]">
              <li>
                <Link href="/order" className="text-white hover:text-[#00A2FF] transition-colors font-medium">
                  Order Metal Card
                </Link>
              </li>
              <li>
                <Link href="/designs" className="hover:text-white transition-colors">
                  Hardware Collection
                </Link>
              </li>
              <li>
                <Link href="/customize" className="hover:text-white transition-colors">
                  Card Configurator
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Acquisition Tiers
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Concierge & Legal */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold text-white tracking-widest uppercase">
              Direct Concierge
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9EA8]">
              <li>
                <a
                  href="mailto:nxcbadge@gmail.com"
                  className="font-mono text-[#E2E0DC] hover:text-white transition-colors"
                >
                  nxcbadge@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919561248677"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[#25D366] hover:underline"
                >
                  +91 9561248677
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/nxcverse.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9E9EA8] hover:text-white transition-colors"
                >
                  @nxcverse.in
                </a>
              </li>
              <li>
                <span className="text-[#62626E]">Lifetime Craftsmanship Warranty</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-[#62626E]">
          <p>© 2026 NXC Verse. All rights reserved.</p>
          <div className="flex items-center gap-6 font-mono text-[11px] tracking-wider text-[#9E9EA8]">
            <span>SOVEREIGN DIGITAL IDENTITY</span>
            <span>·</span>
            <span>MADE IN INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
