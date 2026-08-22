"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Users, ShieldCheck, ExternalLink, Search, Check, Ban } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: "usr_ritesh",
      username: "ritesh",
      fullName: "Ritesh Martawar",
      email: "ritesh@nxcverse.in",
      role: "customer",
      isVerified: true,
      cardEdition: "Atelier Obsidian",
      createdAt: "Aug 2026",
    },
    {
      id: "usr_aarav",
      username: "aarav",
      fullName: "Aarav Mehta",
      email: "aarav@nxcverse.in",
      role: "customer",
      isVerified: true,
      cardEdition: "Metal Titanium",
      createdAt: "Aug 2026",
    },
    {
      id: "usr_demo",
      username: "demo",
      fullName: "Julian Vance",
      email: "demo@nxcverse.in",
      role: "customer",
      isVerified: true,
      cardEdition: "Metal Titanium",
      createdAt: "Aug 2026",
    },
    {
      id: "usr_admin",
      username: "admin",
      fullName: "NXC Security Admin",
      email: "admin@nxcverse.in",
      role: "admin",
      isVerified: true,
      cardEdition: "Atelier Carbon",
      createdAt: "Aug 2026",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A32]">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            IDENTITY DIRECTORY
          </span>
          <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
            User Profiles & Accounts
          </h1>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Manage sovereign customer profiles, verification status, and credentials.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, username, or email..."
          className="w-full bg-[#111114] border border-[#2A2A32] rounded-[2px] pl-9 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-silver/60"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#2A2A32] text-text-tertiary font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Customer Identity</th>
                <th className="pb-3">Sovereign URL</th>
                <th className="pb-3">Hardware Commissioned</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A32]/40">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#18181C]/50 transition-colors">
                  <td className="py-4">
                    <p className="font-semibold text-text-primary">{u.fullName}</p>
                    <p className="text-text-tertiary text-[11px]">{u.email}</p>
                  </td>
                  <td className="py-4 font-mono text-accent-silver">
                    /@{u.username}
                  </td>
                  <td className="py-4 text-text-secondary">
                    {u.cardEdition}
                  </td>
                  <td className="py-4">
                    {u.isVerified ? (
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] bg-[#1A2E24] text-[#6FCF97] border border-[#26533D] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] bg-[#18181C] text-text-tertiary">
                        STANDARD
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <Link href={`/@${u.username}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Live
                      </Button>
                    </Link>
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
