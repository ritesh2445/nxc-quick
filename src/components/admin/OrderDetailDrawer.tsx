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
  Copy,
  Check,
  RotateCw,
  QrCode,
  Wifi,
} from "lucide-react";
import QRCode from "qrcode";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";

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
  const [previewFace, setPreviewFace] = useState<"front" | "back">("front");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus || "pending");
      setTrackingNumber(order.trackingNumber || "");
      setCourierPartner(order.courierPartner || "Blue Dart Express");
      setSaveSuccess(false);

      const qrSlug = order.qrSlug || order.username || "ritesh";
      const profileUrl = `https://nxcverse.in/@${qrSlug}`;
      QRCode.toDataURL(profileUrl, {
        width: 256,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((uri) => setQrDataUrl(uri))
        .catch((err) => console.error("Failed to generate QR in drawer:", err));
    }
  }, [order]);

  // Keyboard shortcut: Escape to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const rawFont = order.laserFont || "Cinzel";
  const laserFont = rawFont;
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    laserFont
  )}:wght@400;600;700;800&display=swap`;

  const rawFinish = (order.finish || "pitch_black").toLowerCase();
  const normalizedFinish: "silver" | "gold" | "royal_red" | "pitch_black" | "cobalt_blue" =
    rawFinish === "mirror" || rawFinish === "titanium" || rawFinish === "silver"
      ? "silver"
      : rawFinish === "champagne" || rawFinish === "gold"
      ? "gold"
      : rawFinish === "royal_red"
      ? "royal_red"
      : rawFinish === "midnight" || rawFinish === "carbon" || rawFinish === "matte_black" || rawFinish === "cobalt_blue"
      ? "cobalt_blue"
      : "pitch_black";

  // Real Authentic Finish Styles
  const finishStyles = {
    silver: {
      name: "Silver Chromium",
      bg: "bg-[#B8C2D1]",
      border: "border-[#7E8B9E]/70",
      textPrimary: "text-[#000000] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-semibold",
      textSecondary: "text-[#1A1E26] font-medium",
      gradient: "from-[#7E8899] via-[#E2E8F2] via-[#A2ADC0] via-[#FFFFFF] via-[#C8D1E0] to-[#8E98AA]",
      shimmer: "rgba(255, 255, 255, 0.75)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.5),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(0,0,0,0.3)]",
      glaze: "from-white/[0.5] via-transparent to-black/[0.15]",
      logoFilter: "brightness-0 opacity-100",
      logoBlend: "multiply" as const,
      qrBezel: "border-[#687588] bg-[#F2F5F9]",
      divider: "border-black/20",
    },
    gold: {
      name: "24K Champagne Gold",
      bg: "bg-[#181002]",
      border: "border-[#F5D061]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#ECC968] font-normal",
      gradient: "from-[#1C1202] via-[#483006] via-[#94721A] via-[#ECC968] via-[#5A3F0C] via-[#1A1002] to-[#382607]",
      shimmer: "rgba(245, 208, 97, 0.45)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,240,180,0.7),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-[#FFF2CC]/[0.35] via-transparent to-[#D8B466]/[0.2]",
      logoFilter: "sepia-[0.7] brightness-135 contrast-120 drop-shadow-[0_0_12px_rgba(245,208,97,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#ECC968] bg-[#FFFDF5]",
      divider: "border-[#ECC968]/30",
    },
    royal_red: {
      name: "Royal Red PVD",
      bg: "bg-[#180004]",
      border: "border-[#FF2A55]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#FF8099] font-normal",
      gradient: "from-[#1C0005] via-[#4E020E] via-[#9E1026] via-[#F0264B] via-[#580312] via-[#180004] to-[#35010A]",
      shimmer: "rgba(255, 42, 85, 0.45)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,180,195,0.7),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.3] via-transparent to-[#FF2A55]/[0.25]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_12px_rgba(255,100,130,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#FF2A55]/80 bg-[#FFFFFF]",
      divider: "border-[#FF2A55]/30",
    },
    pitch_black: {
      name: "Pitch Black PVD",
      bg: "bg-[#000000]",
      border: "border-white/25",
      textPrimary: "text-[#FFFFFF] drop-shadow-sm font-normal",
      textSecondary: "text-[#D0D0DC] font-normal",
      gradient: "from-[#000000] via-[#050508] to-[#000000]",
      shimmer: "rgba(255, 255, 255, 0.35)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.95),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.95)]",
      glaze: "from-white/[0.16] via-transparent to-white/[0.04]",
      logoFilter: "brightness-115 contrast-105 drop-shadow-[0_0_14px_rgba(255,255,255,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-white/30 bg-[#FFFFFF]",
      divider: "border-white/15",
    },
    cobalt_blue: {
      name: "Cobalt Blue PVD",
      bg: "bg-[#030B1C]",
      border: "border-[#0077EE]/80",
      textPrimary: "text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-normal",
      textSecondary: "text-[#7EB5F0] font-normal",
      gradient: "from-[#020A18] via-[#08224E] via-[#0C387C] via-[#1457B8] via-[#0A2656] via-[#020A18] to-[#051630]",
      shimmer: "rgba(0, 120, 240, 0.45)",
      glow: "shadow-[0_12px_36px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(100,180,255,0.6),inset_0_-2px_3px_rgba(0,0,0,0.9)]",
      glaze: "from-white/[0.28] via-transparent to-[#0088FF]/[0.22]",
      logoFilter: "brightness-120 contrast-110 drop-shadow-[0_0_12px_rgba(100,180,255,0.5)]",
      logoBlend: "screen" as const,
      qrBezel: "border-[#0088FF]/80 bg-[#FFFFFF]",
      divider: "border-[#0088FF]/30",
    },
  }[normalizedFinish];

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
      `Hello ${order.customerName || "Customer"}, your custom NXC Verse metal card (Order #${order.orderNumber}) has been precision-engraved on our fiber laser rig and prepared for dispatch via ${courierPartner}${trackingNumber ? ` (AWB Tracking: ${trackingNumber})` : ""}. Thank you for choosing NXC Verse!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  const holderName = (order.engravingName || order.customerName || "RITESH MARTAWAR").toUpperCase();
  const holderTitle = (order.engravingTitle || order.customerDesignation || "FOUNDER & CEO").toUpperCase();
  const companyName = (order.company || order.customerCompany || "NXC VERSE").toUpperCase();
  const serialText = (order.customEngraving || "EDITION NO. 001/100 · ATELIER BESPOKE").toUpperCase();
  const chipUid = order.nfcUid ? order.nfcUid.slice(0, 14) : "04:A2:8F:E1:99";

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
                  <button
                    onClick={() => handleCopy(order.orderNumber, "ordNo")}
                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Order Number"
                  >
                    {copiedKey === "ordNo" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-white border border-white/10 font-semibold">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-mono font-semibold text-xs shadow-sm"
                    title="Print 1:1 Scale Card Design & Vector Mask"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print 1:1 Card</span>
                  </button>
                )}
                {onOpenLaserSpec && (
                  <button
                    onClick={() => onOpenLaserSpec(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-neutral-300 hover:text-white hover:border-white/20 transition-all font-mono"
                    title="Print Laser Spec Blueprint"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Laser Job Spec</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white transition-all"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Card Physical Preview with Real Face Toggles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    Authentic NXC Metal Card Preview
                  </span>

                  {/* Front/Back Flip Toggle */}
                  <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setPreviewFace("front")}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        previewFace === "front"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Front (Phoenix Crest)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFace("back")}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        previewFace === "back"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Back (Engraving & QR)
                    </button>
                  </div>
                </div>

                {/* Real Physical Card Aspect Container */}
                <div className="flex justify-center p-4 rounded-2xl bg-[#060609] border border-white/5">
                  <div
                    className={`relative rounded-[16px] border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                      finishStyles.bg
                    } ${finishStyles.border} ${finishStyles.glow} bg-gradient-to-br ${
                      finishStyles.gradient
                    }`}
                    style={{
                      width: "230px",
                      height: "365px",
                      padding: "16px 14px",
                    }}
                  >
                    {/* Metallic Texture & Glaze */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-tr ${finishStyles.glaze} pointer-events-none rounded-[16px]`}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay rounded-[16px]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
                      }}
                    />

                    {previewFace === "front" ? (
                      /* FRONT FACE: NXC Phoenix Emblem */
                      <>
                        <div className="relative flex items-center justify-between z-10">
                          <span
                            className={`font-cinzel text-[10px] font-semibold tracking-[0.32em] uppercase ${finishStyles.textPrimary}`}
                          >
                            NXC VERSE
                          </span>
                          <div className={finishStyles.textSecondary}>
                            <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                              <path d="M12 4c4.418 0 8 3.582 8 8s-3.582 8-8 8" strokeWidth="2.2" strokeLinecap="round" />
                              <path d="M12 8c2.209 0 4 1.791 4 4s-1.791 4-4 4" strokeWidth="2.2" strokeLinecap="round" />
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                            </svg>
                          </div>
                        </div>

                        {/* Center: Official Winged Phoenix Logo */}
                        <div className="relative my-auto flex items-center justify-center z-10 w-full flex-1 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={NXC_LOGO_DATA_URI}
                            alt="NXC Verse Official Phoenix Crest"
                            style={{
                              mixBlendMode: finishStyles.logoBlend,
                              maxHeight: "180px",
                            }}
                            className={`max-w-full object-contain pointer-events-none select-none ${finishStyles.logoFilter}`}
                          />
                        </div>
                      </>
                    ) : (
                      /* BACK FACE: Real QR & Engraved Identity */
                      <>
                        {/* Top Bar: Company & Chip UID */}
                        <div
                          className={`relative flex items-center justify-between pb-2 border-b ${finishStyles.divider} z-10`}
                        >
                          <span
                            className={`text-[9px] font-medium tracking-[0.2em] uppercase truncate max-w-[120px] ${finishStyles.textPrimary}`}
                            style={{ fontFamily: `'${laserFont}', sans-serif` }}
                          >
                            {companyName}
                          </span>
                          <span
                            className={`font-mono text-[8px] font-medium tracking-widest shrink-0 ${finishStyles.textSecondary}`}
                          >
                            {chipUid}
                          </span>
                        </div>

                        {/* Center: Name, Title & Real Scannable QR */}
                        <div className="relative flex flex-col items-center text-center space-y-1.5 my-auto z-10 py-1">
                          <div className="space-y-0.5 max-w-[190px]">
                            <h3
                              style={{ fontFamily: `'${laserFont}', sans-serif` }}
                              className={`text-xs uppercase leading-snug tracking-[0.14em] font-bold ${finishStyles.textPrimary}`}
                            >
                              {holderName}
                            </h3>
                            <p
                              style={{ fontFamily: `'${laserFont}', sans-serif` }}
                              className={`text-[8px] uppercase tracking-[0.16em] ${finishStyles.textSecondary}`}
                            >
                              {holderTitle}
                            </p>
                          </div>

                          {/* Recessed CNC-Milled Bezel with REAL QR Code */}
                          <div className="relative flex flex-col items-center pt-1">
                            <div className={`p-1.5 rounded-[8px] border ${finishStyles.qrBezel} relative`}>
                              <div className="w-[84px] h-[84px] relative flex items-center justify-center">
                                {qrDataUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={qrDataUrl}
                                    alt="Live Scannable QR"
                                    className="w-full h-full object-contain rounded-[2px]"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-black/10 animate-pulse rounded" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Custom Serial Engraving */}
                        <div
                          className={`relative pt-1.5 border-t ${finishStyles.divider} flex items-center justify-center text-[7px] z-10`}
                        >
                          <span
                            style={{ fontFamily: `'${laserFont}', sans-serif` }}
                            className={`uppercase truncate tracking-[0.2em] ${finishStyles.textSecondary}`}
                          >
                            {serialText}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Live Public Profile Fast Link */}
                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Public NFC Link:</span>
                  <a
                    href={`/p/${order.qrSlug || order.username || "ritesh"}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white underline underline-offset-4"
                  >
                    <span>/p/{order.qrSlug || order.username || "ritesh"}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>
              </div>

              {/* Status Pipeline Selection */}
              <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] space-y-3">
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
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "bg-white/[0.03] text-neutral-400 hover:text-white border border-white/[0.05] hover:border-white/20"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logistics & Tracking Controls */}
              <div className="p-5 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-300" />
                    Logistics & Courier Assignment
                  </span>
                  {trackingNumber && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                        AWB: {trackingNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(trackingNumber, "awb")}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Copy AWB"
                      >
                        {copiedKey === "awb" ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:border-white/30 outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:border-white/30 outline-none"
                    />
                  </div>
                </div>

                {/* 1-Click WhatsApp Customer Dispatch Action */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleWhatsAppDispatch}
                    disabled={!order.customerPhone}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] text-neutral-300 border border-white/10 hover:bg-white/[0.08] hover:text-white transition-all text-xs font-medium disabled:opacity-40"
                    title={order.customerPhone ? `Send WhatsApp message to ${order.customerPhone}` : "No phone number registered"}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Notify Customer via WhatsApp</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-all text-xs active:scale-95 disabled:opacity-60 shadow-sm"
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
                    <div className="text-neutral-200 mt-0.5 truncate flex items-center gap-1.5">
                      <span>{order.customerEmail || "N/A"}</span>
                      {order.customerEmail && (
                        <button
                          onClick={() => handleCopy(order.customerEmail, "email")}
                          className="text-neutral-400 hover:text-white"
                          title="Copy Email"
                        >
                          {copiedKey === "email" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-400 font-mono text-[10px]">Contact Phone</div>
                    <div className="text-neutral-200 mt-0.5 flex items-center gap-1.5">
                      <span>{order.customerPhone || "Direct Email Only"}</span>
                      {order.customerPhone && (
                        <button
                          onClick={() => handleCopy(order.customerPhone, "phone")}
                          className="text-neutral-400 hover:text-white"
                          title="Copy Phone"
                        >
                          {copiedKey === "phone" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        Physical Destination Address
                      </span>
                      {order.shippingAddress && (
                        <button
                          onClick={() => handleCopy(order.shippingAddress, "addr")}
                          className="inline-flex items-center gap-1 text-neutral-400 hover:text-white"
                        >
                          {copiedKey === "addr" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Address</span>
                            </>
                          )}
                        </button>
                      )}
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
