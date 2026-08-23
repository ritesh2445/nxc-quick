"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  CreditCard,
  Sparkles,
  Zap,
  ShieldCheck,
  ShoppingBag,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide SiteNav entirely on dashboard / admin / login — those are fully standalone pages
  const isConsoleRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "PRODUCT", href: "/#products", icon: CreditCard },
    { name: "ORDER", href: "/order", icon: ShoppingBag },
    { name: "HOW IT WORKS", href: "/#how-it-works", icon: Zap },
    { name: "PRICING", href: "/#pricing", icon: ShieldCheck },
  ];

  // Return null on console routes — dashboard layout takes full control
  if (isConsoleRoute) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-3.5 transition-all duration-500",
          scrolled || mobileMenuOpen
            ? "bg-[#000000]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
            : "bg-gradient-to-b from-[#000000]/80 via-[#000000]/40 to-transparent backdrop-blur-md"
        )}
      >
        {/* Electric Blue Hairline Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0088FF]/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <BrandLogo />

          {/* Desktop Center Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[10px] font-sans font-medium tracking-[0.2em] uppercase px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 btn-interactive",
                    isActive
                      ? "text-white bg-white/10 border border-[#0099FF]/40"
                      : "text-[#9E9EA8] hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  <Icon className="w-3 h-3 text-[#00A2FF]" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Sign In to Console — visible on desktop */}
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-[10px] font-sans font-medium tracking-wider text-[#D0D0DC] hover:text-white transition-all btn-interactive"
            >
              <LayoutDashboard className="w-3 h-3 text-[#00A2FF]" />
              <span>CLIENT CONSOLE</span>
            </Link>

            <Link href="/order" className="hidden sm:inline-block btn-interactive">
              <button className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-[10px] font-sans font-bold tracking-[0.22em] text-white uppercase transition-all shadow-[0_0_20px_rgba(0,120,255,0.4)] hover:shadow-[0_0_30px_rgba(0,150,255,0.7)] flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3" />
                <span>ORDER NOW</span>
              </button>
            </Link>

            {/* Mobile Hamburger — only on non-dashboard public pages */}
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

      {/* Mobile Menu Overlay — Marketing Only */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050508]/98 backdrop-blur-3xl flex flex-col px-5 pt-20 pb-8 overflow-y-auto overflow-x-hidden animate-in fade-in duration-300">
          {/* Ambient Glow */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#0066FF]/12 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#0033AA]/8 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 flex-1 space-y-2 py-4">
            <p className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-[0.28em] font-semibold mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> NAVIGATION
            </p>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all btn-interactive",
                    isActive
                      ? "bg-[#0055FF]/25 border-[#0099FF]/50 text-white"
                      : "bg-white/[0.03] border-white/[0.07] text-[#D0D0DC] hover:text-white hover:bg-white/[0.06] hover:border-white/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#00A2FF]" />
                    <span className="font-cinzel text-sm font-medium tracking-[0.18em] uppercase">{link.name}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#62626E]" />
                </Link>
              );
            })}
          </div>

          {/* Bottom: Sign In to Console + WhatsApp */}
          <div className="relative z-10 pt-5 border-t border-white/[0.08] space-y-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0044DD] via-[#0066FF] to-[#0099FF] text-white font-sans font-bold text-sm tracking-wider shadow-[0_0_24px_rgba(0,100,255,0.45)] btn-interactive"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>SIGN IN TO CLIENT CONSOLE</span>
            </Link>

            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/[0.05] border border-white/20 text-white font-sans font-semibold text-sm tracking-wider hover:bg-white/10 transition-all btn-interactive"
            >
              <ShoppingBag className="w-4 h-4 text-[#00A2FF]" />
              <span>ORDER METAL CARD</span>
            </Link>

            <a
              href="https://wa.me/919561248677?text=Hello%20NXC%20Verse%20Concierge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-[#9E9EA8] hover:text-white tracking-wider btn-interactive transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              <span>VIP Concierge: +91 9561248677</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
