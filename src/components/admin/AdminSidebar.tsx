"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Cpu,
  CreditCard,
  Users,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  pendingOrdersCount?: number;
  unassignedCardsCount?: number;
}

export function AdminSidebar({
  pendingOrdersCount = 2,
  unassignedCardsCount = 2,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    {
      name: "Executive Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Orders & Fulfillment",
      href: "/admin/orders",
      icon: Package,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    {
      name: "Laser & Workshop",
      href: "/admin/manufacturing",
      icon: Cpu,
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
    {
      name: "NFC Hardware Fleet",
      href: "/admin/cards",
      icon: CreditCard,
      badge: unassignedCardsCount > 0 ? `${unassignedCardsCount} unlinked` : null,
      badgeColor: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    },
    {
      name: "Customer Directory",
      href: "/admin/users",
      icon: Users,
      badge: null,
    },
    {
      name: "Hardware Inventory",
      href: "/admin/inventory",
      icon: Layers,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#08080C] border-r border-white/10 text-white select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-neutral-800 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:border-amber-400 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-base font-bold tracking-widest text-white">NXC CORE</span>
                <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  ATELIER
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 tracking-wider uppercase font-mono">Executive Command</p>
            </div>
          </Link>
          {/* Close for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-neutral-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Workshop Edge Status */}
        <div className="mt-4 p-2.5 rounded-xl bg-neutral-900/80 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-mono text-neutral-300">Laser Rig & Node</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            ONLINE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2 text-[10px] uppercase font-mono tracking-widest text-neutral-300 font-semibold">
          Workshop Operations
        </div>

        {navigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent text-white border-l-2 border-amber-400 font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-amber-400"
                      : "text-neutral-400 group-hover:text-amber-400/80"
                  }`}
                />
                <span className="tracking-wide text-xs">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    item.badgeColor || "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 mb-2 text-[10px] uppercase font-mono tracking-widest text-neutral-300 font-semibold">
          Public Client Portal
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all group"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
            <span>Storefront Front</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <Link
          href="/p/ritesh"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
            <span>Executive Demo Profile</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Admin Operator Profile Footer */}
      <div className="p-4 border-t border-white/10 bg-neutral-950/60">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-bold text-xs text-black font-cinzel ring-1 ring-amber-400/50">
              RM
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-white truncate">Ritesh Martawar</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </div>
              <p className="text-[10px] text-neutral-400 font-mono truncate">Founder & Chief Engraver</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Mobile Toggle Button (Floating) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
        aria-label="Toggle Command Menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
