import { NextResponse } from "next/server";
import { getUserByEmail, createUserWithProfile, getProfileByUsername } from "@/lib/db/queries";
import { hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, username, designation, company, phone } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Full Name, email and password are required" }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email address already exists" }, { status: 400 });
    }

    // Sanitize username or generate fallback from name
    let desiredUsername = (username || fullName.toLowerCase().replace(/\s+/g, "_")).toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
    if (!desiredUsername || desiredUsername.length < 3) {
      desiredUsername = `user_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const existingProfile = await getProfileByUsername(desiredUsername);
    if (existingProfile) {
      desiredUsername = `${desiredUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const passwordHash = hashPassword(password);

    const { user, profile } = await createUserWithProfile({
      email,
      passwordHash,
      fullName,
      username: desiredUsername,
      designation,
      company,
      phone,
    });

    const token = createSessionToken(user.id);
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profile: {
        id: profile.id,
        username: profile.username,
        fullName: profile.fullName,
        designation: profile.designation,
        company: profile.company,
        avatarUrl: profile.avatarUrl,
      },
    });
  } catch (error) {
    console.error("[Auth API Register Error]:", error);
    return NextResponse.json({ error: "Failed to create account. Please check your inputs." }, { status: 500 });
  }
}
