"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  CreditCard,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  ShoppingBag,
  ArrowUpRight,
  User,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "PRODUCT", href: "/#products", icon: CreditCard },
    { name: "DESIGNS", href: "/designs", icon: Layers },
    { name: "ATELIER", href: "/customize", icon: Sparkles },
    { name: "ORDER", href: "/order", icon: ShoppingBag },
    { name: "HOW IT WORKS", href: "/#how-it-works", icon: Zap },
    { name: "PRICING", href: "/#pricing", icon: ShieldCheck },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-3.5 transition-all duration-500",
          scrolled
            ? "bg-[#000000]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
            : "bg-gradient-to-b from-[#000000]/80 via-[#000000]/40 to-transparent backdrop-blur-md"
        )}
      >
        {/* Subtle Electric Blue Hairline Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0088FF]/30 to-transparent opacity-80 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Wordmark with Electric Blue Core Dot */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none btn-interactive"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0099FF] shadow-[0_0_10px_#0099FF] group-hover:scale-125 transition-transform duration-300" />
            <span className="font-cinzel font-semibold text-lg md:text-xl tracking-[0.25em] text-white group-hover:text-white transition-colors">
              NXC <span className="font-light text-[#E2E0DC]">VERSE</span>
            </span>
          </Link>

          {/* Center: Navigation Links with Symbols & Glassmorphic Hover */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[10px] font-sans font-medium tracking-[0.2em] uppercase px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 group btn-interactive",
                    isActive
                      ? "text-white bg-white/10 shadow-[0_0_15px_rgba(0,140,255,0.3)] border border-[#0099FF]/40"
                      : "text-[#9E9EA8] hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  <Icon className="w-3 h-3 text-[#00A2FF] group-hover:text-[#66C2FF] transition-colors" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Order Now CTA & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/order" className="hidden sm:inline-block btn-interactive">
              <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-[10px] font-sans font-bold tracking-[0.22em] text-white uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,120,255,0.4)] hover:shadow-[0_0_30px_rgba(0,150,255,0.7)] flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3" />
                <span>ORDER NOW</span>
              </button>
            </Link>

            <Link href="/customize" className="hidden md:inline-block btn-interactive">
              <button className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/20 hover:border-white/60 text-[10px] font-sans font-medium tracking-[0.2em] text-white hover:bg-white/10 transition-all duration-300">
                ATELIER
              </button>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/[0.05] border border-white/10 hover:border-white/30 text-white lg:hidden transition-all duration-300 btn-interactive"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#00A2FF]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Glassmorphism Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#000000]/95 backdrop-blur-3xl lg:hidden flex flex-col justify-between p-6 sm:p-8 pt-24 animate-in fade-in duration-300 overflow-y-auto overflow-x-hidden max-w-full">
          {/* Ambient Electric Blue Glow */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#0066FF]/15 rounded-full blur-[140px] pointer-events-none overflow-hidden" />

          <div className="space-y-3 relative z-10">
            <span className="font-mono text-[10px] text-[#0099FF] uppercase tracking-[0.3em] font-semibold">
              NAVIGATION MATRIX
            </span>

            <div className="space-y-1.5 pt-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200",
                      isActive
                        ? "bg-[#003388]/30 border-[#0099FF]/50 text-white shadow-[0_0_20px_rgba(0,140,255,0.2)]"
                        : "bg-white/[0.03] border-white/[0.07] text-[#D0D0DC] hover:text-white hover:bg-white/[0.06]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#00A2FF]" />
                      <span className="font-cinzel text-sm font-medium tracking-[0.18em] uppercase">
                        {link.name}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#62626E]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom CTAs & Concierge */}
          <div className="space-y-3 pt-6 border-t border-white/10 relative z-10">
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white font-sans font-bold text-xs tracking-[0.22em] uppercase shadow-[0_0_25px_rgba(0,120,255,0.4)] flex items-center justify-center gap-2 btn-interactive">
                <ShoppingBag className="w-4 h-4" />
                <span>ACQUIRE CARD NOW</span>
              </button>
            </Link>

            <Link
              href="/customize"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <button className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/20 text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-all btn-interactive">
                OPEN ATELIER CONFIGURATOR
              </button>
            </Link>

            <a
              href="https://wa.me/919561248677?text=Hello%20NXC%20Verse%20Concierge,%20I%20would%20like%20to%20order%20a%20custom%20metal%20card."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-[#00A2FF] hover:text-[#80D0FF] tracking-wider btn-interactive"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              <span>WhatsApp VIP Concierge (+91 9561248677)</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
