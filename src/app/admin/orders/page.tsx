"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Download,
  Filter,
  Truck,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Printer,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderDetailDrawer } from "@/components/admin/OrderDetailDrawer";
import { LaserSpecModal } from "@/components/admin/LaserSpecModal";
import { PrintCardDesignModal } from "@/components/admin/PrintCardDesignModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");

  const [activeDrawerOrder, setActiveDrawerOrder] = useState<any | null>(null);
  const [activeSpecOrder, setActiveSpecOrder] = useState<any | null>(null);
  const [activePrintDesignOrder, setActivePrintDesignOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedTier !== "all") params.set("tier", selectedTier);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, selectedTier]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const exportCSV = () => {
    if (!orders || orders.length === 0) return;

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Engraving Name",
      "Engraving Title",
      "Laser Font",
      "Finish",
      "Tier",
      "Amount",
      "Currency",
      "Payment Status",
      "Order Status",
      "Courier Partner",
      "Tracking Number",
      "Shipping Address",
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber || ""}"`,
      `"${new Date(o.createdAt).toISOString()}"`,
      `"${o.customerName || ""}"`,
      `"${o.customerEmail || ""}"`,
      `"${o.customerPhone || ""}"`,
      `"${o.engravingName || ""}"`,
      `"${o.engravingTitle || ""}"`,
      `"${o.laserFont || "Cinzel"}"`,
      `"${o.finish || ""}"`,
      `"${o.tier || ""}"`,
      `"${o.amount || 0}"`,
      `"${o.currency || "INR"}"`,
      `"${o.paymentStatus || "paid"}"`,
      `"${o.orderStatus || "pending"}"`,
      `"${o.courierPartner || ""}"`,
      `"${o.trackingNumber || ""}"`,
      `"${(o.shippingAddress || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nxc_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickStatus = async (orderId: string, nextStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
      console.error("Failed to quick update status:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#060609]">
      <AdminHeader
        title="Orders & Fulfillment Hub"
        subtitle="Live production queue, laser engraving job cards, and global courier dispatch"
        badge="PRODUCTION HUB"
        onRefresh={fetchOrders}
        isRefreshing={refreshing}
        actions={
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs font-mono"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        }
      />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filters & Search Control Bar */}
        <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order #, Holder Name, Email, or AWB..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:border-white/30 outline-none placeholder:text-neutral-500"
              />
            </form>

            {/* Tier Filter Pills */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-[11px] font-mono text-neutral-400 shrink-0">Tier:</span>
              {[
                { id: "all", label: "All Editions" },
                { id: "metal", label: "Verse Metal" },
                { id: "atelier", label: "Atelier Bespoke" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                    selectedTier === t.id
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-white/[0.03] text-neutral-400 border border-white/[0.05] hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter Pipeline Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/[0.05] pb-1">
            <span className="text-[11px] font-mono text-neutral-400 shrink-0">Status:</span>
            {[
              { id: "all", label: "All Statuses" },
              { id: "pending", label: "Queued" },
              { id: "engraving", label: "Laser Milling" },
              { id: "shipped", label: "Dispatched" },
              { id: "delivered", label: "Delivered" },
              { id: "cancelled", label: "Cancelled" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                  selectedStatus === s.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "bg-white/[0.03] text-neutral-400 border border-white/[0.05] hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table View */}
        <div className="bg-[#0B0B0F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Order Number</th>
                  <th className="py-3.5 px-4 font-medium">Engraved Holder</th>
                  <th className="py-3.5 px-4 font-medium">Selected Finish</th>
                  <th className="py-3.5 px-4 font-medium">Typography</th>
                  <th className="py-3.5 px-4 font-medium">Amount</th>
                  <th className="py-3.5 px-4 font-medium">Status & Stage</th>
                  <th className="py-3.5 px-4 font-medium">Logistics & AWB</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04] font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500 text-xs">
                      Loading workshop production orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500 text-xs">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => setActiveDrawerOrder(ord)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* Order Number */}
                      <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-100 group-hover:underline">
                            {ord.orderNumber}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 block font-normal">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </td>

                      {/* Engraved Holder */}
                      <td className="py-4 px-4">
                        <div className="text-white font-medium font-sans truncate max-w-[160px]">
                          {ord.engravingName || "N/A"}
                        </div>
                        {ord.engravingTitle && (
                          <div className="text-[10px] text-neutral-400 truncate max-w-[160px]">
                            {ord.engravingTitle}
                          </div>
                        )}
                      </td>

                      {/* Finish */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 text-[11px] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                          {ord.finish?.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Google Font */}
                      <td className="py-4 px-4 text-neutral-300 text-xs font-sans">
                        <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.08] font-mono text-[10px] text-neutral-300">
                          {ord.laserFont || "Cinzel"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-semibold text-white">
                          {ord.currency === "USD" ? `$${ord.amount}` : `₹${ord.amount?.toLocaleString("en-IN")}`}
                        </span>
                        <span className="text-[10px] text-emerald-400 block uppercase">
                          {ord.paymentStatus || "paid"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-medium ${
                            ord.orderStatus === "delivered"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : ord.orderStatus === "shipped"
                              ? "bg-white/10 text-white border border-white/20"
                              : ord.orderStatus === "engraving"
                              ? "bg-white/[0.06] text-neutral-300 border border-white/15"
                              : ord.orderStatus === "cancelled"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-white/[0.02] text-neutral-400 border border-white/[0.06]"
                          }`}
                        >
                          {ord.orderStatus || "pending"}
                        </span>
                      </td>

                      {/* Logistics */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {ord.trackingNumber ? (
                          <div>
                            <span className="text-neutral-200 text-[11px] font-mono">
                              {ord.trackingNumber}
                            </span>
                            <span className="text-[10px] text-neutral-500 block">
                              {ord.courierPartner || "Courier"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-500 text-[11px] italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActivePrintDesignOrder(ord)}
                            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.06] transition-colors"
                            title="Print 1:1 Scale Card Design (Front/Back/Vector Mask)"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setActiveSpecOrder(ord)}
                            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.06] transition-colors"
                            title="Print Laser Spec Blueprint"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setActiveDrawerOrder(ord)}
                            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.06] transition-colors"
                            title="Inspect Metallic Card"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <OrderDetailDrawer
        order={activeDrawerOrder}
        isOpen={Boolean(activeDrawerOrder)}
        onClose={() => setActiveDrawerOrder(null)}
        onUpdateOrder={(updated) => {
          setActiveDrawerOrder(updated);
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        }}
        onOpenLaserSpec={(ord) => setActiveSpecOrder(ord)}
        onOpenPrintDesign={(ord) => setActivePrintDesignOrder(ord)}
      />

      {/* Laser Spec Modal */}
      <LaserSpecModal
        order={activeSpecOrder}
        isOpen={Boolean(activeSpecOrder)}
        onClose={() => setActiveSpecOrder(null)}
      />

      {/* 1:1 Scale Printable Card Design Modal */}
      <PrintCardDesignModal
        cardOrOrder={activePrintDesignOrder}
        isOpen={Boolean(activePrintDesignOrder)}
        onClose={() => setActivePrintDesignOrder(null)}
      />
    </div>
  );
}
