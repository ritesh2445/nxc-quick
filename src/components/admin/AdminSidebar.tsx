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
      badgeColor: "bg-white/10 text-white border border-white/15",
    },
    {
      name: "Laser & Workshop",
      href: "/admin/manufacturing",
      icon: Cpu,
      badge: "LIVE",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    },
    {
      name: "NFC Hardware Fleet",
      href: "/admin/cards",
      icon: CreditCard,
      badge: unassignedCardsCount > 0 ? `${unassignedCardsCount} unlinked` : null,
      badgeColor: "bg-white/10 text-neutral-300 border border-white/15",
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
    <div className="flex flex-col h-full bg-[#08080B] border-r border-white/[0.08] text-white select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-center text-white shadow-sm group-hover:border-white/30 transition-all">
              <Sparkles className="w-4 h-4 text-neutral-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-base font-bold tracking-widest text-white">NXC CORE</span>
                <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-300 border border-white/10 font-medium">
                  ATELIER
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-mono">Executive Command</p>
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
        <div className="mt-4 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="text-[11px] font-mono text-neutral-400">Laser Rig & Node</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            ONLINE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
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
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? "bg-white/[0.08] text-white border-l-2 border-white font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
                  }`}
                />
                <span className="tracking-wide text-xs">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                    item.badgeColor || "bg-white/10 text-neutral-300"
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
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all group"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-white" />
            <span>Storefront Front</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <Link
          href="/p/ritesh"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all group"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-neutral-300 group-hover:text-white" />
            <span>Executive Demo Profile</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Admin Operator Profile Footer */}
      <div className="p-4 border-t border-white/[0.08] bg-black/40">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white font-cinzel">
              RM
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-white truncate">Ritesh Martawar</span>
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
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
        className="md:hidden fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-white text-black border border-white/20 shadow-2xl hover:bg-neutral-200 active:scale-95 transition-all"
        aria-label="Toggle Command Menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
