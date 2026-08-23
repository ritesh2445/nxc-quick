import React from "react";
import { notFound, redirect } from "next/navigation";
import { getProfileByUsername, recordAnalyticsEvent, getProfileLinks } from "@/lib/db/queries";
import { DigitalProfileView } from "@/components/profile/DigitalProfileView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const rawUsername = decodeURIComponent(resolved.username).replace(/^@/, "").toLowerCase().trim();
  const profile = await getProfileByUsername(rawUsername);

  if (!profile) {
    return {
      title: "Profile Not Found — NXC Verse",
    };
  }

  return {
    title: `${profile.fullName} — NXC Verse Digital Identity`,
    description: profile.bio || `${profile.fullName} (${profile.designation}) on NXC Verse.`,
    openGraph: {
      title: `${profile.fullName} · NXC Verse`,
      description: profile.bio || `${profile.designation} at ${profile.company || "NXC Verse"}`,
      url: `https://nxcverse.in/@${profile.username}`,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.fullName} — Sovereign Identity`,
      description: profile.bio || `${profile.designation} at ${profile.company || "NXC Verse"}`,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const resolved = await params;
  const rawUsername = decodeURIComponent(resolved.username).replace(/^@/, "").toLowerCase().trim();
  const profile = await getProfileByUsername(rawUsername);

  if (!profile) {
    notFound();
  }

  // 1. VIP Direct Mode: If enabled, immediately trigger direct vCard download
  if (profile.vipDirectMode) {
    recordAnalyticsEvent({
      profileId: profile.id,
      eventType: "vcf_download",
      referrer: "VIP Direct Mode Tap",
    }).catch(() => {});

    redirect(`/api/profile/${profile.username}/vcf`);
  }

  // 2. Normal View: Record view event and fetch live links
  recordAnalyticsEvent({
    profileId: profile.id,
    eventType: "view",
    referrer: "Direct/NFC",
  }).catch(() => {});

  const links = await getProfileLinks(profile.id);

  return <DigitalProfileView profile={profile} initialLinks={links} />;
}
