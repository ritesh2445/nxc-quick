import React from "react";
import { notFound } from "next/navigation";
import { getProfileByUsername, recordAnalyticsEvent } from "@/lib/db/queries";
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
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const resolved = await params;
  const rawUsername = decodeURIComponent(resolved.username).replace(/^@/, "").toLowerCase().trim();
  const profile = await getProfileByUsername(rawUsername);

  if (!profile) {
    notFound();
  }

  // Non-blocking fire-and-forget server analytics recording
  recordAnalyticsEvent({
    profileId: profile.id,
    eventType: "view",
    referrer: "Direct/NFC",
  }).catch(() => {});

  return <DigitalProfileView profile={profile} />;
}
