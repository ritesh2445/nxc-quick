"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { downloadVCard } from "@/lib/vcf";
import { Phone, Mail, ArrowDownToLine, Check, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function LiveProfilePreview() {
  const [downloaded, setDownloaded] = useState(false);

  const profileData = {
    fullName: "Ritesh Martawar",
    designation: "Founder & Chief Executive",
    company: "NXC Verse",
    bio: "Building digital identity through technology, industrial metallurgy, and hyper-tactile metal hardware.",
    phone: "+91 95612 48677",
    email: "nxcbadge@gmail.com",
    website: "https://nxcverse.in",
    profileUrl: "https://nxcverse.in/@ritesh",
    avatarUrl: "/assets/avatar/ritesh.webp",
  };

  const handleSaveContact = () => {
    downloadVCard(profileData, "Ritesh_Martawar_NXC.vcf");
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#000000] border-t border-white/[0.08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Product Explanation */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2E0DC]" />
            <span className="font-mono text-[10px] text-[#C8C6C0] uppercase tracking-[0.22em] font-semibold">
              SOVEREIGN DIGITAL IDENTITY
            </span>
          </div>

          <h2 className="font-cinzel font-medium text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            One tap.
            <br />
            <span className="text-[#C8C6C0]">Your entire world unfolds.</span>
          </h2>
          <p className="font-sans text-xs md:text-sm text-[#9E9EA8] leading-relaxed max-w-lg">
            When someone taps your physical card or scans your laser-milled QR matrix, this is what they see. Zero clutter. No advertisements. Just pure, sovereign executive identity.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/15 text-[#E2E0DC] mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-semibold text-white uppercase tracking-wider">
                  Real 1-Click .VCF Contact Download
                </h4>
                <p className="font-sans text-xs text-[#9E9EA8]">
                  Imports name, phone, email, company, and profile links directly into Apple or Google Contacts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/15 text-[#E2E0DC] mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-semibold text-white uppercase tracking-wider">
                  Permanent Sovereign URL
                </h4>
                <p className="font-sans text-xs text-[#9E9EA8]">
                  Your <code className="font-mono text-white">nxcverse.in/@username</code> stays permanent even when you change company, phone number, or title.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link href="/@ritesh" target="_blank" className="btn-interactive">
              <Button variant="outline" size="md" className="rounded-full text-xs border-white/20 hover:border-white/40 text-white min-h-[44px]">
                VIEW FULL SCREEN DEMO
              </Button>
            </Link>

            <a
              href="https://wa.me/919561248677"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 text-white text-xs font-sans font-medium tracking-wider transition-all min-h-[44px] btn-interactive"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Right Column: Smartphone Chassis Frame (Optimized for iOS / Android look) */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="relative w-full max-w-[320px] sm:max-w-[340px] rounded-[36px] bg-[#0E0E12] border-[4px] sm:border-[5px] border-[#222228] p-3 sm:p-4 shadow-[0_24px_70px_rgba(0,0,0,0.95)] overflow-hidden">
            {/* Dynamic Island Speaker */}
            <div className="w-20 sm:w-24 h-3.5 bg-[#050508] rounded-full mx-auto mb-3 sm:mb-4 border border-white/10" />

            {/* Inner Screen */}
            <div className="rounded-[24px] bg-[#08080A] border border-white/[0.08] p-4 sm:p-5 space-y-4 text-center">
              {/* Brand Watermark */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#7E7E8E]">
                  NXC VERSE
                </span>
                <span className="font-mono text-[9px] text-[#C8C6C0] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/10">
                  VERIFIED
                </span>
              </div>

              {/* Avatar & Name */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full border border-white/20 overflow-hidden p-0.5 bg-[#141418]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.fullName}
                    loading="lazy"
                    decoding="async"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg sm:text-xl font-medium text-white">
                    {profileData.fullName}
                  </h3>
                  <p className="font-sans text-[11px] sm:text-xs text-[#9E9EA8] font-medium">
                    {profileData.designation}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="font-sans text-[11px] text-[#8E8E98] leading-relaxed text-center px-1">
                {profileData.bio}
              </p>

              {/* Primary 1-Click Save Contact CTA */}
              <button
                onClick={handleSaveContact}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {downloaded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#008800]" />
                    <span>SAVED (.VCF)</span>
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>SAVE CONTACT</span>
                  </>
                )}
              </button>

              {/* Action Icons Row */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${profileData.phone}`}
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/30 flex flex-col items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#9E9EA8]" />
                  <span className="font-sans text-[9px] text-[#7E7E8E]">Call</span>
                </a>
                <a
                  href={`mailto:${profileData.email}`}
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/30 flex flex-col items-center gap-1 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#9E9EA8]" />
                  <span className="font-sans text-[9px] text-[#7E7E8E]">Email</span>
                </a>
                <a
                  href={`https://wa.me/919561248677`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#25D366]/40 flex flex-col items-center gap-1 transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" color="#25D366" />
                  <span className="font-sans text-[9px] text-[#25D366]">WhatsApp</span>
                </a>
              </div>

              {/* Social Link Pills */}
              <div className="space-y-1.5 pt-1">
                <a
                  href="https://instagram.com/nxcverse.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs text-[#9E9EA8] hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-[#E1306C]" /> Instagram
                  </span>
                  <span className="font-mono text-[9px] text-[#62626E]">@nxcverse.in</span>
                </a>
                <a
                  href="https://wa.me/919561248677"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs text-[#9E9EA8] hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" color="#25D366" /> WhatsApp
                  </span>
                  <span className="font-mono text-[9px] text-[#62626E]">+91 9561248677</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
