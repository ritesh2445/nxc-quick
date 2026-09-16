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
  ShieldCheck,
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
    <div className="space-y-6 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8C6C0]" /> IDENTITY CONFIGURATION
          </span>
          <h1 className="font-cinzel font-medium text-2xl sm:text-3xl text-white tracking-wide mt-1">
            Profile Editor
          </h1>
          <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
            Changes update your live public profile and .VCF contact card instantaneously in the cloud.
          </p>
        </div>

        <a href={`/@${username}`} target="_blank" rel="noopener noreferrer" className="btn-interactive shrink-0">
          <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs min-h-[44px] sm:min-h-0 rounded-full border-white/20 hover:border-white/40 text-white">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-[#A1A1AA]" /> VIEW LIVE PROFILE
          </Button>
        </a>
      </div>

      {/* Sovereign Identifier & QR Matrix */}
      <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-[#C8C6C0] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#A1A1AA]" /> PERMANENT IDENTIFIER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#8E8E98]">
                LOCKED
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

            <p className="font-sans text-xs text-[#8E8E98] leading-relaxed">
              Your sovereign handle and hardware QR matrix are permanently assigned to this profile, hardwired to your metal card's contactless NFC chip.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] border border-white/10 text-xs font-mono text-[#E2E0DC] hover:text-white flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#A1A1AA]" />}
                <span>{copiedUrl ? "COPIED TO CLIPBOARD" : "COPY PUBLIC LINK"}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#060608] border border-white/[0.08] rounded-xl p-4 flex flex-col items-center justify-center space-y-3 shrink-0 shadow-inner">
            <div className="p-2.5 bg-white rounded-lg shadow-lg">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`NXC Verse Default QR Matrix for @${username}`}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#111] flex items-center justify-center text-[10px] font-mono text-[#8E8E98]">
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
                className="text-[11px] font-mono text-[#C8C6C0] hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors min-h-[36px] sm:min-h-0"
              >
                <Download className="w-3 h-3 text-[#A1A1AA]" />
                <span>SAVE QR PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* VIP Direct Mode Switch Card */}
        <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-3 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <h3 className="font-cinzel font-medium text-base text-white">
                  VIP Direct Mode
                </h3>
                {vipDirectMode && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[9px] font-mono font-bold uppercase">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-[#8E8E98] leading-relaxed max-w-2xl">
                When enabled, NFC taps immediately download your verified vCard (.vcf) into the phonebook without showing the profile webpage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVipDirectMode(!vipDirectMode)}
              aria-label="Toggle VIP Direct Mode"
              className={`w-13 h-7 sm:w-12 sm:h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                vipDirectMode ? "bg-white" : "bg-white/20"
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full shadow-md transition-transform ${
                  vipDirectMode ? "translate-x-6 sm:translate-x-6 bg-black" : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Core Profile Attributes */}
        <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6 shadow-xl">
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
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Designation / Professional Title *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Direct Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 95612 48677"
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Direct Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
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
                  className="flex-1 bg-[#14141A] border border-white/[0.1] rounded-xl px-3.5 py-3 sm:py-2.5 min-h-[44px] text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="px-4 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-[0.98] border border-white/15 text-xs font-mono text-white flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingAvatar ? "..." : "Upload"}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1.5">
              Executive Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#14141A] border border-white/[0.1] rounded-xl p-3.5 text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 leading-relaxed transition-colors"
            />
          </div>
        </div>

        {/* Connected Social & Portfolio Links */}
        <div className="bg-[#0E0E12] border border-white/[0.08] rounded-2xl p-5 sm:p-7 md:p-8 space-y-4 shadow-xl">
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
              className="rounded-full text-xs min-h-[44px] sm:min-h-0 border-white/20 text-white hover:border-white/40 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> ADD NEW CHANNEL
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            {links.map((link, index) => (
              <div
                key={link.id}
                className="bg-[#14141A] border border-white/[0.06] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-all hover:border-white/20"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveLink(index, "up")}
                    disabled={index === 0}
                    aria-label="Move link up"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white/[0.05] text-[#8E8E98] hover:text-white flex items-center justify-center disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLink(index, "down")}
                    disabled={index === links.length - 1}
                    aria-label="Move link down"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-white/[0.05] text-[#8E8E98] hover:text-white flex items-center justify-center disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 flex-1">
                  <div>
                    <select
                      value={link.platform}
                      onChange={(e) => handleUpdateLink(link.id, "platform", e.target.value)}
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 text-base sm:text-xs text-white focus:outline-none focus:border-white/40 appearance-none"
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
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                      placeholder="https://"
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 text-base sm:text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  aria-label="Remove link"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-red-950/20 text-red-400 hover:bg-red-900/40 flex items-center justify-center transition-colors self-end sm:self-center shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.08] pb-6">
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
            className="w-full sm:w-auto rounded-full text-xs font-bold tracking-widest uppercase px-8 min-h-[48px] bg-white text-black hover:bg-[#E5E5EA]"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> SAVE PROFILE
          </Button>
        </div>
      </form>
    </div>
  );
}
