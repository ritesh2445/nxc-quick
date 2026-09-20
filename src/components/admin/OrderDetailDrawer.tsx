"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Layers,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  MessageCircle,
} from "lucide-react";

interface OrderDetailDrawerProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (updatedOrder: any) => void;
  onOpenLaserSpec?: (order: any) => void;
  onOpenPrintDesign?: (order: any) => void;
}

export function OrderDetailDrawer({
  order,
  isOpen,
  onClose,
  onUpdateOrder,
  onOpenLaserSpec,
  onOpenPrintDesign,
}: OrderDetailDrawerProps) {
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [courierPartner, setCourierPartner] = useState<string>("Blue Dart Express");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus || "pending");
      setTrackingNumber(order.trackingNumber || "");
      setCourierPartner(order.courierPartner || "Blue Dart Express");
      setSaveSuccess(false);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  // Google Font URL injection for dynamic preview
  const laserFont = order.laserFont || "Cinzel";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    laserFont
  )}:wght@400;600;700;800&display=swap`;

  const getFinishStyles = (finish: string) => {
    switch (finish) {
      case "pitch_black":
        return "bg-gradient-to-tr from-neutral-950 via-[#111115] to-neutral-950 text-neutral-100 border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]";
      case "silver":
        return "bg-gradient-to-tr from-neutral-300 via-neutral-100 to-neutral-400 text-neutral-900 border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]";
      case "gold":
        return "bg-gradient-to-tr from-amber-600 via-amber-200 to-amber-700 text-neutral-950 border-amber-300 shadow-[0_10px_30px_rgba(245,158,11,0.2)]";
      case "royal_red":
        return "bg-gradient-to-tr from-rose-950 via-red-900 to-rose-950 text-rose-100 border-rose-800 shadow-[0_10px_30px_rgba(244,63,94,0.2)]";
      case "cobalt_blue":
        return "bg-gradient-to-tr from-blue-950 via-slate-900 to-sky-950 text-sky-100 border-sky-800 shadow-[0_10px_30px_rgba(14,165,233,0.2)]";
      default:
        return "bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 text-white border-neutral-800";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          orderStatus: currentStatus,
          trackingNumber: trackingNumber.trim() || null,
          courierPartner: courierPartner.trim() || null,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        const updated = {
          ...order,
          orderStatus: currentStatus,
          trackingNumber: trackingNumber.trim() || null,
          courierPartner: courierPartner.trim() || null,
        };
        onUpdateOrder(updated);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWhatsAppDispatch = () => {
    const rawPhone = order.customerPhone || "";
    const cleanPhone = rawPhone.replace(/[^\d+]/g, "");
    const msg = encodeURIComponent(
      `Greetings ${order.customerName || "Customer"}, your NXC Atelier custom metal card (Order #${order.orderNumber}) has been precision-engraved and prepared for dispatch via ${courierPartner}${trackingNumber ? ` (Tracking AWB: ${trackingNumber})` : ""}. Thank you for choosing NXCVERSE.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />

      <div className="fixed inset-0 z-50 overflow-hidden select-none">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-2xl bg-[#09090E] border-l border-white/10 text-white flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-950/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-lg font-bold text-white tracking-wide">
                    {order.orderNumber}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    {order.tier || "metal"}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {onOpenPrintDesign && (
                  <button
                    onClick={() => onOpenPrintDesign(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-400 hover:bg-amber-500/25 transition-all font-mono font-medium"
                    title="Print 1:1 Scale Card Design & Vector Mask"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print Card Design</span>
                  </button>
                )}
                {onOpenLaserSpec && (
                  <button
                    onClick={() => onOpenLaserSpec(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-neutral-300 hover:text-amber-400 hover:border-amber-400/40 transition-all font-mono"
                    title="Print Laser Spec Blueprint"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Laser Job Spec</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Card Physical Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Physical Engraving Preview
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-amber-400">
                      Font: {laserFont}
                    </span>
                    {onOpenPrintDesign && (
                      <button
                        onClick={() => onOpenPrintDesign(order)}
                        className="text-xs font-mono text-neutral-400 hover:text-amber-400 flex items-center gap-1 underline underline-offset-4"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print 1:1 Scale</span>
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={`w-full aspect-[1.586] rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${getFinishStyles(
                    order.finish
                  )}`}
                >
                  {/* Sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none opacity-40" />

                  {/* Card Top */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white/20 border border-white/30 flex items-center justify-center font-bold text-[10px]">
                        N
                      </div>
                      <span className="font-cinzel text-xs tracking-widest font-bold">NXC ATELIER</span>
                    </div>
                    <div className="text-[10px] font-mono tracking-widest uppercase opacity-70">
                      NTAG216 NFC
                    </div>
                  </div>

                  {/* Card Bottom: Engraved Customer Name and Title in Selected Google Font */}
                  <div className="z-10 mt-auto">
                    <div
                      className="text-lg sm:text-xl font-bold tracking-wider uppercase truncate drop-shadow-md"
                      style={{ fontFamily: `'${laserFont}', sans-serif` }}
                    >
                      {order.engravingName || "EXECUTIVE HOLDER"}
                    </div>
                    {order.engravingTitle && (
                      <div
                        className="text-xs tracking-widest uppercase opacity-85 mt-0.5 truncate"
                        style={{ fontFamily: `'${laserFont}', sans-serif` }}
                      >
                        {order.engravingTitle}
                      </div>
                    )}
                    {order.customEngraving && (
                      <div className="text-[9px] font-mono opacity-60 tracking-wider mt-2">
                        {order.customEngraving}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Pipeline Selection */}
              <div className="p-4 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                  Manufacturing & Fulfillment Pipeline
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: "pending", label: "Queued" },
                    { id: "engraving", label: "Laser Milling" },
                    { id: "shipped", label: "Dispatched" },
                    { id: "delivered", label: "Delivered" },
                    { id: "cancelled", label: "Cancelled" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentStatus(s.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all text-center ${
                        currentStatus === s.id
                          ? "bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20"
                          : "bg-neutral-900 text-neutral-300 hover:text-white border border-white/5 hover:border-white/20"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logistics & Tracking Controls */}
              <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    Logistics & Courier Assignment
                  </span>
                  {trackingNumber && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      AWB Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1.5">
                      Courier Carrier
                    </label>
                    <select
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:border-amber-400 outline-none"
                    >
                      <option value="Blue Dart Express">Blue Dart Express</option>
                      <option value="Delhivery Air">Delhivery Air</option>
                      <option value="DHL Express Global">DHL Express Global</option>
                      <option value="DTDC Premium">DTDC Premium</option>
                      <option value="FedEx Priority">FedEx Priority</option>
                      <option value="India Post Speed">India Post Speed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1.5">
                      Air Waybill (AWB) / Tracking No.
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BD9928172901"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* 1-Click WhatsApp Customer Dispatch Action */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleWhatsAppDispatch}
                    disabled={!order.customerPhone}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all text-xs font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Notify Customer via WhatsApp</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all text-xs active:scale-95 disabled:opacity-60 shadow-lg shadow-amber-500/15"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}</span>
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Dossier */}
              <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                  Customer & Delivery Dossier
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-neutral-400 font-mono text-[10px]">Customer Name</div>
                    <div className="text-white font-medium mt-0.5">{order.customerName || "N/A"}</div>
                  </div>

                  <div>
                    <div className="text-neutral-400 font-mono text-[10px]">Payment Summary</div>
                    <div className="text-emerald-400 font-mono font-semibold mt-0.5">
                      {order.currency === "USD" ? `$${order.amount}` : `₹${order.amount?.toLocaleString("en-IN")}`}
                      <span className="text-neutral-400 font-normal ml-1.5 uppercase font-mono text-[10px]">
                        ({order.paymentStatus || "PAID"} · {order.paymentGateway || "Razorpay"})
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-400 font-mono text-[10px]">Email Dispatch</div>
                    <div className="text-neutral-200 mt-0.5 truncate">{order.customerEmail || "N/A"}</div>
                  </div>

                  <div>
                    <div className="text-neutral-400 font-mono text-[10px]">Contact Channel</div>
                    <div className="text-neutral-200 mt-0.5">
                      {order.customerPhone ? "WhatsApp Verified" : "Direct Email"}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="text-neutral-400 font-mono text-[10px] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      Physical Destination Address
                    </div>
                    <div className="text-neutral-200 mt-1 leading-relaxed bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                      {order.shippingAddress || "Client delivery address registered on checkout"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
