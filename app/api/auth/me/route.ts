import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";

export async function GET() {
  try {
    const authData = await getCurrentProfile();

    if (!authData) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: authData.id,
        email: authData.email,
        fullName: authData.profile.fullName,
        role: authData.profile.role,
        student: authData.profile.student,
      },
    });
  } catch (error) {
    console.error("Session me route error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve current user session." },
      { status: 500 }
    );
  }
}
