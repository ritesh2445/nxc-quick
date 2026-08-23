"use client";

import React, { useState, useEffect } from "react";
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
  const [saved, setSaved] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

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
    <div className="space-y-8 text-left max-w-5xl">
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

        <a href={`/@${username}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="text-xs rounded-full border-white/20 hover:border-[#0088FF] text-white">
            <ExternalLink className="w-3.5 h-3.5 mr-1 text-[#00A2FF]" /> VIEW LIVE PROFILE
          </Button>
        </a>
      </div>

      {/* ============================================================ */}
      {/* PERMANENT SOVEREIGN IDENTIFIER & DEFAULT QR MATRIX BANNER    */}
      {/* (Non-editable as requested to protect NFC routing)           */}
      {/* ============================================================ */}
      <div className="bg-[#060608] border border-white/[0.1] rounded-[20px] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0066FF]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Left: Username Handle Info */}
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[10px] font-mono text-[#00A2FF] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#00A2FF]" /> PERMANENT IDENTIFIER (LOCKED)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0055FF]/20 text-[10px] font-mono text-[#80D0FF]">
                NON-EDITABLE
              </span>
            </div>

            <div>
              <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                @{username}
              </p>
              <p className="font-mono text-xs text-[#8E8E98] mt-0.5">
                https://nxcverse.in/@{username}
              </p>
            </div>

            <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed">
              Your unique sovereign handle and default hardware QR matrix are permanently assigned to this profile.
              They are hardwired to your aerospace metal card's laser engraving and contactless NFC chip.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-[#E2E0DC] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#00E5FF]" /> : <Copy className="w-3.5 h-3.5 text-[#00A2FF]" />}
                <span>{copiedUrl ? "COPIED TO CLIPBOARD" : "COPY PUBLIC LINK"}</span>
              </button>
            </div>
          </div>

          {/* Right: Default QR Code Display with Download */}
          <div className="bg-[#0A0A0E] border border-white/[0.1] rounded-[16px] p-4 flex flex-col items-center justify-center space-y-3 shrink-0 shadow-inner">
            <div className="p-2 bg-white rounded-[10px] shadow-lg">
              {qrDataUrl ? (
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
      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Profile Attributes */}
        <div className="bg-[#060608] border border-white/[0.08] rounded-[20px] p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="font-cinzel font-medium text-base text-white tracking-wide">
              Core Identity & Contact Information
            </h3>
            <p className="font-sans text-xs text-[#8E8E98] mt-0.5">
              These details are embedded into the .VCF file and public digital profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                Avatar Photo URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-[#0088FF]"
              />
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
        <div className="bg-[#060608] border border-white/[0.08] rounded-[20px] p-6 sm:p-8 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
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
              className="text-xs rounded-full border-white/20 hover:border-[#0088FF] text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> ADD LINK
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            {links.map((link, idx) => (
              <div
                key={link.id}
                className="p-4 rounded-[14px] bg-[#0E0E14] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Platform select */}
                <div className="sm:col-span-3">
                  <select
                    value={link.platform}
                    onChange={(e) => handleUpdateLink(link.id, "platform", e.target.value)}
                    className="w-full bg-[#060608] border border-white/[0.1] rounded-[10px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="x">X / Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="github">GitHub</option>
                    <option value="youtube">YouTube</option>
                    <option value="website">Website</option>
                    <option value="custom">Custom URL</option>
                  </select>
                </div>

                {/* Label */}
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdateLink(link.id, "label", e.target.value)}
                    placeholder="Button Label"
                    className="w-full bg-[#060608] border border-white/[0.1] rounded-[10px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0088FF]"
                  />
                </div>

                {/* URL */}
                <div className="sm:col-span-4">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                    placeholder="https://"
                    className="w-full bg-[#060608] border border-white/[0.1] rounded-[10px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0088FF] font-mono"
                  />
                </div>

                {/* Controls */}
                <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveLink(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 text-[#8E8E98] hover:text-white disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLink(idx, "down")}
                    disabled={idx === links.length - 1}
                    className="p-1.5 text-[#8E8E98] hover:text-white disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link.id)}
                    className="p-1.5 text-[#8E8E98] hover:text-red-400 ml-1"
                    title="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00E5FF] animate-in fade-in">
                <Check className="w-4 h-4 text-[#00A2FF]" /> Changes successfully saved to sovereign record.
              </span>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="text-xs tracking-widest px-8 rounded-full shadow-[0_0_20px_rgba(0,120,255,0.4)]"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> SAVE PROFILE CHANGES
          </Button>
        </div>
      </form>
    </div>
  );
}
