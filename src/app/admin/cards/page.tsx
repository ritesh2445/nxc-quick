"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CreditCard, Radio, Check, Search, ShieldCheck } from "lucide-react";

interface CardRow {
  id: string;
  qrSlug: string;
  variant: string;
  finish: string;
  material: string;
  nfcUid: string | null;
  status: string;
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardRow[]>([
    {
      id: "crd_ritesh",
      qrSlug: "ritesh",
      variant: "atelier",
      finish: "obsidian",
      material: "premium_metal",
      nfcUid: "04:A2:8F:E1:99:3B:80",
      status: "active",
    },
    {
      id: "crd_aarav",
      qrSlug: "aarav",
      variant: "metal",
      finish: "obsidian",
      material: "matte",
      nfcUid: "04:C5:12:44:0B:77:81",
      status: "active",
    },
    {
      id: "crd_demo",
      qrSlug: "demo",
      variant: "metal",
      finish: "titanium",
      material: "brushed",
      nfcUid: "04:77:E9:1A:4C:90:82",
      status: "active",
    },
    {
      id: "crd_new_4",
      qrSlug: "vance",
      variant: "atelier",
      finish: "carbon",
      material: "premium_metal",
      nfcUid: null,
      status: "unassigned",
    },
  ]);

  const [search, setSearch] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [inputUid, setInputUid] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePair = async (cardId: string) => {
    if (!inputUid.trim()) return;

    try {
      const res = await fetch("/api/admin/cards/assign-nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, nfcUid: inputUid }),
      });

      if (res.ok) {
        setCards(
          cards.map((c) =>
            c.id === cardId ? { ...c, nfcUid: inputUid.toUpperCase(), status: "active" } : c
          )
        );
        setEditingCardId(null);
        setInputUid("");
        setSuccessMsg(`NFC UID paired to card ${cardId}`);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      // Error handling
    }
  };

  const filteredCards = cards.filter(
    (c) =>
      c.qrSlug.toLowerCase().includes(search.toLowerCase()) ||
      (c.nfcUid && c.nfcUid.toLowerCase().includes(search.toLowerCase())) ||
      c.finish.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A32]">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            HARDWARE PROVISIONING
          </span>
          <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
            NFC Hardware & UID Manager
          </h1>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Pair physical NTAG216 chip serial UIDs with customer profiles and sovereign redirect slugs.
          </p>
        </div>

        {successMsg && (
          <div className="font-mono text-xs text-[#6FCF97] bg-[#1A2E24] px-3 py-1 rounded-[2px] border border-[#26533D] flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> {successMsg}
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by slug, NFC UID, or finish..."
          className="w-full bg-[#111114] border border-[#2A2A32] rounded-[2px] pl-9 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-silver/60"
        />
      </div>

      {/* Cards Table */}
      <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#2A2A32] text-text-tertiary font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Sovereign Slug</th>
                <th className="pb-3">Hardware Edition</th>
                <th className="pb-3">Finish / Material</th>
                <th className="pb-3">NFC Chip UID</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Provisioning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A32]/40">
              {filteredCards.map((c) => (
                <tr key={c.id} className="hover:bg-[#18181C]/50 transition-colors">
                  <td className="py-4 font-mono text-accent-silver font-medium">
                    /{c.qrSlug}
                  </td>
                  <td className="py-4 capitalize text-text-primary">
                    {c.variant}
                  </td>
                  <td className="py-4 text-text-secondary capitalize">
                    {c.finish} · {c.material}
                  </td>
                  <td className="py-4 font-mono">
                    {editingCardId === c.id ? (
                      <input
                        type="text"
                        value={inputUid}
                        onChange={(e) => setInputUid(e.target.value)}
                        placeholder="04:XX:XX:XX:XX:XX:XX"
                        className="bg-[#0E0E10] border border-accent-silver rounded-[2px] px-2 py-1 text-xs text-white font-mono uppercase"
                      />
                    ) : c.nfcUid ? (
                      <span className="text-text-primary">{c.nfcUid}</span>
                    ) : (
                      <span className="text-status-warning font-mono">UNPAIRED</span>
                    )}
                  </td>
                  <td className="py-4">
                    <span
                      className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] ${
                        c.status === "active"
                          ? "bg-[#1A2E24] text-[#6FCF97] border border-[#26533D]"
                          : "bg-[#2A241C] text-accent-champagne border border-[#4A3D2A]"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {editingCardId === c.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePair(c.id)}
                          className="text-xs"
                        >
                          Save UID
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCardId(null)}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingCardId(c.id);
                          setInputUid(c.nfcUid || "");
                        }}
                        className="text-xs"
                      >
                        {c.nfcUid ? "Re-assign UID" : "Assign NFC UID"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
