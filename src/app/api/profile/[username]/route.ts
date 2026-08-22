import { NextRequest, NextResponse } from "next/server";
import { getProfileByUsername, updateProfile, updateProfileLinks } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const resolved = await params;
  const username = decodeURIComponent(resolved.username).replace(/^@/, "").toLowerCase().trim();
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const resolved = await params;
    const username = decodeURIComponent(resolved.username).replace(/^@/, "").toLowerCase().trim();
    const existing = await getProfileByUsername(username);

    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await req.json();

    // Update profile core attributes
    await updateProfile(existing.id, {
      fullName: body.fullName,
      designation: body.designation,
      company: body.company,
      bio: body.bio,
      phone: body.phone,
      email: body.email,
      website: body.website,
      location: body.location,
      avatarUrl: body.avatarUrl,
    });

    // Update links if provided
    if (Array.isArray(body.links)) {
      await updateProfileLinks(existing.id, body.links);
    }

    const updated = await getProfileByUsername(username);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update profile:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
