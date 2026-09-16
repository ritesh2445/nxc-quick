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
  LogOut,
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
          "min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium transition-colors",
          isActive
            ? "bg-white/10 text-white border border-white/20 shadow-sm font-semibold"
            : "text-[#9E9EA8] hover:text-white hover:bg-white/[0.04]"
        )}
      >
        <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-[#70707C]")} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-white/20 selection:text-white">
      {/* ================================================================ */}
      {/* TOP BAR — Fixed, Full Width                                      */}
      {/* ================================================================ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[calc(3.5rem+env(safe-area-inset-top,0px))] flex items-center justify-between px-4 sm:px-6 bg-[#060608]/95 border-b border-white/[0.08] backdrop-blur-xl shadow-md"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Left: Logo + Console badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <BrandLogo size="sm" />
          <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[#C8C6C0] uppercase tracking-[0.2em] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/15">
            CONSOLE
          </span>
        </div>

        {/* Right: Live profile + Site link + Mobile menu toggle */}
        <div className="flex items-center gap-2">
          <Link
            href={`/@${username}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-[11px] font-mono text-[#D0D0DC] hover:text-white hover:border-white/30 transition-colors btn-interactive"
          >
            <ExternalLink className="w-3 h-3 text-[#A09E9A]" />
            <span>@{username}</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-[#9E9EA8] hover:text-white transition-colors btn-interactive"
          >
            <Home className="w-3 h-3" />
            <span>Site</span>
          </Link>

          {/* Mobile sidebar toggle (44px min touch target) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="min-w-[44px] min-h-[44px] p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white transition-colors md:hidden flex items-center justify-center btn-interactive"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </header>

      {/* ================================================================ */}
      {/* MAIN BODY: Sidebar + Content                                      */}
      {/* ================================================================ */}
      <div className="flex flex-1 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] min-h-screen">

        {/* MOBILE SIDEBAR OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/75 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={cn(
            "fixed top-[calc(3.5rem+env(safe-area-inset-top,0px))] bottom-0 left-0 z-40 w-64 bg-[#08080A]/98 border-r border-white/[0.08] backdrop-blur-2xl flex flex-col transition-transform duration-200 ease-out",
            "md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex-1 overflow-y-auto p-3.5 space-y-1 relative z-10">
            {/* Console header */}
            <div className="px-3 py-2.5 mb-2 border-b border-white/[0.06]">
              <p className="font-mono text-[9px] text-[#70707C] uppercase tracking-[0.24em] font-semibold">
                CLIENT CONSOLE
              </p>
              <p className="font-cinzel text-xs text-white mt-0.5 tracking-wider">Sovereign Identity</p>
            </div>

            {/* Nav Items */}
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Bottom Section */}
          <div className="p-3.5 border-t border-white/[0.07] space-y-1.5 relative z-10">
            <Link
              href={`/@${username}`}
              target="_blank"
              className="min-h-[40px] flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-sans text-[#D0D0DC] hover:text-white transition-colors btn-interactive"
            >
              <span className="font-medium truncate">Live @{username}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#A09E9A] shrink-0 ml-1" />
            </Link>

            <Link
              href="/admin"
              className="min-h-[38px] flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-mono text-[#70707C] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Terminal</span>
            </Link>

            <button
              onClick={handleLogout}
              className="min-h-[38px] w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-mono text-[#70707C] hover:text-red-400 hover:bg-red-950/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* MOBILE BOTTOM TAB BAR (iOS / Android Native Navigation)        */}
        {/* ============================================================== */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#08080A]/95 border-t border-white/[0.08] backdrop-blur-2xl px-2 py-1.5 flex items-center justify-around"
          style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))" }}
        >
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "min-h-[46px] min-w-[50px] flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-colors",
                  isActive ? "text-white" : "text-[#70707C] hover:text-[#A0A0AA]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#70707C]")} />
                <span className="text-[9px] font-sans font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="min-h-[46px] min-w-[50px] flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[#70707C] hover:text-[#A0A0AA] transition-colors"
          >
            <Menu className="w-4 h-4 text-[#70707C]" />
            <span className="text-[9px] font-sans font-medium">More</span>
          </button>
        </nav>

        {/* ============================================================== */}
        {/* MAIN CONTENT AREA                                               */}
        {/* ============================================================== */}
        <main className="flex-1 md:ml-64 min-h-full overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 pb-28 md:pb-12 max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
