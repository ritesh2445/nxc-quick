import React from "react";
import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function FooterContent() {
  return (
    <footer className="w-full bg-[#000000] border-t border-white/[0.08] pt-16 pb-12 text-left overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 pb-16 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed max-w-sm">
              Crafting premium NFC and QR visiting cards forged in aerospace-grade metal, paired with a permanent sovereign digital profile.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/nxcverse.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0E0E12] border border-white/10 hover:border-white/30 text-[#9E9EA8] hover:text-white transition-all flex items-center justify-center btn-interactive"
                aria-label="Instagram @nxcverse.in"
              >
                <Instagram className="w-4 h-4 text-white/80" />
              </a>

              <a
                href="https://wa.me/919561248677"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0E0E12] border border-white/10 hover:border-white/30 text-[#9E9EA8] hover:text-white transition-all flex items-center justify-center btn-interactive"
                aria-label="WhatsApp Contact"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              </a>

              <a
                href="mailto:nxcbadge@gmail.com"
                className="w-10 h-10 rounded-xl bg-[#0E0E12] border border-white/10 hover:border-white/30 text-[#9E9EA8] hover:text-white transition-all flex items-center justify-center btn-interactive"
                aria-label="Email Concierge"
              >
                <Mail className="w-4 h-4 text-[#E2E0DC]" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold text-white tracking-widest uppercase">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9EA8]">
              <li><Link href="/order" className="text-white hover:text-white/70 transition-colors font-medium">Order Metal Card</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Acquisition Tiers</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Client Console</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold text-white tracking-widest uppercase">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9EA8]">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
            </ul>
          </div>

          {/* Concierge */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold text-white tracking-widest uppercase">
              Direct Concierge
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9EA8]">
              <li><a href="mailto:nxcbadge@gmail.com" className="font-mono text-[#E2E0DC] hover:text-white transition-colors">nxcbadge@gmail.com</a></li>
              <li><a href="https://wa.me/919561248677" target="_blank" rel="noopener noreferrer" className="font-mono text-[#25D366] hover:underline">+91 9561248677</a></li>
              <li><a href="https://instagram.com/nxcverse.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@nxcverse.in</a></li>
              <li><span className="text-[#62626E]">DPDP Act 2023 Compliant</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-[#62626E]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>© 2026 NXC Verse. All rights reserved.</p>
            <span className="hidden sm:inline text-white/20">·</span>
            <div className="flex items-center gap-3 text-[11px] text-[#8E8E98]">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Refunds</Link>
              <Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] tracking-wider text-[#9E9EA8]">
            <span>SOVEREIGN DIGITAL IDENTITY</span>
            <span>·</span>
            <span>MADE IN INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
