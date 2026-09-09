import { redirect } from "next/navigation";
import { getAuthenticatedStudent, getStudentAttendanceSummary } from "@/lib/student";
import { AttendanceHistoryTable } from "@/components/student/AttendanceHistoryTable";
import { History, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentHistoryPage() {
  const authData = await getAuthenticatedStudent();

  if (!authData) {
    redirect("/login?role=student");
  }

  const { student } = authData;
  const attendance = await getStudentAttendanceSummary(student.id);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-400" />
            <span>Attendance History Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chronological date-wise record of your classroom attendance and verification check-ins
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tamper-Resistant PostgreSQL Ledger</span>
        </div>
      </div>

      {/* History Table */}
      <AttendanceHistoryTable records={attendance.records} />
    </div>
  );
}
