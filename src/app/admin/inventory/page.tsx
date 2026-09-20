"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Cpu,
  Package,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Flame,
  Wrench,
  Boxes,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/inventory");
      if (res.ok) {
        const data = await res.json();
        setInventory(data.data);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockDelta = async (category: string, id: string, delta: number) => {
    setAdjustingId(id);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, id, delta }),
      });
      if (res.ok) {
        // Optimistically update
        setInventory((prev: any) => {
          if (!prev) return prev;
          const updatedCategory = prev[category]?.map((item: any) =>
            item.id === id ? { ...item, inStock: Math.max(0, item.inStock + delta) } : item
          );
          return { ...prev, [category]: updatedCategory };
        });
      }
    } catch (err) {
      console.error("Failed to adjust stock:", err);
    } finally {
      setAdjustingId(null);
    }
  };

  const metalBlanks = inventory?.metalBlanks || [];
  const nfcComponents = inventory?.nfcComponents || [];
  const packaging = inventory?.packaging || [];
  const workshopHardware = inventory?.workshopHardware || {};

  const totalBlanks = metalBlanks.reduce((sum: number, b: any) => sum + (b.inStock || 0), 0);
  const reservedBlanks = metalBlanks.reduce((sum: number, b: any) => sum + (b.reserved || 0), 0);
  const lowStockBlanks = metalBlanks.filter((b: any) => b.inStock <= b.threshold);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#060609]">
      <AdminHeader
        title="Hardware Inventory & Stock Levels"
        subtitle="Raw surgical stainless steel blanks, NTAG216 chip reels & luxury packaging"
        badge="HARDWARE LOGISTICS"
        onRefresh={fetchInventory}
        isRefreshing={refreshing}
      />

      <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Available Metal Blanks</span>
              <div className="text-2xl font-bold font-cinzel text-white mt-0.5">{totalBlanks} Units</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Across 5 PVD Finishes</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-200 border border-white/10">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Reserved in Production</span>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">{reservedBlanks} Units</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Allocated to Active Orders</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-200 border border-white/10">
              <Boxes className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Re-Order Alerts</span>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                {lowStockBlanks.length === 0 ? "Optimal Stock" : `${lowStockBlanks.length} Low Finishes`}
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Threshold Automated Watch</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-200 border border-white/10">
              {lowStockBlanks.length > 0 ? (
                <AlertTriangle className="w-5 h-5 text-neutral-300" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>
          </div>
        </div>

        {/* Metal Blanks Inventory Matrix */}
        <div className="bg-[#0B0B0F] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-200" />
                Surgical Steel & Alloy Metal Blanks
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Precision CNC blank stock with 0.80mm ISO standard thickness and PVD finish
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              {metalBlanks.length} Standard Finishes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metalBlanks.map((item: any) => {
              const isLow = item.inStock <= item.threshold;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-[#111116] border border-white/[0.06] hover:border-white/20 transition-all space-y-4 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">
                        {item.label}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{item.grade}</p>
                    </div>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                        isLow
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-white/[0.06] text-neutral-300 border border-white/10"
                      }`}
                    >
                      {isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <div className="text-2xl font-bold font-mono text-white tracking-tight">
                        {item.inStock}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {item.reserved} Reserved in queue
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => handleStockDelta("metalBlanks", item.id, -5)}
                        disabled={adjustingId === item.id || item.inStock <= 0}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-30"
                        title="Reduce 5 units"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStockDelta("metalBlanks", item.id, 10)}
                        disabled={adjustingId === item.id}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Add 10 units"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>Batch: {item.supplierBatch}</span>
                    <span>Reorder Min: {item.threshold}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NFC Components & Packaging Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NFC Hardware Reels */}
          <div className="bg-[#0B0B0F] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-neutral-200" />
                  NFC Chips & Ferrite Shields
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  13.56MHz NTAG216 ICs & Anti-Metal RF Insulation
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {nfcComponents.map((c: any) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#111116] border border-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-white">{c.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{c.spec}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-white">
                        {c.inStock} {c.unit}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {c.reserved} reserved
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-neutral-900 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => handleStockDelta("nfcComponents", c.id, -20)}
                        className="p-1 rounded text-neutral-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleStockDelta("nfcComponents", c.id, 50)}
                        className="p-1 rounded text-neutral-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Atelier Packaging */}
          <div className="bg-[#0B0B0F] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <Package className="w-4 h-4 text-neutral-200" />
                  Luxury Packaging & Sleeves
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Magnetic gift boxes with gold foil & velvet pouches
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {packaging.map((p: any) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#111116] border border-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-white">{p.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{p.spec}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-white">
                        {p.inStock} {p.unit}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Min {p.threshold}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-neutral-900 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => handleStockDelta("packaging", p.id, -10)}
                        className="p-1 rounded text-neutral-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleStockDelta("packaging", p.id, 25)}
                        className="p-1 rounded text-neutral-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
