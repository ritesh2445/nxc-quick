"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("ritesh");
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch username for live link if in dashboard
  useEffect(() => {
    if (isDashboard) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.profile?.username) {
            setUsername(data.profile.username);
          }
        })
        .catch(() => {});
    }
  }, [isDashboard]);

  // Prevent background scroll when mobile/full menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setMobileMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch {}
  };

  const navLinks = [
    { name: "PRODUCT", href: "/#products", icon: CreditCard },
    { name: "DESIGNS", href: "/designs", icon: Layers },
    { name: "ATELIER", href: "/customize", icon: Sparkles },
    { name: "ORDER", href: "/order", icon: ShoppingBag },
    { name: "HOW IT WORKS", href: "/#how-it-works", icon: Zap },
    { name: "PRICING", href: "/#pricing", icon: ShieldCheck },
  ];

  const dashboardNavLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Contacts & Leads", href: "/dashboard/contacts", icon: User },
    { label: "Card & NFC", href: "/dashboard/card", icon: CreditCard },
    { label: "Analytics", href: "/dashboard/analytics", icon: Sparkles },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Settings", href: "/dashboard/settings", icon: ShieldCheck },
  ];

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
        {/* Subtle Electric Blue Hairline Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0088FF]/30 to-transparent opacity-80 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Strictly Single Brand Wordmark with Transparent NXC Logo */}
          <BrandLogo />

          {/* Center: Main Navigation Links on public marketing pages ONLY */}
          {!isDashboard ? (
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
          ) : (
            /* Center Badge on Client Dashboard / Portal */
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-[#00A2FF] shadow-[0_0_8px_#00A2FF] animate-pulse" />
              <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-[0.25em] font-semibold">
                CLIENT CONSOLE · SOVEREIGN IDENTITY
              </span>
            </div>
          )}

          {/* Right: Actions & Hamburger Menu Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isDashboard ? (
              <>
                <Link
                  href={`/@${username}`}
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-[10px] font-mono text-[#D0D0DC] hover:text-white transition-all btn-interactive"
                >
                  <span>Live @{username}</span>
                  <ExternalLink className="w-3 h-3 text-[#00A2FF]" />
                </Link>

                <Link href="/order" className="hidden md:inline-block btn-interactive">
                  <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-[10px] font-sans font-bold tracking-[0.2em] text-white uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,120,255,0.35)] flex items-center gap-1.5">
                    <ShoppingBag className="w-3 h-3" />
                    <span>ORDER CARD</span>
                  </button>
                </Link>

                {/* Hamburger Toggle - Always visible on Client Dashboard (both Desktop & Mobile) */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl bg-white/[0.05] border border-white/15 hover:border-[#0099FF]/50 text-white transition-all duration-300 btn-interactive flex items-center gap-2"
                  aria-label="Toggle Navigation Menu"
                >
                  <span className="hidden sm:inline font-mono text-[10px] text-[#9E9EA8] tracking-widest uppercase pl-1">
                    {mobileMenuOpen ? "CLOSE" : "MENU"}
                  </span>
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4 text-[#00A2FF]" />
                  ) : (
                    <Menu className="w-4 h-4 text-white" />
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-[10px] font-sans font-medium tracking-wider text-[#D0D0DC] hover:text-white transition-all btn-interactive"
                >
                  <User className="w-3 h-3 text-[#00A2FF]" />
                  <span>SIGN IN</span>
                </Link>

                <Link href="/order" className="hidden sm:inline-block btn-interactive">
                  <button className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-[10px] font-sans font-bold tracking-[0.22em] text-white uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,120,255,0.4)] hover:shadow-[0_0_30px_rgba(0,150,255,0.7)] flex items-center gap-1.5">
                    <ShoppingBag className="w-3 h-3" />
                    <span>ORDER NOW</span>
                  </button>
                </Link>

                {/* Mobile Hamburger Button for non-dashboard pages */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-white/[0.05] border border-white/10 hover:border-white/30 text-white lg:hidden transition-all duration-300 btn-interactive"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 text-[#00A2FF]" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Unified Luxury Menu Drawer Overlay (Fixed beneath Header, ZERO Duplicate Logos) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050508]/98 backdrop-blur-3xl flex flex-col justify-between px-4 sm:px-8 pt-20 pb-8 animate-in fade-in duration-300 overflow-y-auto overflow-x-hidden max-w-full">
          {/* Ambient Electric Blue Glow */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#0066FF]/15 rounded-full blur-[140px] pointer-events-none overflow-hidden" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#0033AA]/10 rounded-full blur-[140px] pointer-events-none overflow-hidden" />

          {/* Main Menu Content Matrix */}
          <div className="max-w-5xl mx-auto w-full py-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
            {/* Column 1: Main Website Matrix */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#00A2FF]" /> MAIN MATRIX NAVIGATION
              </span>

              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 btn-interactive",
                        isActive
                          ? "bg-gradient-to-r from-[#0055FF]/40 to-[#0088FF]/20 border-[#0099FF]/60 text-white shadow-[0_0_20px_rgba(0,140,255,0.25)]"
                          : "bg-white/[0.03] border-white/[0.07] text-[#D0D0DC] hover:text-white hover:bg-white/[0.06] hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[#00A2FF]" />
                        <span className="font-cinzel text-xs sm:text-sm font-medium tracking-[0.18em] uppercase">
                          {link.name}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#62626E]" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Client Console Shortcuts & Account Controls */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                <LayoutDashboard className="w-3 h-3 text-[#00A2FF]" /> SOVEREIGN CLIENT CONSOLE
              </span>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dashboardNavLinks.slice(0, 4).map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-sans transition-all",
                          isActive
                            ? "bg-[#0055FF]/20 border-[#0099FF]/40 text-white"
                            : "bg-white/[0.02] border-white/[0.05] text-[#9E9EA8] hover:text-white hover:bg-white/[0.06]"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5 text-[#00A2FF]" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <Link
                    href={`/@${username}`}
                    target="_blank"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-[#D0D0DC] hover:text-white hover:border-[#0099FF]/40 transition-all"
                  >
                    <span className="truncate">Live Sovereign Profile: @{username}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#00A2FF]" />
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-[#A0D0FF] hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#00A2FF]" />
                      <span>Admin Terminal</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#62626E]" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-red-950/20 border border-red-900/30 text-xs font-mono text-red-400 hover:bg-red-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out of Console</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-red-500/50" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTAs & VIP Concierge */}
          <div className="max-w-5xl mx-auto w-full pt-4 border-t border-white/[0.08] relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 sm:flex-initial"
              >
                <button className="w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0055FF] via-[#0088FF] to-[#00A2FF] text-white font-sans font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(0,120,255,0.4)] flex items-center justify-center gap-1.5 btn-interactive">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ACQUIRE CARD</span>
                </button>
              </Link>

              <Link
                href="/customize"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 sm:flex-initial"
              >
                <button className="w-full px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/20 text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-all btn-interactive">
                  ATELIER
                </button>
              </Link>
            </div>

            <a
              href="https://wa.me/919561248677?text=Hello%20NXC%20Verse%20Concierge,%20I%20would%20like%20to%20order%20a%20custom%20metal%20card."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-1.5 text-xs font-mono text-[#00A2FF] hover:text-[#80D0FF] tracking-wider btn-interactive"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              <span>VIP Concierge (+91 9561248677)</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}

