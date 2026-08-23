import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db/queries";
import { verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email address or password" }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email address or password" }, { status: 401 });
    }

    const profile = db.select().from(profiles).where(eq(profiles.userId, user.id)).get();

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
      profile: profile ? {
        id: profile.id,
        username: profile.username,
        fullName: profile.fullName,
        designation: profile.designation,
        company: profile.company,
        avatarUrl: profile.avatarUrl,
      } : null,
    });
  } catch (error) {
    console.error("[Auth API Login Error]:", error);
    return NextResponse.json({ error: "Internal server error during authentication" }, { status: 500 });
  }
}
