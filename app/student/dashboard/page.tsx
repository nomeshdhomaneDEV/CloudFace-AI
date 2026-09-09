import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedStudent, getStudentAttendanceSummary } from "@/lib/student";
import {
  GraduationCap,
  Hash,
  BookOpen,
  Layers,
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  UserCheck,
  History,
  Camera,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const authData = await getAuthenticatedStudent();

  if (!authData) {
    redirect("/login?role=student");
  }

  const { profile, student } = authData;
  const attendance = await getStudentAttendanceSummary(student.id);

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient-cyan">{profile.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Academic ID: <strong className="text-white font-mono">{student.rollNumber}</strong> • Enrolled in{" "}
              <strong className="text-white">{student.class}</strong> (Section {student.division})
            </p>
          </div>

          {/* Current Face Enrollment Status */}
          <div className="flex-shrink-0 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col items-start lg:items-end gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Biometric Status</span>
            {student.faceEnrolled ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Face Enrollment: Enrolled</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Face Enrollment: Not Enrolled</span>
              </div>
            )}
            <span className="text-[11px] text-slate-500">Configured in Phase 6</span>
          </div>
        </div>
      </div>

      {/* Attendance Summary Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <CalendarCheck2 className="w-4 h-4 text-cyan-400" />
            <span>Attendance Summary</span>
          </h2>
          <Link
            href="/student/attendance"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>Full Overview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overall Attendance Rate */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Attendance Rate</span>
              <CalendarCheck2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                {attendance.totalSessions > 0 ? `${attendance.attendancePercentage}%` : "—"}
              </span>
              <span className="text-xs text-slate-500">
                ({attendance.presentCount}/{attendance.totalSessions} sessions)
              </span>
            </div>
            <div className="pt-1 text-[11px]">
              {attendance.totalSessions === 0 ? (
                <span className="text-slate-500">No sessions recorded yet</span>
              ) : attendance.meetsTarget ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Attendance meets the 75% target
                </span>
              ) : (
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Below the recommended 75% target
                </span>
              )}
            </div>
          </div>

          {/* Present Sessions */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Present Sessions</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              {attendance.presentCount}
            </span>
            <p className="text-[11px] text-slate-500">Verified on-time attendance</p>
          </div>

          {/* Late Sessions (Separated) */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Late Sessions</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
              {attendance.lateCount}
            </span>
            <p className="text-[11px] text-slate-500">Kept separate from present status</p>
          </div>

          {/* Absent Sessions */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Absent Sessions</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono">
              {attendance.absentCount}
            </span>
            <p className="text-[11px] text-slate-500">Missed classroom check-ins</p>
          </div>
        </div>
      </div>

      {/* Academic Credentials Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Roll Number</span>
            <span className="text-sm font-bold text-white font-mono">{student.rollNumber}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Class / Degree</span>
            <span className="text-sm font-semibold text-white">{student.class}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Division</span>
            <span className="text-sm font-semibold text-white">Section {student.division}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Quick Actions</span>
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/student/attendance"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-xs sm:text-sm text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck2 className="w-4 h-4 text-cyan-400" />
                <span>View Attendance Analytics</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/student/history"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-xs sm:text-sm text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-indigo-400" />
                <span>Attendance History Ledger</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/student/profile"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-xs sm:text-sm text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>View Academic Profile</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Recent Attendance Activity */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Recent Check-In Activity</span>
            </h3>
            <Link
              href="/student/history"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View All
            </Link>
          </div>

          {attendance.records.length === 0 ? (
            <div className="py-8 px-4 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 space-y-2">
              <Clock className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs sm:text-sm font-medium text-slate-300">
                No attendance records found
              </p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Classroom check-ins will automatically log attendance dates, verification status, and timestamps here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {attendance.records.slice(0, 3).map((record) => {
                const dateStr = new Date(record.attendanceDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const timeStr = new Date(record.checkInTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={record.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white block">{dateStr}</span>
                      <span className="text-slate-400 text-[11px]">{timeStr}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                        {record.verificationMethod}
                      </span>
                      {record.status === "PRESENT" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Present
                        </span>
                      ) : record.status === "LATE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/70 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Late
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/70 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3" /> Absent
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Phase 6 Notice */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Automated Face Recognition</span>
            </span>
            <span className="font-mono text-cyan-400/80">Scheduled for Phase 6</span>
          </div>
        </div>
      </div>
    </div>
  );
}
