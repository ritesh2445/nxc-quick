import React from "react";
import { notFound, redirect } from "next/navigation";
import { resolveProfileByDomain } from "@/lib/domains";
import { getProfileLinks, recordAnalyticsEvent } from "@/lib/db/queries";
import { DigitalProfileView } from "@/components/profile/DigitalProfileView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const profile = await resolveProfileByDomain(resolved.domain);

  if (!profile) {
    return {
      title: "Domain Not Found — NXC Verse",
    };
  }

  return {
    title: `${profile.fullName} — ${profile.designation}`,
    description: profile.bio || `${profile.fullName} on NXC Verse Sovereign Network`,
    openGraph: {
      title: `${profile.fullName} · ${profile.company || "NXC Verse"}`,
      description: profile.bio || `${profile.designation}`,
      url: `https://${resolved.domain}`,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
    },
  };
}

export default async function CustomDomainProfilePage({ params }: Props) {
  const resolved = await params;
  const profile = await resolveProfileByDomain(resolved.domain);

  if (!profile) {
    notFound();
  }

  // 1. VIP Direct Mode Check
  if (profile.vipDirectMode) {
    redirect(`/api/profile/${profile.username}/vcf`);
  }

  // 2. Telemetry
  recordAnalyticsEvent({
    profileId: profile.id,
    eventType: "view",
    referrer: `Custom Domain: ${resolved.domain}`,
  }).catch(() => {});

  const links = await getProfileLinks(profile.id);

  return <DigitalProfileView profile={profile} initialLinks={links} />;
}
