"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Search,
  ExternalLink,
  Sparkles,
  CreditCard,
  Building,
  Briefcase,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeDrawerUser, setActiveDrawerUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (verifiedFilter !== "all") params.set("verified", verifiedFilter);
      if (roleFilter !== "all") params.set("role", roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [verifiedFilter, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleVerify = async (userId: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = !currentStatus;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isVerified: nextStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isVerified: nextStatus } : u))
        );
      }
    } catch (err) {
      console.error("Failed to toggle user verification:", err);
    }
  };

  const verifiedCount = users.filter((u) => u.isVerified).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#060609]">
      <AdminHeader
        title="Customer Directory & Identities"
        subtitle="Sovereign profile verification, credential authorization, and digital card fleet"
        badge="IDENTITY DIRECTORY"
        onRefresh={fetchUsers}
        isRefreshing={refreshing}
      />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Registered Customers</span>
              <div className="text-xl font-bold font-cinzel text-white mt-0.5">{users.length} Identities</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">100% Sovereign Accounts</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Sovereign Verified</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{verifiedCount} Verified</div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Atelier VIP Checkmarks Active</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C0C12] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Hardware Card Holders</span>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {users.filter((u) => u.cardsCount > 0).length} Holders
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Physical Metal Card Linked</p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0B0B10] border border-white/10 flex flex-col md:flex-row items-center gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name, Username, Email, Company..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:border-amber-400 outline-none"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-[11px] font-mono text-neutral-400 shrink-0">Verification:</span>
            {[
              { id: "all", label: "All" },
              { id: "true", label: "Verified Only" },
              { id: "false", label: "Unverified" },
            ].map((vf) => (
              <button
                key={vf.id}
                onClick={() => setVerifiedFilter(vf.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                  verifiedFilter === vf.id
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold"
                    : "bg-neutral-900 text-neutral-400 border border-white/5 hover:text-white"
                }`}
              >
                {vf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0A0A10] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-neutral-950/80 text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Customer Identity</th>
                  <th className="py-3.5 px-4 font-medium">Professional Role</th>
                  <th className="py-3.5 px-4 font-medium">Digital Card Handle</th>
                  <th className="py-3.5 px-4 font-medium">Hardware Cards</th>
                  <th className="py-3.5 px-4 font-medium">VIP Checkmark</th>
                  <th className="py-3.5 px-4 font-medium text-right">Dossier</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 text-xs">
                      Loading customer directory...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 text-xs">
                      No matching customer accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setActiveDrawerUser(u)}
                      className="hover:bg-neutral-900/60 transition-colors cursor-pointer group"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400 font-cinzel shrink-0">
                            {u.fullName ? u.fullName.slice(0, 2).toUpperCase() : "US"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white font-medium font-sans group-hover:text-amber-400 transition-colors">
                                {u.fullName}
                              </span>
                              {u.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-400 block truncate max-w-[200px]">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Professional Role */}
                      <td className="py-4 px-4 font-sans">
                        <div className="text-neutral-200 text-xs">{u.designation || "Executive"}</div>
                        <div className="text-[11px] text-neutral-500">{u.company || "NXC Ecosystem"}</div>
                      </td>

                      {/* Handle */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`/p/${u.username}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-300 hover:text-amber-400 font-sans group/link"
                        >
                          <span>/p/{u.username}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500 group-hover/link:text-amber-400" />
                        </a>
                      </td>

                      {/* Cards Count */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-300 text-[11px]">
                          <CreditCard className="w-3 h-3 text-cyan-400" />
                          <span>{u.cardsCount || 0} Linked</span>
                        </span>
                      </td>

                      {/* Verification Toggle */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggleVerify(u.id, Boolean(u.isVerified), e)}
                          className={`px-3 py-1 rounded-full text-[10px] uppercase font-semibold transition-all border ${
                            u.isVerified
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                              : "bg-neutral-900 text-neutral-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {u.isVerified ? "Verified VIP" : "Standard"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setActiveDrawerUser(u)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
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

      {/* User Detail Drawer */}
      <UserDetailDrawer
        user={activeDrawerUser}
        isOpen={Boolean(activeDrawerUser)}
        onClose={() => setActiveDrawerUser(null)}
        onUpdateUser={(updated) => {
          setActiveDrawerUser(updated);
          setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        }}
      />
    </div>
  );
}
