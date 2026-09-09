/**
 * Core type definitions for CloudFace AI
 * Cloud-Based Smart Face Recognition Attendance Management System
 */

export type UserRole = "STUDENT" | "ADMIN";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

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

export interface AttendanceRecord {
  id: string;
  studentId: string;
  attendanceDate: Date;
  checkInTime: Date;
  status: AttendanceStatus;
  createdAt: Date;
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
}
