"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Layers,
  Printer,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sliders,
  RefreshCw,
  Eye,
  Wrench,
  Flame,
  Activity,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LaserSpecModal } from "@/components/admin/LaserSpecModal";
import { OrderDetailDrawer } from "@/components/admin/OrderDetailDrawer";
import { PrintCardDesignModal } from "@/components/admin/PrintCardDesignModal";

export default function WorkshopManufacturingPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSpecOrder, setSelectedSpecOrder] = useState<any | null>(null);
  const [selectedDrawerOrder, setSelectedDrawerOrder] = useState<any | null>(null);
  const [selectedPrintDesignOrder, setSelectedPrintDesignOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load workshop pipeline:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const moveOrderStage = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, orderStatus: nextStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: nextStatus } : o))
        );
      }
    } catch (err) {
      console.error("Failed to transition pipeline stage:", err);
    }
  };

  // Workshop Kanban stages
  const columns = [
    {
      id: "pending",
      title: "1. Queue & Material Prep",
      badge: "INTAKE",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
      nextStage: "engraving",
      nextLabel: "Start Milling",
    },
    {
      id: "engraving",
      title: "2. CNC & Fiber Laser",
      badge: "ACTIVE RIG",
      color: "border-rose-500/30 text-rose-400 bg-rose-500/5",
      nextStage: "shipped",
      nextLabel: "Pass QC & Dispatch",
    },
    {
      id: "shipped",
      title: "3. Dispatched & In Transit",
      badge: "COURIER",
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
      nextStage: "delivered",
      nextLabel: "Confirm Delivered",
    },
    {
      id: "delivered",
      title: "4. Delivered & Active",
      badge: "COMPLETED",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
      nextStage: null,
      nextLabel: null,
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#060609]">
      <AdminHeader
        title="Laser & Workshop Manufacturing Pipeline"
        subtitle="MOPA 50W Fiber Laser engraving Kanban, CNC material milling & quality calibration"
        badge="PRECISION ATELIER"
        onRefresh={fetchOrders}
        isRefreshing={refreshing}
      />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Telemetry Hardware Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">MOPA Fiber Source</span>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">50W Calibrated</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">49.8W output · 35kHz Pulse</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Diamond CNC Mill Bit</span>
              <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">0.2mm Precision Tip</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">92% Wear Life Remaining</p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Active Workshop Queue</span>
              <div className="text-base font-bold font-cinzel text-white mt-0.5">
                {orders.filter((o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length} Active Jobs
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Real-time Stage Progression</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 4-Column Workshop Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {columns.map((col) => {
            const colOrders = orders.filter((o) => (o.orderStatus || "pending") === col.id);

            return (
              <div
                key={col.id}
                className="bg-[#0A0A10] border border-white/10 rounded-2xl p-4 flex flex-col min-h-[550px] shadow-lg"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-white tracking-wide">
                      {col.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 mt-0.5 block">
                      {colOrders.length} {colOrders.length === 1 ? "Job" : "Jobs"}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${col.color}`}>
                    {col.badge}
                  </span>
                </div>

                {/* Job Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                  {colOrders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-neutral-600 font-mono border border-dashed border-white/5 rounded-xl">
                      No jobs in this phase
                    </div>
                  ) : (
                    colOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl bg-[#0E0E16] border border-white/5 hover:border-white/20 transition-all space-y-3 group shadow-md"
                      >
                        {/* Order No & Tier */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                            {ord.tier || "metal"}
                          </span>
                        </div>

                        {/* Engraving Specs */}
                        <div>
                          <div className="text-xs font-bold text-white tracking-wider uppercase truncate">
                            {ord.engravingName || "N/A"}
                          </div>
                          {ord.engravingTitle && (
                            <div className="text-[10px] text-neutral-400 uppercase truncate">
                              {ord.engravingTitle}
                            </div>
                          )}
                        </div>

                        {/* Finish & Font Swatches */}
                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-white/5">
                          <span className="uppercase">{ord.finish?.replace(/_/g, " ")}</span>
                          <span className="text-amber-300">Font: {ord.laserFont || "Cinzel"}</span>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedPrintDesignOrder(ord)}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 border border-white/5"
                              title="Print 1:1 Scale Card Design & Vector Mask"
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setSelectedSpecOrder(ord)}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 border border-white/5"
                              title="Print Laser Spec Blueprint"
                            >
                              <Printer className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setSelectedDrawerOrder(ord)}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5"
                              title="Inspect Card Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>

                          {col.nextStage && (
                            <button
                              onClick={() => moveOrderStage(ord.id, col.nextStage)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-semibold transition-colors"
                            >
                              <span>{col.nextLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Laser Spec Blueprint Modal */}
      <LaserSpecModal
        order={selectedSpecOrder}
        isOpen={Boolean(selectedSpecOrder)}
        onClose={() => setSelectedSpecOrder(null)}
      />

      {/* Card Inspector Drawer */}
      <OrderDetailDrawer
        order={selectedDrawerOrder}
        isOpen={Boolean(selectedDrawerOrder)}
        onClose={() => setSelectedDrawerOrder(null)}
        onUpdateOrder={(updated) => {
          setSelectedDrawerOrder(updated);
          fetchOrders();
        }}
        onOpenLaserSpec={(ord) => setSelectedSpecOrder(ord)}
        onOpenPrintDesign={(ord) => setSelectedPrintDesignOrder(ord)}
      />

      {/* 1:1 Scale Printable Card Design Modal */}
      <PrintCardDesignModal
        cardOrOrder={selectedPrintDesignOrder}
        isOpen={Boolean(selectedPrintDesignOrder)}
        onClose={() => setSelectedPrintDesignOrder(null)}
      />
    </div>
  );
}
