"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  CreditCard,
  BarChart3,
  ShoppingBag,
  Settings,
  ExternalLink,
  Shield,
  Sparkles,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Home,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("ritesh");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile?.username) setUsername(data.profile.username);
      })
      .catch(() => {});
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {}
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Contacts", href: "/dashboard/contacts", icon: Users },
    { label: "Card & NFC", href: "/dashboard/card", icon: CreditCard },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const NavLink = ({ item }: { item: typeof navItems[number] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200",
          isActive
            ? "bg-[#0055FF]/20 text-white border border-[#0099FF]/40 shadow-[0_0_12px_rgba(0,140,255,0.2)]"
            : "text-[#9E9EA8] hover:text-white hover:bg-white/[0.06]"
        )}
      >
        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#00A2FF]" : "text-[#62626E]")} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col">
      {/* ================================================================ */}
      {/* TOP BAR — Fixed, Full Width, Always Visible                       */}
      {/* ================================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 bg-[#060608]/95 border-b border-white/[0.08] backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
        {/* Left: Logo + Console badge */}
        <div className="flex items-center gap-3">
          <BrandLogo />
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] text-[#00A2FF] uppercase tracking-[0.22em] font-semibold px-2.5 py-1 rounded-full bg-[#0044FF]/15 border border-[#0066FF]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A2FF] animate-pulse" />
            CONSOLE
          </span>
        </div>

        {/* Right: Live profile + Home + Menu toggle */}
        <div className="flex items-center gap-2">
          <Link
            href={`/@${username}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-[11px] font-mono text-[#D0D0DC] hover:text-white hover:border-[#0099FF]/50 transition-all btn-interactive"
          >
            <ExternalLink className="w-3 h-3 text-[#00A2FF]" />
            <span>@{username}</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-[#9E9EA8] hover:text-white transition-all btn-interactive"
          >
            <Home className="w-3 h-3" />
            <span>Site</span>
          </Link>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#0099FF]/50 text-white transition-all md:hidden btn-interactive"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-[#00A2FF]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ================================================================ */}
      {/* MAIN BODY: Sidebar + Content                                      */}
      {/* ================================================================ */}
      <div className="flex flex-1 pt-14 min-h-screen">

        {/* ============================================================== */}
        {/* MOBILE SIDEBAR OVERLAY                                          */}
        {/* ============================================================== */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ============================================================== */}
        {/* SIDEBAR — Mobile: slide-in overlay | Desktop: fixed column      */}
        {/* ============================================================== */}
        <aside
          className={cn(
            "fixed top-14 bottom-0 left-0 z-40 w-64 bg-[#060608]/98 border-r border-white/[0.07] backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-out",
            "md:translate-x-0", // always visible on desktop
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/4 right-0 w-48 h-48 bg-[#0066FF]/8 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10">
            {/* Console header */}
            <div className="px-3 py-3 mb-2 border-b border-white/[0.06]">
              <p className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> CLIENT CONSOLE
              </p>
              <p className="font-cinzel text-sm text-white mt-0.5 tracking-wide">Sovereign Identity</p>
            </div>

            {/* Nav Items */}
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/[0.07] space-y-1.5 relative z-10">
            <Link
              href={`/@${username}`}
              target="_blank"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-sans text-[#D0D0DC] hover:text-white hover:border-[#0099FF]/50 transition-all btn-interactive"
            >
              <span className="font-medium truncate">Live @{username}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00A2FF] shrink-0 ml-1" />
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-mono text-[#62626E] hover:text-[#80D0FF] hover:bg-white/[0.04] transition-all btn-interactive"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Terminal</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-mono text-[#70707C] hover:text-red-400 hover:bg-red-950/20 transition-all btn-interactive"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* MOBILE BOTTOM TAB BAR (alternative quick nav for mobile)       */}
        {/* ============================================================== */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#060608]/98 border-t border-white/[0.08] backdrop-blur-2xl px-1 py-1.5 flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
                  isActive ? "text-[#00A2FF]" : "text-[#62626E] hover:text-[#9E9EA8]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-sans font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[#62626E] hover:text-[#9E9EA8] transition-all"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[9px] font-sans font-medium">More</span>
          </button>
        </nav>

        {/* ============================================================== */}
        {/* MAIN CONTENT AREA                                               */}
        {/* ============================================================== */}
        <main className="flex-1 md:ml-64 min-h-full overflow-x-hidden">
          {/* Inner scroll container with bottom padding for mobile tab bar */}
          <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
