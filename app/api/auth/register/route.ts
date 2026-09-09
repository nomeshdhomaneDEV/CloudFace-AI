import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, rollNumber, class: studentClass, division, email, password } = body;

    // 1. Validation
    if (!fullName || !rollNumber || !studentClass || !division || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRollNumber = rollNumber.toUpperCase().trim();

    // 2. Check for duplicate roll number in Prisma
    const existingStudent = await prisma.student.findUnique({
      where: { rollNumber: normalizedRollNumber },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: `Roll number '${normalizedRollNumber}' is already registered.` },
        { status: 400 }
      );
    }

    // 3. Check for existing profile by email in Prisma
    const existingProfile = await prisma.profile.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    // 4. Register user in Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: "STUDENT",
          roll_number: normalizedRollNumber,
        },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create authentication account." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 5. Create Profile and Student atomically in PostgreSQL via Prisma
    try {
      await prisma.$transaction(async (tx) => {
        const profile = await tx.profile.create({
          data: {
            id: userId,
            email: normalizedEmail,
            fullName: fullName.trim(),
            role: "STUDENT",
          },
        });

        const student = await tx.student.create({
          data: {
            profileId: profile.id,
            rollNumber: normalizedRollNumber,
            class: studentClass.trim(),
            division: division.trim().toUpperCase(),
            faceEnrolled: false,
          },
        });

        return { profile, student };
      });
    } catch (dbError) {
      console.error("Database transaction error during registration:", dbError);

      // Safe cleanup: If database creation fails, attempt to delete the newly created Supabase Auth user
      // so the student is not left in an orphaned state preventing re-registration.
      const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
          const { createClient: createAdminClient } = await import("@supabase/supabase-js");
          const adminSupabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
          );
          await adminSupabase.auth.admin.deleteUser(userId);
          console.log(`Cleaned up orphaned Supabase Auth user ${userId} after database failure.`);
        } catch (cleanupErr) {
          console.error("Failed to clean up orphaned Supabase Auth user:", cleanupErr);
        }
      }

      return NextResponse.json(
        { error: "Failed to create student database record. Please try registering again or contact administration." },
        { status: 500 }
      );
    }

    const requiresEmailConfirmation = !authData.session;

    return NextResponse.json(
      {
        success: true,
        message: requiresEmailConfirmation
          ? "Registration initiated! Please check your email to verify your account."
          : "Registration successful! Welcome to CloudFace AI.",
        requiresEmailConfirmation,
        user: {
          id: userId,
          email: normalizedEmail,
          fullName: fullName.trim(),
          role: "STUDENT",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
