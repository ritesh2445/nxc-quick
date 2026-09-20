"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Radio,
  Search,
  Sparkles,
  Zap,
  ExternalLink,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  Layers,
  Printer,
  Copy,
  Check,
  X,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { NfcPairingModal } from "@/components/admin/NfcPairingModal";
import { PrintCardDesignModal } from "@/components/admin/PrintCardDesignModal";

export default function AdminCardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pairingCard, setPairingCard] = useState<any | null>(null);
  const [printingCard, setPrintingCard] = useState<any | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const fetchCards = async (customSearch?: string) => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      const s = typeof customSearch === "string" ? customSearch : search;
      if (s) params.set("search", s);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/cards?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
      }
    } catch (err) {
      console.error("Failed to load cards:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCards();
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchCards("");
  };

  const handleToggleStatus = async (cardId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cardId, status: nextStatus }),
      });
      if (res.ok) {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, status: nextStatus } : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const activeCount = cards.filter((c) => c.status === "active").length;
  const unassignedCount = cards.filter((c) => !c.nfcUid || c.status === "unassigned").length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#060609]">
      <AdminHeader
        title="NFC Hardware Fleet & UID Manager"
        subtitle="Physical NTAG216 chip provisioning, high-coercivity encryption & URL routing"
        badge="NFC HARDWARE"
        onRefresh={fetchCards}
        isRefreshing={refreshing}
      />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Fleet KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Total Commissioned</span>
              <div className="text-xl font-bold font-cinzel text-white mt-0.5">{cards.length} Cards</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Sovereign Metal Fleet</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-200 border border-white/10">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Active Encrypted NFC</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{activeCount} Online</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">NTAG216 High-Coercivity</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-200 border border-white/10">
              <Radio className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Unassigned Blanks</span>
              <div className="text-xl font-bold font-mono text-neutral-300 mt-0.5">{unassignedCount} Units</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Ready for Chip Pairing</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] text-neutral-200 border border-white/10">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/[0.08] flex flex-col md:flex-row items-center gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Card ID, NFC UID, or Slug..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:border-white/40 outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-[11px] font-mono text-neutral-400 shrink-0">Filter:</span>
            {[
              { id: "all", label: "All Fleet", count: cards.length },
              { id: "active", label: "Active NFC", count: activeCount },
              { id: "unassigned", label: "Unassigned Blanks", count: unassignedCount },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                  statusFilter === f.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "bg-white/[0.04] text-neutral-400 border border-white/5 hover:text-white"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === f.id ? "bg-black/15 text-black font-bold" : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-[#0B0B0F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-neutral-950/80 text-neutral-400 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Card Identifier</th>
                  <th className="py-3.5 px-4 font-medium">Finish & Material</th>
                  <th className="py-3.5 px-4 font-medium">Physical NFC UID</th>
                  <th className="py-3.5 px-4 font-medium">Digital Profile Target</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 text-xs">
                      Loading hardware cards...
                    </td>
                  </tr>
                ) : cards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 text-xs">
                      No matching hardware cards found.
                    </td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id} className="hover:bg-neutral-900/60 transition-colors">
                      {/* Card ID */}
                      <td className="py-4 px-4 font-semibold text-white">
                        <span className="text-white font-mono">{card.id}</span>
                        <span className="text-[10px] text-neutral-500 block uppercase">
                          {card.variant || "metal"} Edition
                        </span>
                      </td>

                      {/* Finish & Material */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-neutral-300 text-[11px] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                          {card.finish?.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-neutral-500 block uppercase mt-0.5">
                          {card.material} finish
                        </span>
                      </td>

                      {/* NFC UID with 1-click copy */}
                      <td className="py-4 px-4">
                        {card.nfcUid ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                            <span className="text-neutral-200 font-semibold tracking-wider">
                              {card.nfcUid}
                            </span>
                            <button
                              onClick={() => handleCopyUid(card.nfcUid)}
                              className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors ml-1"
                              title="Copy NFC UID"
                            >
                              {copiedUid === card.nfcUid ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-neutral-500" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neutral-600" />
                            <span className="text-neutral-500 italic">Unassigned Chip</span>
                          </div>
                        )}
                      </td>

                      {/* Tap Target */}
                      <td className="py-4 px-4">
                        <a
                          href={`/p/${card.qrSlug || "ritesh"}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-300 hover:text-white text-xs font-sans group"
                        >
                          <span>/p/{card.qrSlug || "unassigned"}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white" />
                        </a>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(card.id, card.status)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold transition-all ${
                            card.status === "active"
                              ? "bg-white/[0.08] text-white border border-white/20 hover:bg-white/[0.14]"
                              : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
                          }`}
                        >
                          {card.status || "unassigned"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPrintingCard(card)}
                            className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white text-xs transition-all"
                            title="Print 1:1 Scale Card Design & Vector Mask"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setPairingCard(card)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/30 text-neutral-200 hover:text-white text-xs transition-all font-mono"
                          >
                            {card.nfcUid ? "Re-Flash UID" : "Pair Hardware"}
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

      {/* Pairing Modal */}
      <NfcPairingModal
        card={pairingCard}
        isOpen={Boolean(pairingCard)}
        onClose={() => setPairingCard(null)}
        onSuccess={(updated) => {
          setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }}
      />

      {/* 1:1 Scale Printable Card Design Modal */}
      <PrintCardDesignModal
        cardOrOrder={printingCard}
        isOpen={Boolean(printingCard)}
        onClose={() => setPrintingCard(null)}
      />
    </div>
  );
}
