"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Users,
  CreditCard,
  ShoppingBag,
  Palette,
  ArrowLeft,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Executive Overview", href: "/admin", icon: Activity },
    { label: "Hardware & NFC UIDs", href: "/admin/cards", icon: CreditCard },
    { label: "User Profiles", href: "/admin/users", icon: Users },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-text-primary flex flex-col md:flex-row pt-16 overflow-x-hidden max-w-full">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0E0E11] border-r border-[#2A2A32] flex flex-col justify-between shrink-0 p-4 md:p-6 text-left">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#2A1C1C] border border-[#4A2828] text-xs font-mono text-status-error uppercase tracking-wider">
              <Shield className="w-3 h-3" /> ROOT ADMIN
            </div>
            <h2 className="font-sans font-semibold text-lg text-[#F2F0EC]">
              NXC Terminal
            </h2>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-xs font-sans font-medium transition-colors",
                    isActive
                      ? "bg-[#18181C] text-[#F2F0EC] border border-[#3A3A45]"
                      : "text-text-secondary hover:text-text-primary hover:bg-[#18181C]/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-accent-silver" : "text-text-tertiary")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#2A2A32] space-y-2 mt-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-[2px] text-xs font-sans text-text-secondary hover:text-text-primary hover:bg-[#18181C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Client Suite</span>
          </Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto overflow-x-hidden max-w-6xl mx-auto w-full max-w-full">
        {children}
      </main>
    </div>
  );
}
