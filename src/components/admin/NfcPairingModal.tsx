"use client";

import React, { useState, useEffect } from "react";
import { X, CreditCard, Cpu, Sparkles, CheckCircle2, Zap, AlertCircle } from "lucide-react";

interface NfcPairingModalProps {
  card: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCard: any) => void;
}

export function NfcPairingModal({ card, isOpen, onClose, onSuccess }: NfcPairingModalProps) {
  const [nfcUid, setNfcUid] = useState("");
  const [isActivated, setIsActivated] = useState(true);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (card) {
      setNfcUid(card.nfcUid || "");
      setIsActivated(card.isActivated === 1 || card.isActivated === true);
      setStatus(card.status || "active");
      setError(null);
    }
  }, [card]);

  if (!isOpen || !card) return null;

  // Emulate physical ACR122U NFC reader scan
  const handleEmulateScan = () => {
    // Generate valid 7-byte NTAG216 UID (starts with 04 for NXP Semiconductors)
    const hex = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();
    const simulatedUid = `04:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`;
    setNfcUid(simulatedUid);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUid = nfcUid.trim().toUpperCase();

    // Check 7-byte format e.g. 04:A2:8F:E1:99:3B:80 or 14 hex chars
    const isValidFormat = /^04(:?[0-9A-F]{2}){6}$/i.test(cleanUid) || cleanUid === "";

    if (cleanUid && !isValidFormat) {
      setError("Please enter a valid 7-byte NTAG216 UID (e.g. 04:A2:8F:E1:99:3B:80)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: card.id,
          nfcUid: cleanUid || null,
          status: cleanUid ? status : "unassigned",
          isActivated: cleanUid ? (isActivated ? 1 : 0) : 0,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess({
          ...card,
          nfcUid: cleanUid || null,
          status: cleanUid ? status : "unassigned",
          isActivated: cleanUid ? (isActivated ? 1 : 0) : 0,
        });
        onClose();
      } else {
        setError(data.error || "Failed to pair NFC hardware");
      }
    } catch (err) {
      setError("Network error while pairing NFC hardware");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg bg-[#0A0A10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/[0.06] text-white border border-white/10">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-white tracking-wide">
                Hardware Chip Provisioning
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Card Ref: {card.id} · {card.finish?.replace(/_/g, " ").toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* UID Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-neutral-300">
                Physical NTAG216 Chip UID (7-Byte Hex)
              </label>
              <button
                type="button"
                onClick={handleEmulateScan}
                className="text-[11px] font-mono text-neutral-300 hover:text-white flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-neutral-400" />
                <span>Emulate NFC Tap</span>
              </button>
            </div>
            <input
              type="text"
              value={nfcUid}
              onChange={(e) => setNfcUid(e.target.value)}
              placeholder="04:A2:8F:E1:99:3B:80"
              className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-white/10 text-white font-mono text-sm tracking-wider focus:border-white/40 outline-none uppercase"
            />
            <p className="text-[11px] text-neutral-300 font-mono mt-1.5">
              Hold the physical titanium card over your USB NFC reader or tap &apos;Emulate NFC Tap&apos;.
            </p>
          </div>

          {/* Activation & Status */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-mono text-neutral-300 block mb-1.5">
                Card Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:border-white/40 outline-none"
              >
                <option value="active">Active (Ready)</option>
                <option value="inactive">Inactive</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-300 block mb-1.5">
                Instant Cloud Sync
              </label>
              <div
                onClick={() => setIsActivated(!isActivated)}
                className="cursor-pointer px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between text-xs font-mono text-neutral-300 hover:border-white/20"
              >
                <span>{isActivated ? "Activated" : "Dormant"}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isActivated
                      ? "bg-white border-white text-black"
                      : "border-neutral-600 bg-neutral-800"
                  }`}
                >
                  {isActivated && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          </div>

          {/* Linked Target */}
          <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-white/5 text-xs font-mono">
            <span className="text-neutral-400 block text-[10px]">TAP REDIRECT TARGET</span>
            <span className="text-white mt-0.5 block truncate">
              https://nxcverse.in/p/{card.qrSlug || "unassigned"}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white text-xs font-medium border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {loading ? "Pairing..." : "Pair Hardware UID"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
