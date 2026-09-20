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
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { NfcPairingModal } from "@/components/admin/NfcPairingModal";

export default function AdminCardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pairingCard, setPairingCard] = useState<any | null>(null);

  const fetchCards = async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
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
          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Total Commissioned</span>
              <div className="text-xl font-bold font-cinzel text-white mt-0.5">{cards.length} Cards</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Sovereign Metal Fleet</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Active Encrypted NFC</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{activeCount} Online</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">NTAG216 High-Coercivity</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Unassigned Blanks</span>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{unassignedCount} Units</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Ready for Chip Pairing</p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="p-4 rounded-2xl bg-[#0B0B10] border border-white/10 flex flex-col md:flex-row items-center gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Card ID, NFC UID, or Slug..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:border-amber-400 outline-none"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-[11px] font-mono text-neutral-400 shrink-0">Filter:</span>
            {[
              { id: "all", label: "All Fleet" },
              { id: "active", label: "Active NFC" },
              { id: "unassigned", label: "Unassigned Blanks" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                  statusFilter === f.id
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold"
                    : "bg-neutral-900 text-neutral-400 border border-white/5 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-[#0A0A10] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
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
                        <span className="text-amber-400">{card.id}</span>
                        <span className="text-[10px] text-neutral-500 block uppercase">
                          {card.variant || "metal"} Edition
                        </span>
                      </td>

                      {/* Finish & Material */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-neutral-300 text-[11px] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {card.finish?.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-neutral-500 block uppercase mt-0.5">
                          {card.material} finish
                        </span>
                      </td>

                      {/* NFC UID */}
                      <td className="py-4 px-4">
                        {card.nfcUid ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                            <span className="text-emerald-400 font-semibold tracking-wider">
                              {card.nfcUid}
                            </span>
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
                          className="inline-flex items-center gap-1 text-neutral-300 hover:text-amber-400 text-xs font-sans group"
                        >
                          <span>/p/{card.qrSlug || "unassigned"}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-amber-400" />
                        </a>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(card.id, card.status)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold transition-all ${
                            card.status === "active"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
                          }`}
                        >
                          {card.status || "unassigned"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setPairingCard(card)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-cyan-400/40 text-cyan-400 hover:text-white text-xs transition-all font-mono"
                        >
                          {card.nfcUid ? "Re-Flash UID" : "Pair Hardware"}
                        </button>
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
    </div>
  );
}
