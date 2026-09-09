import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Attendance, Profile, Student } from "@prisma/client";

export type AuthenticatedStudentData = {
  profile: Profile;
  student: Student;
};

export type AttendanceSummary = {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
  meetsTarget: boolean;
  records: Attendance[];
};

/**
 * Server-side helper to retrieve the verified student profile.
 * Strictly verifies identity through Supabase Auth and Prisma.
 * Never accepts or trusts client-provided student IDs.
 */
export async function getAuthenticatedStudent(): Promise<AuthenticatedStudentData | null> {
  const authData = await getCurrentProfile();
  if (!authData || authData.profile.role !== "STUDENT" || !authData.profile.student) {
    return null;
  }

  return {
    profile: authData.profile,
    student: authData.profile.student,
  };
}

/**
 * Retrieves attendance summary and records for a student.
 * Attendance Percentage = (Present Sessions / Total Attendance Sessions) * 100.
 * LATE is kept strictly separate from PRESENT.
 */
export async function getStudentAttendanceSummary(studentId: string): Promise<AttendanceSummary> {
  const records = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { attendanceDate: "desc" },
  });

  const totalSessions = records.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  for (const record of records) {
    if (record.status === "PRESENT") {
      presentCount++;
    } else if (record.status === "ABSENT") {
      absentCount++;
    } else if (record.status === "LATE") {
      lateCount++;
    }
  }

  const attendancePercentage =
    totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  const meetsTarget = attendancePercentage >= 75;

  return {
    totalSessions,
    presentCount,
    absentCount,
    lateCount,
    attendancePercentage,
    meetsTarget,
    records,
  };
}
