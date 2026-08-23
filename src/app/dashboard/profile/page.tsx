"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Save,
  ArrowUp,
  ArrowDown,
  Lock,
  QrCode,
  Download,
  Copy,
  Sparkles,
  ShieldCheck,
  Globe,
  Radio,
  Upload,
  Zap,
} from "lucide-react";

interface ProfileLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
}

export default function ProfileEditorPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identity State
  const [username, setUsername] = useState("ritesh");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const [fullName, setFullName] = useState("Ritesh Martawar");
  const [designation, setDesignation] = useState("Founder & Chief Executive");
  const [company, setCompany] = useState("NXC Verse");
  const [bio, setBio] = useState(
    "Designing tactile luxury hardware and next-generation sovereign digital identities for modern visionaries."
  );
  const [phone, setPhone] = useState("+91 95612 48677");
  const [email, setEmail] = useState("nxcbadge@gmail.com");
  const [website, setWebsite] = useState("https://nxcverse.in");
  const [location, setLocation] = useState("Mumbai, India");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
  );
  const [vipDirectMode, setVipDirectMode] = useState(false);

  const [links, setLinks] = useState<ProfileLink[]>([
    {
      id: "lnk_1",
      platform: "linkedin",
      label: "LinkedIn Profile",
      url: "https://linkedin.com/in/ritesh-martawar",
      sortOrder: 0,
      isVisible: true,
    },
    {
      id: "lnk_2",
      platform: "x",
      label: "X / Twitter",
      url: "https://x.com/nxcverse",
      sortOrder: 1,
      isVisible: true,
    },
    {
      id: "lnk_3",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/nxcverse.in",
      sortOrder: 2,
      isVisible: true,
    },
    {
      id: "lnk_4",
      platform: "website",
      label: "NXC Verse Official",
      url: "https://nxcverse.in",
      sortOrder: 3,
      isVisible: true,
    },
  ]);

  // Load Session User & Profile Data
  useEffect(() => {
    async function loadData() {
      try {
        setInitialLoading(true);
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.profile) {
          setUsername(data.profile.username || "ritesh");
          setFullName(data.profile.fullName || "");
          setDesignation(data.profile.designation || "");
          setCompany(data.profile.company || "");
          setBio(data.profile.bio || "");
          setPhone(data.profile.phone || "");
          setEmail(data.profile.email || "");
          setWebsite(data.profile.website || "");
          setLocation(data.profile.location || "");
          setVipDirectMode(!!data.profile.vipDirectMode);
          if (data.profile.avatarUrl) setAvatarUrl(data.profile.avatarUrl);

          // Fetch links
          const profileRes = await fetch(`/api/profile/${data.profile.username}`);
          const profileData = await profileRes.json();
          if (profileData.links) {
            setLinks(profileData.links);
          }

          // Fetch QR
          const qrRes = await fetch(`/api/qr/generate?text=https://nxcverse.in/@${data.profile.username}`);
          const qrData = await qrRes.json();
          if (qrData.dataUrl) setQrDataUrl(qrData.dataUrl);
        } else {
          // Fallback fetch default QR for ritesh
          const qrRes = await fetch(`/api/qr/generate?text=https://nxcverse.in/@ritesh`);
          const qrData = await qrRes.json();
          if (qrData.dataUrl) setQrDataUrl(qrData.dataUrl);
        }
      } catch (err) {
        console.error("Error loading profile editor data", err);
      } finally {
        setInitialLoading(false);
      }
    }

    loadData();
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://nxcverse.in/@${username}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `NXC_${username}_Default_QR.png`;
    a.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "profile");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setAvatarUrl(data.url);
      }
    } catch (err) {
      console.error("Failed to upload avatar", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddLink = () => {
    const newLink: ProfileLink = {
      id: `lnk_${Date.now()}`,
      platform: "website",
      label: "New Connected Link",
      url: "https://",
      sortOrder: links.length,
      isVisible: true,
    };
    setLinks([...links, newLink]);
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleUpdateLink = (id: string, field: keyof ProfileLink, val: unknown) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const handleMoveLink = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);
    setLinks(newLinks);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/profile/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          designation,
          company,
          bio,
          phone,
          email,
          website,
          location,
          avatarUrl,
          vipDirectMode,
          links,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#00A2FF] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> IDENTITY CONFIGURATION
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-wide mt-1">
            Profile Editor
          </h1>
          <p className="font-sans text-xs text-[#9E9EA8] mt-0.5">
            Changes made here update your live public profile and .VCF contact card instantly in the cloud.
          </p>
        </div>

        <a href={`/@${username}`} target="_blank" rel="noopener noreferrer" className="btn-interactive">
          <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs rounded-full border-white/20 hover:border-[#0088FF] text-white">
            <ExternalLink className="w-3.5 h-3.5 mr-1 text-[#00A2FF]" /> VIEW LIVE PROFILE
          </Button>
        </a>
      </div>

      {/* Sovereign Identifier & QR Matrix */}
      <div className="bg-[#060608] border border-white/[0.1] rounded-[20px] p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0066FF]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[10px] font-mono text-[#00A2FF] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#00A2FF]" /> PERMANENT IDENTIFIER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0055FF]/20 text-[10px] font-mono text-[#80D0FF]">
                NON-EDITABLE
              </span>
            </div>

            <div>
              <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                @{username}
              </p>
              <p className="font-mono text-xs text-[#8E8E98] mt-0.5 break-all">
                https://nxcverse.in/@{username}
              </p>
            </div>

            <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
              Your unique sovereign handle and default hardware QR matrix are permanently assigned to this profile, hardwired to your metal card's contactless NFC chip.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-[#E2E0DC] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#00E5FF]" /> : <Copy className="w-3.5 h-3.5 text-[#00A2FF]" />}
                <span>{copiedUrl ? "COPIED TO CLIPBOARD" : "COPY PUBLIC LINK"}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0A0A0E] border border-white/[0.1] rounded-[16px] p-4 flex flex-col items-center justify-center space-y-3 shrink-0 shadow-inner">
            <div className="p-2 bg-white rounded-[10px] shadow-lg">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`NXC Verse Default QR Matrix for @${username}`}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#111] flex items-center justify-center text-[10px] font-mono text-white">
                  GENERATING QR...
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <span className="font-mono text-[9px] text-[#8E8E98] tracking-wider uppercase block">
                DEFAULT HARDWARE QR
              </span>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="text-[11px] font-mono text-[#00A2FF] hover:text-white flex items-center gap-1 mx-auto transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>SAVE QR PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* VIP Direct Mode Switch Card */}
        <div className="bg-[#060608] border border-white/[0.1] rounded-[20px] p-4 sm:p-7 space-y-3 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFD700]" />
                <h3 className="font-cinzel font-medium text-base text-white">
                  VIP Direct Mode
                </h3>
                {vipDirectMode && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFD700] text-[9px] font-mono font-bold uppercase">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-[#8E8E98] leading-relaxed max-w-2xl">
                When enabled, visitors and NFC taps immediately download your contact vCard (.vcf) directly into their phonebook without displaying the web profile page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVipDirectMode(!vipDirectMode)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                vipDirectMode ? "bg-[#0088FF]" : "bg-white/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  vipDirectMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Core Profile Attributes */}
        <div className="bg-[#060608] border border-white/[0.08] rounded-[20px] p-4 sm:p-7 md:p-8 space-y-5 sm:space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="font-cinzel font-medium text-base text-white tracking-wide">
              Core Identity & Contact Information
            </h3>
            <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
              These details are embedded into the .VCF file and public digital profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Designation / Professional Title *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Direct Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 95612 48677"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Direct Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
                Avatar Photo (Cloudflare R2)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="flex-1 bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-xs font-mono text-[#00A2FF] flex items-center gap-1.5 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingAvatar ? "..." : "Upload"}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1.5">
              Executive Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] p-3.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF] leading-relaxed"
            />
          </div>
        </div>

        {/* Connected Social & Portfolio Links */}
        <div className="bg-[#060608] border border-white/[0.08] rounded-[20px] p-4 sm:p-7 md:p-8 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="font-cinzel font-medium text-base text-white tracking-wide">
                Connected Platforms & Social Links
              </h3>
              <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
                Add, reorder, or update your social media handles and custom portfolio buttons.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLink}
              className="rounded-full text-xs border-[#0088FF]/40 text-[#00E5FF] hover:bg-[#0088FF]/10 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> ADD NEW CHANNEL
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            {links.map((link, index) => (
              <div
                key={link.id}
                className="bg-[#0E0E14] border border-white/[0.06] rounded-[14px] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-all hover:border-white/20"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveLink(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-white/[0.03] text-[#8E8E98] hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLink(index, "down")}
                    disabled={index === links.length - 1}
                    className="p-1.5 rounded-lg bg-white/[0.03] text-[#8E8E98] hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 flex-1">
                  <div>
                    <select
                      value={link.platform}
                      onChange={(e) => handleUpdateLink(link.id, "platform", e.target.value)}
                      className="w-full bg-[#060608] border border-white/10 rounded-[10px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="x">X / Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="github">GitHub</option>
                      <option value="youtube">YouTube</option>
                      <option value="website">Official Website</option>
                      <option value="custom">Custom URL</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink(link.id, "label", e.target.value)}
                      placeholder="Display Label"
                      className="w-full bg-[#060608] border border-white/10 rounded-[10px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                    />
                  </div>

                  <div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                      placeholder="https://"
                      className="w-full bg-[#060608] border border-white/10 rounded-[10px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0088FF] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  className="p-2 rounded-lg bg-red-950/20 text-red-400 hover:bg-red-900/40 transition-colors self-end sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          {saved ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
              <Check className="w-4 h-4" />
              <span>SAVED SUCCESSFULLY · CLOUD REFRESHED</span>
            </div>
          ) : (
            <span className="text-[11px] font-sans text-[#7E7E8E]">
              All changes sync instantaneously with your NFC card & cloud storage.
            </span>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="rounded-full text-xs font-bold tracking-widest uppercase px-8"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> SAVE PROFILE
          </Button>
        </div>
      </form>
    </div>
  );
}
