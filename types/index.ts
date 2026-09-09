export type UserRole = "STUDENT" | "ADMIN";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type VerificationMethod = "FACE";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentRecord {
  id: string;
  profileId: string;
  rollNumber: string;
  class: string;
  division: string;
  faceEnrolled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaceEmbeddingRecord {
  id: string;
  studentId: string;
  embedding: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  attendanceDate: Date;
  checkInTime: Date;
  status: AttendanceStatus;
  verificationMethod: VerificationMethod;
  createdAt: Date;
}

export interface AdminActivityLogRecord {
  id: string;
  adminId: string;
  action: string;
  description: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
}
