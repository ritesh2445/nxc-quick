"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText,
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Mail,
  ExternalLink,
  Lock,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

export type PolicyTab = "terms" | "privacy" | "refund" | "shipping";

interface LegalViewProps {
  initialTab?: PolicyTab;
}

interface PolicyMeta {
  id: PolicyTab;
  label: string;
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  subtitle: string;
  complianceNotice: string;
  breadcrumbLabel: string;
}

const POLICY_DATA: Record<PolicyTab, PolicyMeta> = {
  terms: {
    id: "terms",
    label: "Terms & Conditions",
    badge: "CUSTOMER AGREEMENT",
    badgeIcon: FileText,
    title: "Terms & Conditions",
    subtitle:
      "Clear, honest guidelines governing product purchases, inclusive tax pricing, shipping timelines, and customer rights at NXC Verse.",
    complianceNotice: "Last Updated: September 2026 • Compliant with DPDP Act 2023 & IT Act 2000",
    breadcrumbLabel: "Terms & Conditions",
  },
  privacy: {
    id: "privacy",
    label: "Privacy Policy",
    badge: "DATA PROTECTION & PRIVACY",
    badgeIcon: ShieldCheck,
    title: "Privacy Policy",
    subtitle:
      "How your personal identity, contact links, and hardware telemetry are protected with sovereign encryption under the Indian DPDP Act 2023.",
    complianceNotice: "Last Updated: September 2026 • Compliant with DPDP Act 2023 & IT Act 2000",
    breadcrumbLabel: "Privacy Policy",
  },
  refund: {
    id: "refund",
    label: "Return & Refund Policy",
    badge: "SATISFACTION & REPLACEMENT GUARANTEE",
    badgeIcon: RotateCcw,
    title: "Return & Refund Policy",
    subtitle:
      "Our transparent replacement promise, zero-defect policy, transit damage protection, and hassle-free refunds for bespoke metal NFC cards.",
    complianceNotice: "Last Updated: September 2026 • Compliant with Consumer Protection Act 2019",
    breadcrumbLabel: "Return & Refund Policy",
  },
  shipping: {
    id: "shipping",
    label: "Shipping Policy",
    badge: "EXPRESS LOGISTICS & TRANSIT",
    badgeIcon: Truck,
    title: "Shipping & Delivery Policy",
    subtitle:
      "Complimentary express air delivery across India, international dispatch, real-time tracking, and executive tamper-evident packaging.",
    complianceNotice: "Last Updated: September 2026 • Compliant with Consumer Protection (E-Commerce) Rules",
    breadcrumbLabel: "Shipping & Delivery Policy",
  },
};

export function LegalView({ initialTab = "terms" }: LegalViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryTab = searchParams.get("tab") as PolicyTab | null;
  const [activeTab, setActiveTab] = useState<PolicyTab>(() => {
    if (queryTab && ["terms", "privacy", "refund", "shipping"].includes(queryTab)) {
      return queryTab;
    }
    return initialTab;
  });

  useEffect(() => {
    if (queryTab && ["terms", "privacy", "refund", "shipping"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (tab: PolicyTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const current = POLICY_DATA[activeTab];

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 sm:pt-28 pb-20 sm:pb-28 px-4 sm:px-6 md:px-12 relative overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/[0.03] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        {/* ========================================================================= */}
        {/* HEADER SECTION (Matching User's Reference Screenshot)                    */}
        {/* ========================================================================= */}
        <div className="text-center space-y-4 sm:space-y-5">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs font-mono text-[#8E8E98]">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <Link href="/legal" className="hover:text-white transition-colors">
              Legal
            </Link>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <span className="text-white/90 font-medium">{current.breadcrumbLabel}</span>
          </nav>

          {/* Badge Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase">
            <current.badgeIcon className="w-3.5 h-3.5" />
            <span>{current.badge}</span>
          </div>

          {/* Large Serif Title */}
          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white">
            {current.title}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#9E9EA8] max-w-2xl mx-auto leading-relaxed">
            {current.subtitle}
          </p>

          {/* Last Updated Compliance Pill Badge */}
          <div className="pt-1 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[10px] sm:text-xs tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{current.complianceNotice}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE POLICY TABS (Privacy Policy | Terms & Conditions | Refund...) */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => handleTabChange("privacy")}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-200 flex items-center gap-2 btn-interactive shadow-sm",
              activeTab === "privacy"
                ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-[#101015] text-[#9E9EA8] hover:text-white border border-white/10 hover:border-white/25 hover:bg-[#14141B]"
            )}
          >
            <ShieldCheck className={cn("w-4 h-4", activeTab === "privacy" ? "text-black" : "text-[#9E9EA8]")} />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("terms")}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-200 flex items-center gap-2 btn-interactive shadow-sm",
              activeTab === "terms"
                ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-[#101015] text-[#9E9EA8] hover:text-white border border-white/10 hover:border-white/25 hover:bg-[#14141B]"
            )}
          >
            <FileText className={cn("w-4 h-4", activeTab === "terms" ? "text-black" : "text-[#9E9EA8]")} />
            <span>Terms & Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("refund")}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-200 flex items-center gap-2 btn-interactive shadow-sm",
              activeTab === "refund"
                ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-[#101015] text-[#9E9EA8] hover:text-white border border-white/10 hover:border-white/25 hover:bg-[#14141B]"
            )}
          >
            <RotateCcw className={cn("w-4 h-4", activeTab === "refund" ? "text-black" : "text-[#9E9EA8]")} />
            <span>Return & Refund Policy</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("shipping")}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-200 flex items-center gap-2 btn-interactive shadow-sm",
              activeTab === "shipping"
                ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-[#101015] text-[#9E9EA8] hover:text-white border border-white/10 hover:border-white/25 hover:bg-[#14141B]"
            )}
          >
            <Truck className={cn("w-4 h-4", activeTab === "shipping" ? "text-black" : "text-[#9E9EA8]")} />
            <span>Shipping Policy</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* POLICY CONTENT BODY                                                       */}
        {/* ========================================================================= */}
        <div className="bg-[#0A0A0E] border border-white/10 rounded-[24px] p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl space-y-8">
          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <div className="space-y-8 text-sm sm:text-base text-[#C8C6C0] leading-relaxed">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">01</span>
                  <h2>Scope & Sovereign Agreement</h2>
                </div>
                <p>
                  Welcome to NXC Verse (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;NXC Verse&rdquo;). By accessing, browsing, or purchasing physical hardware or digital services from <span className="font-mono text-white">nxcverse.in</span>, you enter into a legally binding agreement governed by the laws of India.
                </p>
                <p>
                  If you are placing an order on behalf of a corporation or institutional entity, you confirm that you hold necessary authorization to bind said entity to these Terms.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">02</span>
                  <h2>Bespoke Metal Fabrication & Laser Customization</h2>
                </div>
                <p>
                  Each NXC Verse metal card is individually machined in solid cold-forged steel or composite core, integrated with high-density NTAG216 NFC circuitry, and personalized via fiber laser engraving.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#A0A0AA]">
                  <li>
                    <strong className="text-white">Customer Data Accuracy:</strong> You are solely responsible for ensuring the accuracy of your submitted full name, company, designation, custom inscription, and permanent digital slug. Once tooling is dispatched, changes cannot be made.
                  </li>
                  <li>
                    <strong className="text-white">Laser Typography & Metal Finish:</strong> Laser engraving colors represent natural high-contrast oxidized annealing on metal. Minor natural metallurgical variations are inherent to artisanal aerospace fabrication.
                  </li>
                  <li>
                    <strong className="text-white">Industrial Tolerances:</strong> All physical card dimensions conform strictly to ISO/IEC 7810 ID-1 standards (85.60 × 53.98 mm) with a precision CNC tolerance of ±0.05 mm.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">03</span>
                  <h2>Transparent Pricing, Taxes & Currencies</h2>
                </div>
                <p>
                  All prices listed on the Atelier page are transparent and inclusive of all applicable domestic Goods & Services Tax (GST) and air courier charges. There are zero hidden convenience charges, platform fees, or recurring mandatory subscription charges for basic profile hosting.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 font-mono text-xs text-[#B0B0C0]">
                  <div>• NXC Verse Classic: ₹999 / $12 (Inclusive of GST & Air Pack)</div>
                  <div>• NXC Verse Metal Edition: ₹1,599 / $20 (Inclusive of GST & Air Pack)</div>
                  <div>• NXC Verse Atelier Bespoke: ₹2,999 / $38 (Inclusive of GST & Air Pack)</div>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">04</span>
                  <h2>Sovereign Digital Identity & Lifetime Hosting</h2>
                </div>
                <p>
                  Every card acquisition grants permanent hosting for your digital contact identity at <span className="font-mono text-white">nxcverse.in/@username</span>. You retain 100% intellectual sovereignty over your uploaded bio, contact numbers, social links, and media portfolios.
                </p>
                <p>
                  You agree never to publish unlawful, defamatory, malicious, pornographic, or fraudulent content. NXC Verse reserves the right to immediately suspend public redirection for handles found in violation of Indian cyber laws without refund.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">05</span>
                  <h2>1-Year Craftsmanship & NFC Hardware Warranty</h2>
                </div>
                <p>
                  Your physical NXC Verse card includes a <strong className="text-white">1-Year Hardware Warranty</strong> covering embedded NTAG216 NFC antenna failure and structural delamination occurring under customary executive usage.
                </p>
                <p className="text-xs text-[#8E8E98]">
                  *Warranty excludes deliberate mechanical destruction, intentional extreme bending, chemical corrosion, or severe surface abrasions resulting from negligent handling.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">06</span>
                  <h2>Governing Law & Legal Jurisdiction</h2>
                </div>
                <p>
                  These Terms are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, arbitration, or claims arising out of your purchase shall be subject to the exclusive jurisdiction of the competent courts in Maharashtra, India.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-8 text-sm sm:text-base text-[#C8C6C0] leading-relaxed">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-emerald-400">01</span>
                  <h2>Our Privacy Philosophy: Sovereign & Non-Surveillance</h2>
                </div>
                <p>
                  At NXC Verse, your identity belongs exclusively to you. We strictly operate on a <strong className="text-white">zero-surveillance, non-ad-tracking philosophy</strong>. We do not sell, rent, or trade your personal data, customer contacts, or profile views to third-party ad brokers or data aggregators.
                </p>
                <p>
                  Our privacy infrastructure is structured in compliance with the <strong className="text-white">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong className="text-white">Information Technology Act, 2000</strong>.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-emerald-400">02</span>
                  <h2>Information We Collect & Process</h2>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-[#A0A0AA]">
                  <li>
                    <strong className="text-white">Order & Delivery Information:</strong> Full recipient name, delivery address, contact email, and WhatsApp number strictly required for shipping courier dispatch and delivery confirmations.
                  </li>
                  <li>
                    <strong className="text-white">Laser Customization Data:</strong> Full name, company, designation, and inscription text provided for physical card engraving.
                  </li>
                  <li>
                    <strong className="text-white">Digital Card Data:</strong> Public contact details, social links, vCard file, and bio information you choose to display on your public digital card (<span className="font-mono text-white">/@username</span>).
                  </li>
                  <li>
                    <strong className="text-white">Anonymous Telemetry:</strong> Count of NFC card taps, approximate country, and device operating system (iOS/Android). We never record invasive cross-site cookies, IP tracking, or fingerprinting.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-emerald-400">03</span>
                  <h2>Payment Data & Encryption Standards</h2>
                </div>
                <p>
                  All digital transactions are processed through certified Level-1 PCI-DSS compliant payment gateways (<strong className="text-white">Razorpay</strong> and <strong className="text-white">Stripe</strong>). NXC Verse never sees, processes, or stores your sensitive Credit/Debit card numbers, CVV codes, or UPI passwords.
                </p>
                <div className="p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-200/90 leading-relaxed">
                    <strong>256-Bit Bank-Grade Encryption:</strong> All communications between your browser, your NFC card, and our cloud servers are encrypted using TLS 1.3 cryptographic protocols with SHA-256 signatures.
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-emerald-400">04</span>
                  <h2>Your Sovereign Rights Under the DPDP Act 2023</h2>
                </div>
                <p>
                  As an Indian or international data principal, you have sovereign control over your identity:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#A0A0AA]">
                  <li>
                    <strong className="text-white">Right of Access & Modification:</strong> Edit your published digital profile, links, and contact card at any time via your authenticated Client Console.
                  </li>
                  <li>
                    <strong className="text-white">Right to Data Portability:</strong> Export your contact connections and analytics as a universal CSV file anytime.
                  </li>
                  <li>
                    <strong className="text-white">Right to Erasure (Right to be Forgotten):</strong> Request permanent deletion of your profile, digital card, and stored records by emailing our Grievance Officer. All records are irrevocably expunged within 48 hours.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-emerald-400">05</span>
                  <h2>Designated Grievance Officer Contact</h2>
                </div>
                <p>
                  In accordance with the Information Technology Act 2000 and DPDP Act 2023, you may contact our designated Grievance Officer directly:
                </p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 font-mono text-xs text-[#B0B0C0]">
                  <div>Grievance Officer: NXC Legal & Data Protection Cell</div>
                  <div>Email: <a href="mailto:nxcbadge@gmail.com" className="text-white underline">nxcbadge@gmail.com</a></div>
                  <div>Direct Concierge Desk: +91 9561248677</div>
                  <div>Operational Address: Maharashtra, India</div>
                  <div>Response Resolution Timeline: Within 48 business hours</div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: RETURN & REFUND POLICY */}
          {activeTab === "refund" && (
            <div className="space-y-8 text-sm sm:text-base text-[#C8C6C0] leading-relaxed">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">01</span>
                  <h2>Bespoke Personalization Notice</h2>
                </div>
                <p>
                  Because every NXC Verse card is individually machined and permanently laser-infilled with your custom name, designation, company, and cryptographic digital handle, <strong className="text-white">customized metal cards cannot be restocked or returned for change-of-mind once tooling and engraving have commenced</strong>.
                </p>
                <p>
                  However, we provide a <strong className="text-emerald-400">100% Zero-Risk Quality Guarantee</strong> as detailed below.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">02</span>
                  <h2>100% Free Replacement Guarantee (Defects & Transit Damage)</h2>
                </div>
                <p>
                  If your card arrives with any manufacturing defect, laser typographical error caused on our end, physical scratch sustained in transit, or an unresponsive NFC chip upon first scan, we will forge and dispatch a <strong className="text-white">100% complimentary replacement card via priority air express at zero cost to you</strong>.
                </p>
                <div className="p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-2">
                  <div className="font-sans font-semibold text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>How to Claim Free Replacement within 7 Days:</span>
                  </div>
                  <ol className="list-decimal pl-5 text-xs text-emerald-200/90 space-y-1">
                    <li>Inspect your card upon arrival from the tamper-evident luxury sleeve.</li>
                    <li>Send a brief photo or video showing the defect to WhatsApp (+91 9561248677) or email (nxcbadge@gmail.com).</li>
                    <li>Our team reviews and approves your replacement within 4 business hours.</li>
                    <li>A brand-new card is re-milled and shipped via express courier with instant tracking.</li>
                  </ol>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">03</span>
                  <h2>2-Hour Order Modification & Cancellation Window</h2>
                </div>
                <p>
                  You have a <strong className="text-white">2-hour window</strong> after placing your order on <span className="font-mono text-white">nxcverse.in/order</span> to modify engraving details, adjust spelling, or cancel your order for an immediate 100% full refund.
                </p>
                <p>
                  To request an emergency change or cancellation, message our 24/7 WhatsApp Concierge directly at <a href="https://wa.me/919561248677" target="_blank" rel="noopener noreferrer" className="font-mono text-[#25D366] hover:underline">+91 9561248677</a> with your Order ID.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">04</span>
                  <h2>Refund Processing Timeline</h2>
                </div>
                <p>
                  When a cancellation or refund is approved, the funds are automatically initiated through the original payment instrument (UPI, Credit/Debit Card, Net Banking).
                </p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 font-mono text-xs text-[#B0B0C0]">
                  <div>• UPI / IMPS Refunds: Processed within 24–48 hours</div>
                  <div>• Credit & Debit Cards: 5–7 business days (subject to issuing bank cycle)</div>
                  <div>• Net Banking: 3–5 business days</div>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">05</span>
                  <h2>Lost or Non-Delivered Shipments</h2>
                </div>
                <p>
                  In the rare event that our courier partner (Blue Dart / Delhivery / India Post) fails to deliver your package or officially declares the parcel lost, we will immediately offer you your choice of an <strong className="text-white">expedited complimentary re-manufacture</strong> or an <strong className="text-white">immediate 100% refund</strong>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: SHIPPING & DELIVERY POLICY */}
          {activeTab === "shipping" && (
            <div className="space-y-8 text-sm sm:text-base text-[#C8C6C0] leading-relaxed">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">01</span>
                  <h2>Complimentary Express Domestic Delivery</h2>
                </div>
                <p>
                  All NXC Verse card orders shipped across India include <strong className="text-white">100% complimentary air express shipping</strong>. We partner with tier-1 logistics networks including Blue Dart, Delhivery, and India Post Speed Post to guarantee safe, swift transit.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">02</span>
                  <h2>Forging & Dispatch Schedules</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[#8E8E98] uppercase block mb-1">CNC Milling & Engraving</span>
                    <span className="text-white font-semibold text-sm">1 – 2 Business Days</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[#8E8E98] uppercase block mb-1">Air Express Courier Transit</span>
                    <span className="text-white font-semibold text-sm">2 – 4 Business Days</span>
                  </div>
                </div>
                <p className="text-xs text-[#8E8E98]">
                  *Metropolitan destinations (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) typically receive delivery within 48 hours of courier dispatch.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">03</span>
                  <h2>Executive Protective Packaging</h2>
                </div>
                <p>
                  Every bespoke metal card is packaged within an anti-static NFC RFID-shielded protective sleeve, seated inside an executive matte black slide-box with magnetic closure, and shipped in tamper-proof reinforced outer mailers.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-white font-cinzel text-lg sm:text-xl font-semibold">
                  <span className="font-mono text-xs text-amber-400">04</span>
                  <h2>Live Tracking & Delivery Updates</h2>
                </div>
                <p>
                  As soon as your metal card finishes laser engraving and quality inspection, you will receive an automated dispatch notification via WhatsApp and Email containing your unique AWB Tracking Number and live tracking portal link.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DIRECT LEGAL & CONCIERGE HELP DESK BOX                                    */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-[20px] bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-cinzel text-base sm:text-lg text-white font-medium">
              Have questions regarding our policies or your order?
            </h3>
            <p className="font-sans text-xs text-[#9E9EA8] max-w-md leading-relaxed">
              Our direct executive concierge desk is available 7 days a week for immediate resolution of shipping, engraving, and warranty inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919561248677"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-mono tracking-wider uppercase flex items-center gap-2 transition-all btn-interactive shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
              <span>WhatsApp Concierge</span>
            </a>

            <a
              href="mailto:nxcbadge@gmail.com"
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono tracking-wider uppercase flex items-center gap-2 transition-all btn-interactive"
            >
              <Mail className="w-4 h-4 text-[#E2E0DC]" />
              <span>Email Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
