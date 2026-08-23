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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("ritesh");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile?.username) {
          setUsername(data.profile.username);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile Editor", href: "/dashboard/profile", icon: User },
    { label: "Contacts & Leads", href: "/dashboard/contacts", icon: Users },
    { label: "Card & NFC", href: "/dashboard/card", icon: CreditCard },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col md:flex-row pt-16 relative overflow-x-hidden">
      {/* Background Electric Blue Ambient Studio Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#0066FF]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#0044CC]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Sidebar Navigation (Glassmorphic & Electric Blue Accents) */}
      <aside className="w-full md:w-64 bg-[#050508]/80 border-r border-white/[0.08] backdrop-blur-2xl flex flex-col justify-between shrink-0 p-4 md:p-6 text-left relative z-10">
        <div className="space-y-6">
          {/* Dashboard Header */}
          <div className="space-y-1 pb-2 border-b border-white/[0.06]">
            <span className="font-mono text-[10px] text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#00A2FF]" /> CLIENT CONSOLE
            </span>
            <h2 className="font-cinzel font-medium text-lg text-white tracking-wide">
              Sovereign Identity
            </h2>
          </div>

          {/* Navigation Links with Rounded Pills & Glowing Active State */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-sans font-medium transition-all duration-200 btn-interactive",
                    isActive
                      ? "bg-gradient-to-r from-[#0055FF]/40 to-[#0088FF]/20 text-white border border-[#0099FF]/50 shadow-[0_0_15px_rgba(0,140,255,0.3)]"
                      : "text-[#9E9EA8] hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-[#00A2FF]" : "text-[#62626E]")} />
                  <span className="tracking-wider">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Links, Admin shortcut & Logout */}
        <div className="pt-6 border-t border-white/[0.08] space-y-2.5 mt-6">
          <Link
            href={`/@${username}`}
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-sans text-[#D0D0DC] hover:text-white hover:border-[#0099FF]/50 transition-all btn-interactive"
          >
            <span className="truncate font-medium">Live @{username}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00A2FF]" />
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono text-[#62626E] hover:text-[#80D0FF] transition-colors btn-interactive"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Terminal</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono text-[#70707C] hover:text-red-400 hover:bg-red-950/20 transition-colors btn-interactive"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto overflow-x-hidden max-w-6xl mx-auto w-full max-w-full relative z-10">
        {children}
      </main>
    </div>
  );
}
