"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  CreditCard,
  Mail,
  Building,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
} from "lucide-react";

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

  useEffect(() => {
    if (user) {
      setIsVerified(Boolean(user.isVerified));
      setStatus(user.status || "active");
      setRole(user.role || "customer");
      setSaveSuccess(false);
    }
  }, [user]);

  if (!isOpen || !user) return null;

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center font-bold text-base text-amber-400 font-cinzel">
                {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : "US"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                    {user.fullName}
                  </h3>
                  {isVerified && (
                    <ShieldCheck className="w-4 h-4 text-amber-400" title="Verified Sovereign Profile" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  @{user.username} · ID: {user.id}
                </p>
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
                <span className="text-base font-bold font-cinzel text-amber-400 mt-1 block">
                  ₹{user.totalSpent?.toLocaleString("en-IN") || 0}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Hardware Cards</span>
                <span className="text-base font-bold font-cinzel text-cyan-400 mt-1 block">
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

            {/* Profile Verification Sovereign Toggle */}
            <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Sovereign Verification Checkmark
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Enables the official gold Atelier verification badge on their public digital card.
                  </p>
                </div>
                <button
                  onClick={() => setIsVerified(!isVerified)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                    isVerified
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}</span>
                </button>
              </div>
            </div>

            {/* Profile Dossier Information */}
            <div className="p-5 rounded-2xl bg-[#0E0E16] border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                Identity Profile Info
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </span>
                  <span className="text-white font-mono">{user.email}</span>
                </div>
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

              <div className="pt-2">
                <a
                  href={`/p/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-400/40 text-neutral-300 hover:text-white transition-all text-xs font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Launch Live Public Card (/p/{user.username})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
