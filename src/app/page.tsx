import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { MetricsBar } from "@/components/home/MetricsBar";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MaterialShowcase } from "@/components/home/MaterialShowcase";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LiveProfilePreview } from "@/components/home/LiveProfilePreview";
import { PricingSection } from "@/components/home/PricingSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section with Cinematic Hero Image, Parallax & Non-overlapping Typography */}
      <HeroSection />

      {/* 2. Global Metric Trust Highlights */}
      <MetricsBar />

      {/* 3. Detailed Hardware Engineering & Sovereign Features Suite */}
      <FeaturesSection />

      {/* 4. Material & Dual-Sided Card Hardware Finishes Showcase */}
      <MaterialShowcase />

      {/* 5. How It Works (Three Steps to Limitless Connections) */}
      <HowItWorks />

      {/* 6. Live Digital Profile Smartphone Interactive Showcase */}
      <LiveProfilePreview />

      {/* 7. Product Selection / Acquisition Tiers */}
      <PricingSection />

      {/* 8. Final Deep Black Closing CTA */}
      <FinalCta />
    </div>
  );
}
