import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedStudent, getStudentAttendanceSummary } from "@/lib/student";
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentAttendancePage() {
  const authData = await getAuthenticatedStudent();

  if (!authData) {
    redirect("/login?role=student");
  }

  const { student } = authData;
  const attendance = await getStudentAttendanceSummary(student.id);

  // Status breakdown percentages
  const presentPct =
    attendance.totalSessions > 0
      ? Math.round((attendance.presentCount / attendance.totalSessions) * 100)
      : 0;
  const latePct =
    attendance.totalSessions > 0
      ? Math.round((attendance.lateCount / attendance.totalSessions) * 100)
      : 0;
  const absentPct =
    attendance.totalSessions > 0
      ? Math.round((attendance.absentCount / attendance.totalSessions) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck2 className="w-6 h-6 text-cyan-400" />
            <span>Attendance Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your semester attendance records against the 75% target
          </p>
        </div>

        <Link
          href="/student/history"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-slate-200 transition-colors w-fit"
        >
          <span>View Detailed Ledger</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </Link>
      </div>

      {/* Target Status Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
              Attendance Performance
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                {attendance.totalSessions > 0 ? `${attendance.attendancePercentage}%` : "0%"}
              </span>
              <span className="text-xs sm:text-sm text-slate-400">
                Overall Attendance Rate
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Calculated as: <strong className="text-slate-300 font-mono">(Present Sessions / Total Sessions) × 100</strong>.
              Late arrivals are kept separate from present status.
            </p>
          </div>

          {/* Target Assessment Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 min-w-[280px]">
            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
              Project Target: 75% Attendance
            </span>

            {attendance.totalSessions === 0 ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>No attendance sessions recorded yet</span>
              </div>
            ) : attendance.meetsTarget ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Attendance meets the 75% target</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Good standing on project tracking target.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Below the recommended 75% attendance target</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Monitor your upcoming sessions to reach the 75% threshold.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full rounded-full bg-slate-900 border border-white/10 overflow-hidden flex">
            <div
              style={{ width: `${presentPct}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Present: ${presentPct}%`}
            />
            <div
              style={{ width: `${latePct}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Late: ${latePct}%`}
            />
            <div
              style={{ width: `${absentPct}%` }}
              className="bg-rose-500 h-full transition-all duration-500"
              title={`Absent: ${absentPct}%`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Present ({presentPct}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Late ({latePct}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Absent ({absentPct}%)</span>
              </span>
            </div>
            <span className="font-mono text-slate-500 text-[11px]">
              Total Sessions: {attendance.totalSessions}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Present Count</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-bold text-emerald-400 font-mono">
            {attendance.presentCount}
          </span>
          <p className="text-[11px] text-slate-500">
            Sessions verified on-time
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Late Count</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-bold text-amber-400 font-mono">
            {attendance.lateCount}
          </span>
          <p className="text-[11px] text-slate-500">
            Sessions verified after session start
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-rose-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Absent Count</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-bold text-rose-400 font-mono">
            {attendance.absentCount}
          </span>
          <p className="text-[11px] text-slate-500">
            Missed attendance check-in sessions
          </p>
        </div>
      </div>

      {/* Attendance Policy & Guidelines */}
      <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3 text-xs sm:text-sm text-slate-300">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Attendance Policy & Calculation Standards</span>
        </h3>
        <ul className="space-y-2 text-slate-400 text-xs list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-slate-300">Attendance Calculation:</strong> Percentage is calculated solely on confirmed present sessions: <code className="text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded font-mono">(Present / Total) * 100</code>.
          </li>
          <li>
            <strong className="text-slate-300">Late Status Separation:</strong> Late check-ins are recorded as distinct events and are not automatically merged into present sessions.
          </li>
          <li>
            <strong className="text-slate-300">One Check-in Per Day:</strong> The database enforces uniqueness by student and calendar date to prevent duplicate attendance logs.
          </li>
          <li>
            <strong className="text-slate-300">75% Project Target:</strong> The 75% value serves as a project tracking indicator, not an official institutional eligibility decision.
          </li>
        </ul>
      </div>

      {/* Empty State when no attendance records */}
      {attendance.totalSessions === 0 && (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Attendance Recorded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Attendance sessions have not been conducted yet. When the administrator launches the face recognition verification console (Phase 8), your attendance will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
