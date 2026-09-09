import { NextResponse } from "next/server";
import { getAuthenticatedStudent } from "@/lib/student";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const authData = await getAuthenticatedStudent();

    if (!authData) {
      return NextResponse.json(
        { error: "Unauthorized: Student session required." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: authData.profile,
      student: authData.student,
    });
  } catch (error) {
    console.error("Student profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve student profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authData = await getAuthenticatedStudent();

    if (!authData) {
      return NextResponse.json(
        { error: "Unauthorized: Student session required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Security: Only permit explicitly editable fields (fullName only)
    // Reject or ignore attempts to modify rollNumber, class, division, role, studentId, etc.
    const { fullName } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name must be a valid string of at least 2 characters." },
        { status: 400 }
      );
    }

    if (fullName.trim().length > 100) {
      return NextResponse.json(
        { error: "Full name cannot exceed 100 characters." },
        { status: 400 }
      );
    }

    const trimmedName = fullName.trim();

    // 1. Update in PostgreSQL via Prisma
    const updatedProfile = await prisma.profile.update({
      where: { id: authData.profile.id },
      data: { fullName: trimmedName },
      include: { student: true },
    });

    // 2. Update Supabase Auth user metadata
    try {
      const supabase = await createClient();
      await supabase.auth.updateUser({
        data: { full_name: trimmedName },
      });
    } catch (authMetaErr) {
      console.warn("Could not update Supabase Auth user metadata:", authMetaErr);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Student profile PATCH error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating profile." },
      { status: 500 }
    );
  }
}
