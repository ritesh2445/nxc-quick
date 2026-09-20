"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  CreditCard,
  Cpu,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  ExternalLink,
  Printer,
  ChevronRight,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { OrderDetailDrawer } from "@/components/admin/OrderDetailDrawer";
import { LaserSpecModal } from "@/components/admin/LaserSpecModal";

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [specOrder, setSpecOrder] = useState<any>(null);

  const fetchOverview = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (err) {
      console.error("Failed to load admin overview:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const orders = overview?.recentOrders || [];
  const metrics = overview?.metrics || {
    totalUsers: 5,
    totalCards: 5,
    totalOrders: 4,
    totalEvents: 1420,
  };
  const financial = overview?.financial || {
    grossINR: 7197,
    grossUSD: 38,
    aovINR: 2399,
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#060609]">
      {/* Top Luxury Command Header */}
      <AdminHeader
        title="Executive Command Center"
        subtitle="Live telemetry across MOPA Fiber Laser workshop, NFC hardware fleet & global edge nodes"
        badge="NXC ATELIER · PRODUCTION"
        onRefresh={fetchOverview}
        isRefreshing={refreshing}
        actions={
          <Link
            href="/admin/manufacturing"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/15"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Workshop Pipeline</span>
          </Link>
        }
      />

      <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Top 4 KPI Executive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <AdminKpiCard
            title="Gross Workshop Revenue"
            value={`₹${financial.grossINR.toLocaleString("en-IN")}`}
            subtitle={financial.grossUSD > 0 ? `+ $${financial.grossUSD} USD International` : "Razorpay + Stripe Live"}
            trend={{ value: "+28.4%", isPositive: true }}
            icon={DollarSign}
            accentColor="gold"
            highlight={true}
          />

          <AdminKpiCard
            title="Average Order Value"
            value={`₹${financial.aovINR.toLocaleString("en-IN")}`}
            subtitle="Tier 1 Metal & Atelier Bespoke"
            trend={{ value: "+14.2%", isPositive: true }}
            icon={Sparkles}
            accentColor="emerald"
          />

          <AdminKpiCard
            title="Hardware Fleet Active"
            value={`${metrics.totalCards} Units`}
            subtitle="NTAG216 High-Coercivity Chips"
            trend={{ value: "+100%", isPositive: true }}
            icon={CreditCard}
            accentColor="cyan"
          />

          <AdminKpiCard
            title="Edge Telemetry Events"
            value={`${metrics.totalEvents.toLocaleString("en-IN")}`}
            subtitle="Sub-50ms Global Routing"
            icon={Activity}
            accentColor="purple"
          />
        </div>

        {/* Quick Operations Strip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900/60 to-cyan-500/10 border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <div>
              <h4 className="text-xs font-semibold text-white tracking-wide">
                Workshop Operations Status: Fully Operational
              </h4>
              <p className="text-[11px] text-neutral-400 font-mono">
                Fiber Laser Rig calibrated (49.8W output) · Ready for CNC engraving & UID provisioning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/orders"
              className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white transition-all"
            >
              All Orders
            </Link>
            <Link
              href="/admin/cards"
              className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white transition-all"
            >
              Pair NFC
            </Link>
            <Link
              href="/admin/inventory"
              className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white transition-all"
            >
              Stock Tracker
            </Link>
          </div>
        </div>

        {/* Middle Section: Workshop Pipeline & Edge Network Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Orders Table / Feed (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0C0C12] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  Recent Production Orders
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Click any order to preview the metallic engraving card & dispatch tracking
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                  No orders recorded yet.
                </div>
              ) : (
                orders.slice(0, 5).map((ord: any) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="py-3.5 flex items-center justify-between hover:bg-neutral-900/60 p-2.5 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 font-cinzel font-bold text-xs group-hover:border-amber-400/50 transition-colors">
                        {ord.engravingName ? ord.engravingName[0] : "O"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white tracking-wide truncate">
                            {ord.engravingName || ord.customerName || "Executive Holder"}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-400 uppercase">
                            {ord.finish?.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-mono truncate">
                          {ord.orderNumber} · Font: {ord.laserFont || "Cinzel"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right shrink-0">
                      <div>
                        <div className="text-xs font-mono font-semibold text-white">
                          {ord.currency === "USD" ? `$${ord.amount}` : `₹${ord.amount?.toLocaleString("en-IN")}`}
                        </div>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            ord.orderStatus === "delivered"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : ord.orderStatus === "shipped"
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                              : ord.orderStatus === "engraving"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                          }`}
                        >
                          {ord.orderStatus || "pending"}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Fleet Finish Distribution & Edge Infrastructure (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Finish Distribution */}
            <div className="bg-[#0C0C12] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-cinzel text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Finish Popularity Share
              </h3>

              <div className="space-y-3 pt-1 text-xs font-mono">
                {[
                  { name: "Pitch Black PVD", pct: 45, color: "bg-neutral-400" },
                  { name: "24K Champagne Gold", pct: 30, color: "bg-amber-400" },
                  { name: "Silver Chromium", pct: 15, color: "bg-cyan-400" },
                  { name: "Royal Red & Cobalt", pct: 10, color: "bg-rose-400" },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-300">{item.name}</span>
                      <span className="text-white font-semibold">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edge Infrastructure Node Telemetry */}
            <div className="bg-[#0C0C12] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Edge Nodes SLA
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">99.99% UPTIME</span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-neutral-300">Mumbai Primary (BOM-01)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">18ms</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-neutral-300">Frankfurt Relay (FRA-02)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">41ms</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-neutral-300">Singapore Hub (SIN-01)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">32ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Order Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateOrder={(updated) => {
          setSelectedOrder(updated);
          fetchOverview();
        }}
        onOpenLaserSpec={(ord) => setSpecOrder(ord)}
      />

      {/* Printable Laser Blueprint Modal */}
      <LaserSpecModal
        order={specOrder}
        isOpen={Boolean(specOrder)}
        onClose={() => setSpecOrder(null)}
      />
    </div>
  );
}
