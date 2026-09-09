import { NextResponse } from "next/server";
import { getAuthenticatedStudent } from "@/lib/student";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/student/enroll
 * Returns enrollment status for the authenticated student.
 * Never exposes the raw biometric embedding string.
 */
export async function GET() {
  try {
    const authData = await getAuthenticatedStudent();

    if (!authData) {
      return NextResponse.json(
        { error: "Unauthorized: Student session required." },
        { status: 401 }
      );
    }

    const studentWithBiometric = await prisma.student.findUnique({
      where: { id: authData.student.id },
      select: {
        faceEnrolled: true,
        faceEmbedding: {
          select: {
            updatedAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      faceEnrolled: studentWithBiometric?.faceEnrolled ?? false,
      enrolledAt: studentWithBiometric?.faceEmbedding?.updatedAt ?? null,
    });
  } catch (error) {
    console.error("GET /api/student/enroll error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve face enrollment status." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/student/enroll
 * Enrolls or updates the student's 128-dimensional face embedding vector.
 * Identity is derived strictly server-side from the verified Supabase Auth session.
 */
export async function POST(request: Request) {
  try {
    const authData = await getAuthenticatedStudent();

    if (!authData) {
      return NextResponse.json(
        { error: "Unauthorized: Student session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { descriptor } = body;

    // Validate descriptor format and length
    if (!Array.isArray(descriptor) || descriptor.length !== 128) {
      return NextResponse.json(
        { error: "Invalid face descriptor: exactly 128 floating-point values required." },
        { status: 400 }
      );
    }

    // Mathematical validation: ResNet-34 face descriptors are L2-normalized unit vectors
    // (sum of squares = 1.0). Consequently, each individual coordinate is strictly bounded within [-1.0, 1.0].
    const isValidFloats = descriptor.every(
      (val) =>
        typeof val === "number" &&
        !Number.isNaN(val) &&
        Number.isFinite(val) &&
        val >= -1.0 &&
        val <= 1.0
    );

    if (!isValidFloats) {
      return NextResponse.json(
        { error: "Invalid face descriptor: elements must be finite numbers within [-1.0, 1.0]." },
        { status: 400 }
      );
    }

    const serializedEmbedding = JSON.stringify(descriptor);

    // Atomically upsert FaceEmbedding and update Student.faceEnrolled
    const result = await prisma.$transaction(async (tx) => {
      const embeddingRecord = await tx.faceEmbedding.upsert({
        where: { studentId: authData.student.id },
        create: {
          studentId: authData.student.id,
          embedding: serializedEmbedding,
        },
        update: {
          embedding: serializedEmbedding,
        },
      });

      await tx.student.update({
        where: { id: authData.student.id },
        data: {
          faceEnrolled: true,
        },
      });

      return embeddingRecord;
    });

    return NextResponse.json({
      success: true,
      message: "Face enrolled successfully.",
      enrolledAt: result.updatedAt,
    });
  } catch (error) {
    console.error("POST /api/student/enroll error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during face enrollment." },
      { status: 500 }
    );
  }
}
