"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Shield, Key, Bell, Check, Lock, Mail, Globe, Plus, Trash2, RefreshCw } from "lucide-react";

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
    <div className="space-y-6 text-left max-w-5xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-[#C8C6C0]" /> SECURITY, DOMAINS & PREFERENCES
        </span>
        <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-tight mt-1">
          Account Settings
        </h1>
        <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
          Manage your sovereign authentication credentials, custom domains, and notification preferences.
        </p>
      </div>

      {/* Custom Domains Management Section */}
      <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl">
        <div className="border-b border-white/[0.06] pb-3">
          <h3 className="font-cinzel font-medium text-base text-white tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C8C6C0]" />
            Custom Domain Routing
          </h3>
          <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
            Map your personal executive domain to your sovereign digital profile with automated SSL and Cloudflare edge delivery.
          </p>
        </div>

        {domainMsg && (
          <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs font-sans text-white">
            {domainMsg}
          </div>
        )}

        <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="e.g. ceo.apexcapital.com"
            className="flex-1 bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 font-mono transition-colors"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={domainLoading}
            className="rounded-full text-xs px-6 min-h-[44px] bg-white text-black hover:bg-[#E5E5EA]"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> ADD DOMAIN
          </Button>
        </form>

        {domainsList.length > 0 && (
          <div className="space-y-3 pt-2">
            {domainsList.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-[#14141A] border border-white/[0.06] space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Globe className="w-4 h-4 text-[#C8C6C0]" />
                    <span className="font-mono text-white font-medium">{d.domain}</span>
                    {d.verificationStatus === "verified" ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/30 text-emerald-400 border border-emerald-800/30 font-mono text-[9px] font-bold">
                        VERIFIED · SSL ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950/30 text-amber-300 border border-amber-800/30 font-mono text-[9px] font-bold">
                        PENDING DNS PROPAGATION
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {d.verificationStatus !== "verified" && (
                      <button
                        type="button"
                        onClick={() => handleVerifyDomain(d.id)}
                        disabled={verifyingId === d.id}
                        className="px-3 py-1.5 min-h-[36px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-mono text-[10px] flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 ${verifyingId === d.id ? "animate-spin" : ""}`} />
                        <span>{verifyingId === d.id ? "Checking..." : "Verify DNS"}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteDomain(d.id)}
                      aria-label="Delete domain"
                      className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-red-400 hover:bg-red-950/30 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {d.verificationStatus !== "verified" && (
                  <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-1.5 text-[11px] font-mono text-[#8E8E98]">
                    <div>✦ CNAME Record: <span className="text-white">{d.domain}</span> → <span className="text-white font-semibold">domains.nxcverse.in</span></div>
                    <div>✦ TXT Verification: <span className="text-white">{d.domain}</span> → <span className="text-white font-semibold">nxc-verification={d.verificationToken}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* Password & Security Section */}
        <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel font-medium text-base text-white tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-[#C8C6C0]" />
              Authentication & Credentials
            </h3>
            <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
              Ensure your master console account is secured with a strong sovereign passphrase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Telemetry Alerts Section */}
        <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="font-cinzel font-medium text-base text-white tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C8C6C0]" />
              Telemetry & Interaction Alerts
            </h3>
            <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
              Choose which real-time notifications to receive when someone encounters your card.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-[#14141A] border border-white/[0.06] cursor-pointer hover:border-white/15 transition-all min-h-[52px]">
              <input
                type="checkbox"
                checked={notifyVcf}
                onChange={(e) => setNotifyVcf(e.target.checked)}
                className="mt-1 rounded bg-[#0A0A0E] border-white/20 text-white focus:ring-0 focus:ring-offset-0 w-4 h-4"
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

            <label className="flex items-start gap-3 p-4 rounded-xl bg-[#14141A] border border-white/[0.06] cursor-pointer hover:border-white/15 transition-all min-h-[52px]">
              <input
                type="checkbox"
                checked={notifyWeekly}
                onChange={(e) => setNotifyWeekly(e.target.checked)}
                className="mt-1 rounded bg-[#0A0A0E] border-white/20 text-white focus:ring-0 focus:ring-offset-0 w-4 h-4"
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
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 pb-6">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 animate-in fade-in">
                <Check className="w-4 h-4" /> Preferences updated successfully.
              </span>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto text-xs px-8 min-h-[48px] rounded-full bg-white text-black hover:bg-[#E5E5EA]"
          >
            SAVE PREFERENCES
          </Button>
        </div>
      </form>
    </div>
  );
}
