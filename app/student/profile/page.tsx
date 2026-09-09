import { redirect } from "next/navigation";
import { getAuthenticatedStudent } from "@/lib/student";
import { ProfileCard } from "@/components/student/ProfileCard";
import { User, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const authData = await getAuthenticatedStudent();

  if (!authData) {
    redirect("/login?role=student");
  }

  const { profile, student } = authData;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <User className="w-6 h-6 text-cyan-400" />
            <span>Academic Profile & Identity</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified academic credentials and personal student settings
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role: Verified Student</span>
        </div>
      </div>

      {/* Profile Card */}
      <ProfileCard profile={profile} student={student} />
    </div>
  );
}
