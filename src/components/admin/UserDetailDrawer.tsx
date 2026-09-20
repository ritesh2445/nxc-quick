"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  ExternalLink,
  CreditCard,
  Mail,
  Building,
  Briefcase,
  CheckCircle2,
  Save,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  Phone,
  Radio,
  QrCode,
  Layers,
} from "lucide-react";
import QRCode from "qrcode";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";

interface UserDetailDrawerProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: any) => void;
}

export function UserDetailDrawer({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}: UserDetailDrawerProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [status, setStatus] = useState("active");
  const [role, setRole] = useState("customer");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (user) {
      setIsVerified(Boolean(user.isVerified));
      setStatus(user.status || "active");
      setRole(user.role || "customer");
      setSaveSuccess(false);

      const targetUrl = `https://nxcverse.in/@${user.username || "ritesh"}`;
      QRCode.toDataURL(targetUrl, {
        width: 260,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Error generating user QR:", err));
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          isVerified,
          status,
          role,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        const updated = {
          ...user,
          isVerified,
          status,
          role,
        };
        onUpdateUser(updated);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const cleanPhone = user.phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hello ${user.fullName || "Valued Member"},\n\nThis is NXC Verse Atelier Concierge regarding your account (@${user.username}). How may we assist you today?`
      )}`
    : `https://wa.me/?text=${encodeURIComponent(
        `Hello ${user.fullName || "Valued Member"}, this is NXC Verse Atelier Concierge regarding your account (@${user.username}).`
      )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#09090E] border-l border-white/10 text-white flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-950/70">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-bold text-base text-white font-cinzel">
                {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : "US"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                    {user.fullName}
                  </h3>
                  {isVerified && (
                    <ShieldCheck className="w-4 h-4 text-[#E4C8A6]" title="Verified Sovereign Profile" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mt-0.5">
                  <span>@{user.username}</span>
                  <span>·</span>
                  <button
                    onClick={() => handleCopy(user.id, "id")}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                    title="Click to copy ID"
                  >
                    <span>ID: {user.id.slice(0, 10)}...</span>
                    {copiedKey === "id" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Spend</span>
                <span className="text-base font-bold font-cinzel text-white mt-1 block">
                  ₹{user.totalSpent?.toLocaleString("en-IN") || 0}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Hardware Cards</span>
                <span className="text-base font-bold font-cinzel text-neutral-300 mt-1 block">
                  {user.cardsCount || 0} Linked
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Orders Count</span>
                <span className="text-base font-bold font-cinzel text-white mt-1 block">
                  {user.ordersCount || 0}
                </span>
              </div>
            </div>

            {/* Authentic Sovereign NXC Card Preview */}
            <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                    Authentic NXC Metal Card
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setCardSide("front")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                      cardSide === "front"
                        ? "bg-white text-black font-semibold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Front Face
                  </button>
                  <button
                    onClick={() => setCardSide("back")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                      cardSide === "back"
                        ? "bg-white text-black font-semibold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Back Face (QR)
                  </button>
                </div>
              </div>

              {/* Realistic Luxury Metal Card Renderer */}
              <div className="relative w-full max-w-[340px] mx-auto aspect-[1.586] rounded-2xl p-5 overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-[#1c1d22] via-[#0d0e12] to-[#050508] flex flex-col justify-between select-none">
                {/* Brushed metallic reflection sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none" />

                {cardSide === "front" ? (
                  <>
                    <div className="flex items-start justify-between z-10">
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-neutral-300" />
                        <span className="text-[9px] font-mono uppercase text-neutral-300 tracking-wider">
                          NTAG216 NFC
                        </span>
                      </div>
                      <span className="font-cinzel text-[10px] font-bold tracking-widest text-white/90">
                        NXC VERSE
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center my-auto z-10">
                      <div className="w-14 h-14 relative flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={NXC_LOGO_DATA_URI}
                          alt="NXC Phoenix Crest"
                          className="max-w-full max-h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                        />
                      </div>
                      <span className="font-cinzel text-[11px] font-bold tracking-[0.25em] text-white mt-1.5">
                        NXC VERSE
                      </span>
                      <span className="text-[7.5px] font-mono tracking-widest text-neutral-400 uppercase mt-0.5">
                        Sovereign Atelier
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[8px] font-mono text-neutral-400 z-10 pt-1 border-t border-white/10">
                      <span>TITANIUM PVD</span>
                      <span>EDITION NO. 001/100</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between z-10">
                      <div>
                        <span className="font-cinzel text-[10px] font-bold text-white tracking-widest block">
                          {user.company || "NXC VERSE"}
                        </span>
                        <span className="text-[7.5px] font-mono text-neutral-400 tracking-wider">
                          ATELIER BESPOKE NFC
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-neutral-400">
                        NTAG216 CHIP
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 my-auto z-10">
                      <div className="min-w-0 flex-1">
                        <div className="font-cinzel text-sm font-bold text-white tracking-wider truncate uppercase">
                          {user.fullName || "RITESH MARTAWAR"}
                        </div>
                        <div className="text-[9px] font-mono text-neutral-400 truncate uppercase mt-0.5">
                          {user.designation || "FOUNDER & CEO"}
                        </div>
                        <div className="text-[8px] font-mono text-neutral-500 mt-2">
                          /p/{user.username || "ritesh"}
                        </div>
                      </div>

                      {qrDataUrl && (
                        <div className="w-16 h-16 p-1 bg-white rounded-lg border border-white/20 shadow-md shrink-0 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={qrDataUrl}
                            alt="Scannable QR Code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[7.5px] font-mono text-neutral-400 z-10 pt-1 border-t border-white/10">
                      <span>SECURE CONTACTLESS</span>
                      <span>TAP OR SCAN</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile Verification Sovereign Toggle */}
            <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    Sovereign Verification Checkmark
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Enables the official luxury Atelier verification badge on their public digital card.
                  </p>
                </div>
                <button
                  onClick={() => setIsVerified(!isVerified)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                    isVerified
                      ? "bg-white text-black border-white shadow-sm"
                      : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
                  }`}
                >
                  {isVerified ? "VERIFIED" : "UNVERIFIED"}
                </button>
              </div>
            </div>

            {/* Role & Account Access */}
            <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                Account Authority & Security
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1.5">
                    Access Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono outline-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}</span>
                </button>
              </div>
            </div>

            {/* Profile Dossier Information & Smart Actions */}
            <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                Identity Profile Info
              </span>

              <div className="space-y-2.5 text-xs font-mono">
                {/* Email with copy */}
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{user.email}</span>
                    <button
                      onClick={() => handleCopy(user.email, "email")}
                      className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      title="Copy email"
                    >
                      {copiedKey === "email" ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phone if available */}
                {user.phone && (
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{user.phone}</span>
                      <button
                        onClick={() => handleCopy(user.phone, "phone")}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Copy phone"
                      >
                        {copiedKey === "phone" ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Title
                  </span>
                  <span className="text-white">{user.designation || "Not Set"}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> Organization
                  </span>
                  <span className="text-white">{user.company || "Not Set"}</span>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={`/p/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all text-xs font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Public Card (/p/{user.username})</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 transition-all text-xs font-mono"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

