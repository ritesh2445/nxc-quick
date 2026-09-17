"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  CreditCard,
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

  // Hide SiteNav on dashboard, admin, login, and public digital profiles (@username)
  const isLegalRoute =
    pathname.startsWith("/legal") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/refund") ||
    pathname.startsWith("/shipping");

  const isStandaloneRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/@") ||
    (!isLegalRoute && pathname !== "/" && pathname !== "/order" && !pathname.startsWith("/api"));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  // Return null on console and profile routes
  if (isStandaloneRoute) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-3 sm:py-3.5 transition-all duration-300",
          scrolled || mobileMenuOpen
            ? "bg-[#000000]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.85)]"
            : "bg-gradient-to-b from-[#000000]/80 to-transparent backdrop-blur-sm"
        )}
        style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <BrandLogo />

          {/* Desktop Center Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-full px-4 py-1.5 backdrop-blur-xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[10px] font-sans font-medium tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 btn-interactive",
                    isActive
                      ? "text-white bg-white/10 border border-white/20"
                      : "text-[#9E9EA8] hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <Icon className="w-3 h-3 text-[#A09E9A]" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1-Click View Demo Console */}
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-[10px] font-sans font-medium tracking-wider text-[#D0D0DC] hover:text-white transition-all btn-interactive"
            >
              <LayoutDashboard className="w-3 h-3 text-[#A09E9A]" />
              <span>VIEW DEMO</span>
            </Link>

            <Link href="/order" className="hidden sm:inline-block btn-interactive">
              <button className="min-h-[38px] px-5 py-2 rounded-full bg-white text-black font-sans font-semibold text-[10px] tracking-[0.18em] uppercase hover:bg-[#EAE8E4] transition-colors flex items-center gap-1.5 shadow-sm">
                <ShoppingBag className="w-3 h-3" />
                <span>ORDER CARD</span>
              </button>
            </Link>

            {/* Mobile Hamburger Button (min 44px touch area for iOS) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] p-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/30 text-white lg:hidden flex items-center justify-center transition-colors btn-interactive"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay — iOS & Android Touch Optimized */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#060608]/98 backdrop-blur-2xl flex flex-col px-5 overflow-y-auto overflow-x-hidden animate-in fade-in duration-200"
          style={{
            paddingTop: "calc(5.5rem + env(safe-area-inset-top, 0px))",
            paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="relative z-10 flex-1 space-y-2.5 py-2">
            <p className="font-mono text-[9px] text-[#70707C] uppercase tracking-[0.25em] font-semibold mb-3">
              NAVIGATION
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
                    "min-h-[52px] flex items-center justify-between p-3.5 rounded-xl border transition-all btn-interactive",
                    isActive
                      ? "bg-white/10 border-white/30 text-white"
                      : "bg-white/[0.02] border-white/[0.06] text-[#D0D0DC] hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#A09E9A]" />
                    <span className="font-cinzel text-sm font-medium tracking-[0.16em] uppercase">{link.name}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#62626E]" />
                </Link>
              );
            })}
          </div>

          {/* Bottom Actions for Mobile */}
          <div className="relative z-10 pt-4 border-t border-white/[0.08] space-y-2.5">
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[48px] flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase hover:bg-[#EAE8E4] transition-colors btn-interactive shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ORDER METAL CARD</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[46px] flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white font-sans font-medium text-xs tracking-wider hover:bg-white/[0.08] transition-colors btn-interactive"
            >
              <LayoutDashboard className="w-4 h-4 text-[#A09E9A]" />
              <span>VIEW CLIENT DEMO CONSOLE</span>
            </Link>

            <a
              href="https://wa.me/919561248677?text=Hello%20NXC%20Verse%20Concierge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-[#9E9EA8] hover:text-white tracking-wider transition-colors pt-1"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" color="#25D366" />
              <span>WhatsApp Contact: +91 9561248677</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
