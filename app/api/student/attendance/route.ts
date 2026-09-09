import { NextResponse } from "next/server";
import { getAuthenticatedStudent, getStudentAttendanceSummary } from "@/lib/student";

export async function GET() {
  try {
    // Strictly verify student identity from authenticated Supabase session
    const authData = await getAuthenticatedStudent();

    if (!authData) {
      return NextResponse.json(
        { error: "Unauthorized: Student session required." },
        { status: 401 }
      );
    }

    // Query attendance records for the verified student identity only
    const attendance = await getStudentAttendanceSummary(authData.student.id);

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Student attendance API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve student attendance records." },
      { status: 500 }
    );
  }
}
