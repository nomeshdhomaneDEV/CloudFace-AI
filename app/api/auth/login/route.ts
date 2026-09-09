import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, expectedRole } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // Authenticate via Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Invalid email or password." },
        { status: 401 }
      );
    }

    // Retrieve database profile from PostgreSQL via Prisma
    const profile = await prisma.profile.findUnique({
      where: { id: authData.user.id },
      include: {
        student: true,
      },
    });

    if (!profile) {
      // Invalidate session if database profile doesn't exist
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "User profile record not found in system database." },
        { status: 404 }
      );
    }

    // Role-Based Access Control Verification
    if (expectedRole && profile.role !== expectedRole) {
      // Mismatch: sign out immediately to prevent session hijacking
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error: `Access Denied: This account is registered as ${profile.role}, not ${expectedRole}. Please use the ${profile.role.toLowerCase()} portal.`,
        },
        { status: 403 }
      );
    }

    const targetDashboard =
      profile.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
        student: profile.student,
      },
      redirectTo: targetDashboard,
    });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred during authentication." },
      { status: 500 }
    );
  }
}
