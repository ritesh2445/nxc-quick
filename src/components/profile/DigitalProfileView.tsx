"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
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
  UserPlus,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BrandLogo } from "@/components/layout/BrandLogo";

export interface DigitalProfileViewProps {
  profile: any;
  initialLinks?: any[];
}

export function DigitalProfileView({ profile, initialLinks }: DigitalProfileViewProps) {
  const [saved, setSaved] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const effectiveLinks = initialLinks || profile.links || [];

  // Exchange Contact State
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeName, setExchangeName] = useState("");
  const [exchangePhone, setExchangePhone] = useState("");
  const [exchangeEmail, setExchangeEmail] = useState("");
  const [exchangeCompany, setExchangeCompany] = useState("");
  const [exchangeNotes, setExchangeNotes] = useState("");
  const [isExchanging, setIsExchanging] = useState(false);
  const [exchangeSent, setExchangeSent] = useState(false);

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
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeName.trim()) return;
    setIsExchanging(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: exchangeName.trim(),
          phone: exchangePhone.trim(),
          email: exchangeEmail.trim(),
          company: exchangeCompany.trim(),
          notes: exchangeNotes.trim(),
          profileId: profile.id,
          username: profile.username,
          source: "profile_exchange",
        }),
      });

      if (res.ok) {
        setExchangeSent(true);
        trackEvent("contact_exchange");
        setTimeout(() => {
          setExchangeModalOpen(false);
          setExchangeSent(false);
          setExchangeName("");
          setExchangePhone("");
          setExchangeEmail("");
          setExchangeCompany("");
          setExchangeNotes("");
        }, 2500);
      }
    } catch (err) {
      console.error("Exchange failed", err);
    } finally {
      setIsExchanging(false);
    }
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
    } catch {}
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `${profile.fullName} · NXC Verse Sovereign Identity`,
        text: `Connect with ${profile.fullName} (${profile.designation})`,
        url: `https://nxcverse.in/@${profile.username}`,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://nxcverse.in/@${profile.username}`);
      alert("Profile link copied to clipboard.");
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-[#0A66C2]" />;
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
        return <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />;
      default:
        return <Globe className="w-4 h-4 text-[#E2E0DC]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-between py-6 sm:py-10 px-3.5 sm:px-4 text-left overflow-x-hidden w-full max-w-full selection:bg-white/20 selection:text-white">
      {/* Subtle Studio Light Vignette (Clean Luxury) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Luxury Profile Container */}
      <div className="w-full max-w-md bg-[#08080A] border border-white/[0.1] rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 space-y-5 sm:space-y-6 shadow-[0_24px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative z-10 my-auto overflow-hidden">
        {/* Top Header Row: Brand, Verification & Quick Actions */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <BrandLogo size="sm" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/15 font-mono text-[9px] text-[#E2E0DC] uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[#E2E0DC]" /> VERIFIED
              </span>
            )}

            <button
              onClick={handleOpenQr}
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/30 text-white/80 hover:text-white flex items-center justify-center transition-colors btn-interactive"
              aria-label="View QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/30 text-white/80 hover:text-white flex items-center justify-center transition-colors btn-interactive"
              aria-label="Share Profile"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Profile Avatar & Identity */}
        <div className="flex flex-col items-center text-center space-y-3.5 pt-1">
          {/* Avatar with Crisp Luxury Chamfer Border */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/25 p-1 bg-[#0E0E12] shadow-xl overflow-hidden">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#121217] flex items-center justify-center text-[#E2E0DC] font-cinzel text-2xl sm:text-3xl font-light">
                  {profile.fullName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 w-full">
            <h1 className="font-cinzel text-xl sm:text-2xl md:text-[26px] font-medium text-white tracking-wide">
              {profile.fullName}
            </h1>
            <p className="font-sans text-xs sm:text-sm font-medium text-[#C8C6C0] tracking-wide">
              {profile.designation} {profile.company && <span className="text-[#8E8E98]">· {profile.company}</span>}
            </p>
            {profile.location && (
              <p className="font-mono text-[10px] text-[#6E6E7A] tracking-widest uppercase pt-0.5">
                {profile.location}
              </p>
            )}
          </div>

          {profile.bio && (
            <p className="font-sans text-xs text-[#9E9EA8] leading-relaxed max-w-sm px-2">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Primary Executive Actions: 1-Click Save Contact & Exchange Contact */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleSaveContact}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-white text-black font-sans font-semibold text-xs tracking-[0.16em] uppercase shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:bg-[#EAE8E4] active:bg-[#DCDAD4] flex items-center justify-center gap-2 btn-interactive"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-[#008800]" />
                <span>CONTACT SAVED (.VCF)</span>
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-4 h-4" />
                <span>SAVE CONTACT (.VCF)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setExchangeModalOpen(true)}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-[#E2E0DC] font-sans font-medium text-xs tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-colors btn-interactive"
          >
            <UserPlus className="w-4 h-4 text-[#A09E9A]" />
            <span>EXCHANGE CONTACT</span>
          </button>
        </div>

        {/* Direct Action Grid (Call, Email, WhatsApp) - 44px min touch targets for iOS */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              onClick={() => trackEvent("phone_click")}
              className="min-h-[58px] p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/30 flex flex-col items-center justify-center gap-1 transition-all group btn-interactive"
            >
              <Phone className="w-4 h-4 text-[#9E9EA8] group-hover:text-white transition-colors" />
              <span className="font-sans text-[10px] text-[#A0A0AA] font-medium uppercase tracking-wider">
                Call
              </span>
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              onClick={() => trackEvent("email_click")}
              className="min-h-[58px] p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/30 flex flex-col items-center justify-center gap-1 transition-all group btn-interactive"
            >
              <Mail className="w-4 h-4 text-[#9E9EA8] group-hover:text-white transition-colors" />
              <span className="font-sans text-[10px] text-[#A0A0AA] font-medium uppercase tracking-wider">
                Email
              </span>
            </a>
          )}
          {profile.phone && (
            <a
              href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click")}
              className="min-h-[58px] p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-[#25D366]/60 flex flex-col items-center justify-center gap-1 transition-all group btn-interactive"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              <span className="font-sans text-[10px] text-[#A0A0AA] group-hover:text-[#25D366] font-medium uppercase tracking-wider transition-colors">
                WhatsApp
              </span>
            </a>
          )}
        </div>

        {/* Connected Channels List */}
        {effectiveLinks && effectiveLinks.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="font-mono text-[9px] text-[#70707C] uppercase tracking-[0.22em] block font-semibold">
              CONNECTED CHANNELS
            </span>
            <div className="space-y-2">
              {effectiveLinks.map((link: any) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("link_click", link.id)}
                  className="w-full min-h-[48px] p-3 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/25 hover:bg-white/[0.04] flex items-center justify-between transition-all group btn-interactive"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-lg bg-black/50 border border-white/10 shrink-0">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <span className="font-sans text-xs text-[#E2E0DC] group-hover:text-white font-medium truncate transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#62626E] group-hover:text-white shrink-0 ml-2 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Hardware Meta Pill */}
        {profile.card && (
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-[#8E8E98]">
            <span className="flex items-center gap-1.5 text-[#C8C6C0]">
              <Radio className="w-3 h-3 text-[#E2E0DC]" /> NFC {profile.card.finish.toUpperCase()}
            </span>
            <span>{profile.card.nfcUid || "AUTHENTICATED HARDWARE"}</span>
          </div>
        )}
      </div>

      {/* Footer Branding & Acquisition CTA */}
      <div className="pt-6 pb-2 text-center space-y-3 relative z-10 safe-pb">
        <Link
          href="/order"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/35 text-xs font-sans text-white tracking-wider uppercase transition-all shadow-sm btn-interactive"
        >
          <span>COMMISSION YOUR METAL CARD</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#A09E9A]" />
        </Link>
        <div className="pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono text-[#8E8E98] hover:text-white tracking-[0.22em] uppercase transition-colors"
          >
            <span>NXC VERSE SOVEREIGN IDENTITY</span>
          </Link>
          <p className="font-sans text-[11px] text-[#62626E]">
            Tap metal card or scan QR to connect instantly.
          </p>
        </div>
      </div>

      {/* Exchange Contact Modal */}
      <Modal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        title={`Connect with ${profile.fullName}`}
        subtitle="Share your contact details directly to their private sovereign address book."
      >
        {exchangeSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="font-cinzel text-base font-medium text-white">
              Contact Sent Successfully
            </h3>
            <p className="font-sans text-xs text-[#9E9EA8]">
              {profile.fullName} has received your contact card in their private dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleExchangeSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={exchangeName}
                onChange={(e) => setExchangeName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={exchangePhone}
                  onChange={(e) => setExchangePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={exchangeEmail}
                  onChange={(e) => setExchangeEmail(e.target.value)}
                  placeholder="vikram@company.com"
                  className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={exchangeCompany}
                onChange={(e) => setExchangeCompany(e.target.value)}
                placeholder="Apex Capital"
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9E9EA8] uppercase tracking-wider mb-1">
                Private Note / Message
              </label>
              <textarea
                rows={2}
                value={exchangeNotes}
                onChange={(e) => setExchangeNotes(e.target.value)}
                placeholder="Great connecting with you..."
                className="w-full bg-[#0E0E14] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder:text-[#52525E] focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExchangeModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isExchanging}
                className="text-xs tracking-wider"
              >
                SEND CONTACT
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Sovereign QR Matrix"
        subtitle={`https://nxcverse.in/@${profile.username}`}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl border border-white/20">
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
            Scan with any smartphone camera to open {profile.fullName}&apos;s digital identity card.
          </p>
        </div>
      </Modal>
    </div>
  );
}
