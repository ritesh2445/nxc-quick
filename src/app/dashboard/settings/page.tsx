"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Shield, Key, Bell, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-3xl">
      {/* Header */}
      <div className="pb-6 border-b border-[#2A2A32]">
        <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
          SECURITY & PREFERENCES
        </span>
        <h1 className="font-sans font-medium text-2xl md:text-3xl text-[#F2F0EC] tracking-tight mt-1">
          Account Settings
        </h1>
        <p className="font-sans text-xs text-text-secondary mt-0.5">
          Manage your sovereign authentication credentials and telemetry notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Password & Security Section */}
        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
          <h3 className="font-sans font-semibold text-sm text-text-primary uppercase tracking-wider border-b border-[#2A2A32] pb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-accent-silver" /> Authentication & Password
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-text-secondary uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                className="w-full bg-[#18181C] border border-[#2A2A32] rounded-[2px] px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-silver/60"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-[#111114] border border-[#2A2A32] rounded-[4px] p-6 space-y-4">
          <h3 className="font-sans font-semibold text-sm text-text-primary uppercase tracking-wider border-b border-[#2A2A32] pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent-silver" /> Interaction Alerts
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs font-sans text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded-[2px] bg-[#18181C] border-[#2A2A32] text-accent-silver focus:ring-0"
              />
              <span>Send instant email digest when someone saves your .VCF contact card</span>
            </label>
            <label className="flex items-center gap-3 text-xs font-sans text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded-[2px] bg-[#18181C] border-[#2A2A32] text-accent-silver focus:ring-0"
              />
              <span>Weekly telemetry breakdown & geo-distribution report</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-mono text-[#6FCF97] flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences updated.
            </span>
          )}
          <Button type="submit" variant="primary" size="md" className="ml-auto text-xs px-6">
            SAVE PREFERENCES
          </Button>
        </div>
      </form>
    </div>
  );
}
