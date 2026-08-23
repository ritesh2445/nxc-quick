"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Shield, Key, Bell, Check, Sparkles, Lock, Mail, Globe, Plus, Trash2, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifyVcf, setNotifyVcf] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);

  // Custom Domains State
  const [domainInput, setDomainInput] = useState("");
  const [domainsList, setDomainsList] = useState<any[]>([]);
  const [domainLoading, setDomainLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [domainMsg, setDomainMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domains");
      const data = await res.json();
      if (data.domains) setDomainsList(data.domains);
    } catch {}
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setDomainLoading(true);
    setDomainMsg(null);

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setDomainInput("");
        setDomainMsg("Custom domain added. Please add the DNS records below to verify.");
        fetchDomains();
      } else {
        setDomainMsg(data.error || "Failed to add domain");
      }
    } catch (err: any) {
      setDomainMsg(err.message || "Failed to add domain");
    } finally {
      setDomainLoading(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setVerifyingId(domainId);
    setDomainMsg(null);

    try {
      const res = await fetch("/api/domains", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      });

      const data = await res.json();
      if (data.verified) {
        setDomainMsg("Domain verified successfully! Edge routing is now active.");
      } else {
        setDomainMsg(data.message || "DNS records not yet detected. Please allow DNS propagation.");
      }
      fetchDomains();
    } catch (err: any) {
      setDomainMsg("Verification request failed.");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    try {
      await fetch(`/api/domains?id=${id}`, { method: "DELETE" });
      fetchDomains();
    } catch {}
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-left max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> SECURITY, DOMAINS & PREFERENCES
        </span>
        <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
          Account Settings
        </h1>
        <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
          Manage your sovereign authentication credentials, custom domains, and notification preferences.
        </p>
      </div>

      {/* Custom Domains Management Section */}
      <div className="bg-[#060608]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-7 space-y-5 backdrop-blur-xl shadow-xl">
        <div className="border-b border-white/[0.06] pb-3">
          <h3 className="font-cinzel font-medium text-base text-white tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00A2FF]" />
            Custom Domain Routing (e.g. ceo.company.com)
          </h3>
          <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
            Map your personal executive domain to your sovereign digital profile with automated SSL and Cloudflare edge delivery.
          </p>
        </div>

        {domainMsg && (
          <div className="p-3 rounded-xl bg-white/[0.04] border border-[#0099FF]/40 text-xs font-sans text-[#80D0FF]">
            {domainMsg}
          </div>
        )}

        <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="e.g. ceo.apexcapital.com"
            className="flex-1 bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] font-mono"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={domainLoading}
            className="rounded-full text-xs px-6"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> ADD DOMAIN
          </Button>
        </form>

        {domainsList.length > 0 && (
          <div className="space-y-3 pt-2">
            {domainsList.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-[#0E0E14] border border-white/[0.06] space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#00A2FF]" />
                    <span className="font-mono text-white font-medium">{d.domain}</span>
                    {d.verificationStatus === "verified" ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                        VERIFIED · SSL ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                        PENDING DNS PROPAGATION
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {d.verificationStatus !== "verified" && (
                      <button
                        type="button"
                        onClick={() => handleVerifyDomain(d.id)}
                        disabled={verifyingId === d.id}
                        className="px-3 py-1 rounded-full bg-[#0088FF]/20 hover:bg-[#0088FF]/30 text-[#00A2FF] font-mono text-[10px] flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${verifyingId === d.id ? "animate-spin" : ""}`} />
                        <span>{verifyingId === d.id ? "Checking..." : "Verify DNS"}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteDomain(d.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {d.verificationStatus !== "verified" && (
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1.5 text-[11px] font-mono text-[#9E9EA8]">
                    <div>✦ CNAME Record: <span className="text-white">{d.domain}</span> → <span className="text-[#00A2FF]">domains.nxcverse.in</span></div>
                    <div>✦ TXT Verification: <span className="text-white">{d.domain}</span> → <span className="text-[#00A2FF]">nxc-verification={d.verificationToken}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* Password & Security Section */}
        <div className="bg-[#060608]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-7 space-y-5 backdrop-blur-xl shadow-xl">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel font-medium text-base text-white tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-[#00A2FF]" />
              Authentication & Credentials
            </h3>
            <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
              Ensure your master console account is secured with a strong sovereign passphrase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Telemetry Alerts Section */}
        <div className="bg-[#060608]/80 border border-white/[0.08] rounded-2xl p-4 sm:p-7 space-y-5 backdrop-blur-xl shadow-xl">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel font-medium text-base text-white tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00A2FF]" />
              Telemetry & Interaction Alerts
            </h3>
            <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
              Choose which real-time notifications to receive when someone encounters your card.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0E0E14] border border-white/[0.06] cursor-pointer hover:border-white/15 transition-all">
              <input
                type="checkbox"
                checked={notifyVcf}
                onChange={(e) => setNotifyVcf(e.target.checked)}
                className="mt-0.5 rounded bg-[#060608] border-white/20 text-[#00A2FF] focus:ring-0 focus:ring-offset-0 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="font-sans text-xs text-white font-medium block">
                  Instant Contact Download Alert
                </span>
                <span className="font-sans text-[11px] text-[#8E8E98] block">
                  Receive an automated email alert whenever a recipient downloads your .VCF contact file.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0E0E14] border border-white/[0.06] cursor-pointer hover:border-white/15 transition-all">
              <input
                type="checkbox"
                checked={notifyWeekly}
                onChange={(e) => setNotifyWeekly(e.target.checked)}
                className="mt-0.5 rounded bg-[#060608] border-white/20 text-[#00A2FF] focus:ring-0 focus:ring-offset-0 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="font-sans text-xs text-white font-medium block">
                  Weekly Sovereign Telemetry Report
                </span>
                <span className="font-sans text-[11px] text-[#8E8E98] block">
                  Weekly digest covering total impressions, unique NFC taps, and lead conversion rates.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00E5FF] animate-in fade-in">
                <Check className="w-4 h-4 text-[#00A2FF]" /> Preferences updated successfully.
              </span>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto text-xs px-8 rounded-full shadow-[0_0_20px_rgba(0,120,255,0.4)]"
          >
            SAVE PREFERENCES
          </Button>
        </div>
      </form>
    </div>
  );
}
