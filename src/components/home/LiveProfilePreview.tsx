"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { downloadVCard } from "@/lib/vcf";
import { Phone, Mail, Globe, ArrowDownToLine, Check, Share2, ShieldCheck, Linkedin, Instagram, MessageCircle } from "lucide-react";

export function LiveProfilePreview() {
  const [downloaded, setDownloaded] = useState(false);

  const profileData = {
    fullName: "Ritesh Martawar",
    designation: "Founder & Chief Executive",
    company: "NXC Verse",
    bio: "Building digital identity through technology, industrial design, and hyper-tactile metal hardware.",
    phone: "+91 95612 48677",
    email: "nxcbadge@gmail.com",
    website: "https://nxcverse.in",
    profileUrl: "https://nxcverse.in/@ritesh",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  };

  const handleSaveContact = () => {
    downloadVCard(profileData, "Ritesh_Martawar_NXC.vcf");
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section className="w-full py-28 px-6 bg-[#0A0A0B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Product Explanation */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.25em]">
            THE DIGITAL IDENTITY
          </span>
          <h2 className="font-sans font-medium text-3xl md:text-5xl text-[#F2F0EC] tracking-tight">
            One tap.
            <br />
            <span className="font-display italic text-[#E2E0DC]">Your entire world unfolds.</span>
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed max-w-lg">
            When someone taps your physical card or scans your precision-engraved QR code, this is what they see. No clutter. No advertisements. Just pure, sovereign professional identity.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-[#18181C] border border-[#2A2A32] text-accent-silver mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Real 1-Click .VCF Contact Download
                </h4>
                <p className="font-sans text-xs text-text-secondary">
                  Imports name, phone, email, notes, and profile links directly into Apple or Google Contacts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-[#18181C] border border-[#2A2A32] text-accent-silver mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Permanent Sovereign URL
                </h4>
                <p className="font-sans text-xs text-text-secondary">
                  Your <code className="font-mono text-accent-silver">nxcverse.in/@username</code> stays identical even when you change company, phone, or title.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link href="/@ritesh" target="_blank">
              <Button variant="outline" size="md">
                VIEW FULL SCREEN DEMO
              </Button>
            </Link>

            <a
              href="https://wa.me/919561248677"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#18181C] border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] text-xs font-mono tracking-wider transition-all hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Right Column: Realistic Smartphone Chassis Frame */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-[320px] md:w-[350px] rounded-[36px] bg-[#141418] border-[6px] border-[#2A2A32] p-4 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)]">
            {/* Dynamic Island / Top Bezel Speaker */}
            <div className="w-24 h-4 bg-[#0A0A0B] rounded-full mx-auto mb-4 border border-white/5" />

            {/* Inner Phone Screen */}
            <div className="rounded-[24px] bg-[#0A0A0B] border border-[#222228] p-5 space-y-5 text-center text-left">
              {/* Brand Watermark */}
              <div className="flex items-center justify-between pb-2 border-b border-[#18181C]">
                <span className="font-sans font-semibold text-[10px] tracking-[0.2em] text-text-tertiary">
                  NXC VERSE
                </span>
                <span className="font-mono text-[9px] text-accent-silver bg-[#18181C] px-2 py-0.5 rounded-[2px] border border-[#2A2A32]">
                  VERIFIED
                </span>
              </div>

              {/* Avatar & Name */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative w-20 h-20 rounded-full border-2 border-[#2A2A32] overflow-hidden p-0.5 bg-[#18181C]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-light text-[#F2F0EC]">
                    {profileData.fullName}
                  </h3>
                  <p className="font-sans text-xs text-text-secondary font-medium">
                    {profileData.designation}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="font-sans text-[11px] text-text-secondary leading-relaxed text-center px-1">
                {profileData.bio}
              </p>

              {/* Primary 1-Click Save Contact CTA */}
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveContact}
                className="w-full justify-center h-10 text-xs tracking-wider"
              >
                {downloaded ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-status-success" /> CONTACT SAVED (.VCF)
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="w-3.5 h-3.5 mr-1" /> SAVE CONTACT
                  </>
                )}
              </Button>

              {/* Action Icons Row */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${profileData.phone}`}
                  className="p-2 rounded-[2px] bg-[#111114] border border-[#2A2A32] hover:border-[#3A3A45] flex flex-col items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="font-sans text-[9px] text-text-tertiary">Call</span>
                </a>
                <a
                  href={`mailto:${profileData.email}`}
                  className="p-2 rounded-[2px] bg-[#111114] border border-[#2A2A32] hover:border-[#3A3A45] flex flex-col items-center gap-1 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="font-sans text-[9px] text-text-tertiary">Email</span>
                </a>
                <a
                  href={`https://wa.me/919561248677`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-[2px] bg-[#111114] border border-[#25D366]/40 hover:border-[#25D366] flex flex-col items-center gap-1 transition-colors text-[#25D366]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="font-sans text-[9px]">WhatsApp</span>
                </a>
              </div>

              {/* Social Link Pills */}
              <div className="space-y-1.5 pt-1">
                <a
                  href="https://instagram.com/nxcverse.in"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-3 py-2 rounded-[2px] bg-[#111114] border border-[#2A2A32] flex items-center justify-between text-xs text-text-secondary hover:text-white hover:border-[#E1306C]/60 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-[#E1306C]" /> Instagram
                  </span>
                  <span className="font-mono text-[9px] text-text-tertiary">@nxcverse.in</span>
                </a>
                <a
                  href="https://wa.me/919561248677"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-3 py-2 rounded-[2px] bg-[#111114] border border-[#2A2A32] flex items-center justify-between text-xs text-text-secondary hover:text-white hover:border-[#25D366]/60 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp
                  </span>
                  <span className="font-mono text-[9px] text-text-tertiary">+91 9561248677</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
