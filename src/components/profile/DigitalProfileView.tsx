"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Modal } from "@/components/ui/Modal";
import { downloadVCard } from "@/lib/vcf";
import {
  Phone,
  Mail,
  Globe,
  ArrowDownToLine,
  Check,
  Share2,
  QrCode,
  ShieldCheck,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Youtube,
  ExternalLink,
  Radio,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface ProfileData {
  id: string;
  username: string;
  fullName: string;
  designation: string;
  company?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  location?: string | null;
  isVerified: boolean;
  links: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
    icon?: string | null;
  }>;
  card?: {
    variant: string;
    finish: string;
    material: string;
    nfcUid?: string | null;
  } | null;
}

export function DigitalProfileView({ profile }: { profile: ProfileData }) {
  const [saved, setSaved] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [likesCount, setLikesCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number }>>([]);

  const trackEvent = (eventType: string, linkId?: string) => {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId: profile.id,
        eventType,
        linkId,
      }),
    }).catch(() => {});
  };

  const handleHeartClick = () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    if (nextLiked) {
      // Trigger cute floating hearts
      const heartId = Date.now();
      const randomX = Math.floor(Math.random() * 60) - 30;
      setFloatingHearts((prev) => [...prev, { id: heartId, x: randomX }]);

      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1500);

      // Trigger micro sparkle confetti
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#FF2A55", "#FF6B8B", "#0099FF", "#FFFFFF"],
          ticks: 200,
        });
      } catch {}

      trackEvent("profile_like");
    }
  };

  const handleSaveContact = () => {
    downloadVCard(
      {
        fullName: profile.fullName,
        designation: profile.designation,
        company: profile.company,
        phone: profile.phone,
        email: profile.email,
        website: profile.website,
        bio: profile.bio,
        profileUrl: `https://nxcverse.in/@${profile.username}`,
      },
      `${profile.fullName.replace(/\s+/g, "_")}_NXC.vcf`
    );

    setSaved(true);
    trackEvent("contact_save");

    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFFFFF", "#0099FF", "#E2E0DC"],
      });
    } catch {}

    setTimeout(() => setSaved(false), 3000);
  };

  const handleOpenQr = async () => {
    setQrModalOpen(true);
    trackEvent("qr_scan");
    try {
      const res = await fetch(`/api/qr/generate?text=https://nxcverse.in/@${profile.username}`);
      const data = await res.json();
      if (data.dataUrl) {
        setQrDataUrl(data.dataUrl);
      }
    } catch {
      // Fallback
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.fullName} · NXC Verse Digital Identity`,
        text: `Connect with ${profile.fullName} (${profile.designation})`,
        url: `https://nxcverse.in/@${profile.username}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`https://nxcverse.in/@${profile.username}`);
      alert("Profile link copied to clipboard!");
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-[#0077B5]" />;
      case "x":
      case "twitter":
        return <Twitter className="w-4 h-4 text-white" />;
      case "instagram":
        return <Instagram className="w-4 h-4 text-[#E1306C]" />;
      case "github":
        return <Github className="w-4 h-4 text-white" />;
      case "youtube":
        return <Youtube className="w-4 h-4 text-[#FF0000]" />;
      case "whatsapp":
        return <MessageCircle className="w-4 h-4 text-[#25D366]" />;
      default:
        return <Globe className="w-4 h-4 text-[#0099FF]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-between py-10 px-4 select-none relative text-left overflow-x-hidden">
      {/* Background Ambient Electric Blue Cybernetic Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0055FF]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#0033AA]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Luxury Profile Container */}
      <div className="w-full max-w-md bg-[#050508]/90 border border-white/[0.12] rounded-[32px] p-6 sm:p-8 space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_30px_rgba(0,120,255,0.15)] backdrop-blur-2xl relative z-10 my-auto">
        {/* Top Header Row: Brand, Verification & Quick Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <Link href="/" className="group flex items-center gap-2 btn-interactive">
            <div className="w-2 h-2 rounded-full bg-[#0099FF] shadow-[0_0_8px_#0099FF]" />
            <span className="font-cinzel font-semibold text-xs tracking-[0.25em] text-white/80 group-hover:text-white transition-colors">
              NXC VERSE
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-[#0099FF]/40 font-mono text-[9px] text-[#80D0FF] uppercase tracking-wider shadow-[0_0_10px_rgba(0,140,255,0.2)]">
                <ShieldCheck className="w-3 h-3 text-[#00A2FF]" /> VERIFIED
              </span>
            )}

            <button
              onClick={handleOpenQr}
              className="p-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#0099FF]/50 text-white/80 hover:text-white transition-all btn-interactive"
              aria-label="View QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#0099FF]/50 text-white/80 hover:text-white transition-all btn-interactive"
              aria-label="Share Profile"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Profile Avatar & Identity */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2 relative">
          {/* Avatar with Breathing Ambient Cyan Halo */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#0055FF] via-[#00A2FF] to-white opacity-40 blur-md animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/40 p-1 bg-[#0E0E14] shadow-2xl overflow-hidden">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#121218] to-[#040406] flex items-center justify-center text-[#E2E0DC] font-cinzel text-3xl font-light">
                  {profile.fullName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-cinzel text-2xl sm:text-3xl font-medium text-white tracking-wide">
              {profile.fullName}
            </h1>
            <p className="font-tenor text-xs sm:text-sm font-normal text-[#80D0FF] tracking-wider uppercase">
              {profile.designation} {profile.company && `· ${profile.company}`}
            </p>
            {profile.location && (
              <p className="font-mono text-[10px] text-[#6E6E7A] tracking-widest uppercase">
                {profile.location}
              </p>
            )}
          </div>

          {profile.bio && (
            <p className="font-sans text-xs text-[#A0A0B0] leading-relaxed max-w-xs pt-1">
              {profile.bio}
            </p>
          )}

          {/* Cute Heart Button with Floating Hearts Animation */}
          <div className="pt-2 relative">
            <button
              onClick={handleHeartClick}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 btn-interactive ${
                isLiked
                  ? "bg-[#FF2A55]/15 border-[#FF2A55] text-[#FF4D70] shadow-[0_0_20px_rgba(255,42,85,0.4)] scale-105"
                  : "bg-white/[0.03] border-white/10 hover:border-[#FF2A55]/50 text-[#8E8E98] hover:text-[#FF4D70]"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isLiked ? "fill-current scale-125 animate-bounce" : ""
                }`}
              />
              <span className="font-mono text-xs font-semibold">{likesCount}</span>
              <span className="font-sans text-[10px] uppercase tracking-wider">Vibes</span>
            </button>

            {/* Floating Heart Particles */}
            {floatingHearts.map((heart) => (
              <span
                key={heart.id}
                style={{ left: `calc(50% + ${heart.x}px)` }}
                className="absolute top-0 pointer-events-none text-base animate-bounce duration-1000 -translate-y-8 opacity-0 transition-opacity"
              >
                💖
              </span>
            ))}
          </div>
        </div>

        {/* Primary 1-Click Save Contact Action (Porcelain Gloss Pill) */}
        <button
          onClick={handleSaveContact}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFFBE8] via-[#FFFFFF] to-[#E8DFC8] text-black font-sans font-bold text-xs tracking-[0.2em] uppercase shadow-[0_10px_35px_rgba(255,255,255,0.25)] hover:shadow-[0_10px_45px_rgba(255,255,255,0.45)] flex items-center justify-center gap-2 btn-interactive"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-[#008800]" />
              <span>CONTACT SAVED TO PHONE (.VCF)</span>
            </>
          ) : (
            <>
              <ArrowDownToLine className="w-4 h-4" />
              <span>SAVE CONTACT</span>
            </>
          )}
        </button>

        {/* Direct Action Grid (Call, Email, WhatsApp) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              onClick={() => trackEvent("phone_click")}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#0099FF]/50 flex flex-col items-center gap-1.5 transition-all group btn-interactive"
            >
              <Phone className="w-4 h-4 text-[#8E8E98] group-hover:text-[#00A2FF] transition-colors" />
              <span className="font-sans text-[10px] text-white/90 font-medium uppercase tracking-wider">
                Call
              </span>
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              onClick={() => trackEvent("email_click")}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#0099FF]/50 flex flex-col items-center gap-1.5 transition-all group btn-interactive"
            >
              <Mail className="w-4 h-4 text-[#8E8E98] group-hover:text-[#00A2FF] transition-colors" />
              <span className="font-sans text-[10px] text-white/90 font-medium uppercase tracking-wider">
                Email
              </span>
            </a>
          )}
          {profile.phone && (
            <a
              href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("whatsapp_click")}
              className="p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] flex flex-col items-center gap-1.5 transition-all group btn-interactive shadow-[0_0_15px_rgba(37,211,102,0.15)]"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span className="font-sans text-[10px] text-[#25D366] font-medium uppercase tracking-wider">
                WhatsApp
              </span>
            </a>
          )}
        </div>

        {/* Social / Connected Platforms List */}
        {profile.links && profile.links.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="font-mono text-[10px] text-[#80D0FF] uppercase tracking-[0.25em] block mb-2 font-semibold">
              CONNECTED CHANNELS
            </span>
            <div className="space-y-2">
              {profile.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("link_click", link.id)}
                  className="w-full p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#0099FF]/40 hover:bg-white/[0.06] flex items-center justify-between transition-all group btn-interactive"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <span className="font-sans text-xs text-white font-medium group-hover:text-[#80D0FF] transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#62626E] group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Hardware Meta Pill */}
        {profile.card && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#8E8E98]">
            <span className="flex items-center gap-1.5 text-[#80D0FF]">
              <Radio className="w-3 h-3 text-[#00A2FF] animate-pulse" /> NFC {profile.card.finish.toUpperCase()}
            </span>
            <span>{profile.card.nfcUid || "AUTHENTICATED"}</span>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="pt-8 text-center space-y-2 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8E8E98] hover:text-white tracking-[0.25em] uppercase transition-colors btn-interactive"
        >
          <Sparkles className="w-3 h-3 text-[#00A2FF]" />
          <span>POWERED BY NXC VERSE</span>
        </Link>
        <p className="font-sans text-[11px] text-[#62626E]">
          Tap metal card or scan QR to connect instantaneously.
        </p>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Sovereign QR Matrix"
        subtitle={`https://nxcverse.in/@${profile.username}`}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="p-4 bg-white rounded-2xl shadow-2xl border border-white/20">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR Code" className="w-56 h-56 object-contain" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-black font-mono text-xs">
                Generating Matrix...
              </div>
            )}
          </div>
          <p className="font-sans text-xs text-[#9E9EA8] text-center max-w-xs">
            Scan with any camera app to open {profile.fullName}&apos;s digital identity card.
          </p>
        </div>
      </Modal>
    </div>
  );
}
