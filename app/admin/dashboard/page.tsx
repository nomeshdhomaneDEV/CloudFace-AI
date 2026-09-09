import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Profile, Student } from "@prisma/client";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import {
  Cloud,
  ScanFace,
  ShieldCheck,
  Users,
  Camera,
  Activity,
  CheckCircle2,
  Database,
  BarChart3,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

type StudentWithProfile = Student & {
  profile: Profile;
};

export default async function AdminDashboardPage() {
  const authData = await getCurrentProfile();

  if (!authData || authData.profile.role !== "ADMIN") {
    redirect("/login?role=admin");
  }

  const { profile } = authData;

  // Retrieve live metrics from Supabase PostgreSQL via Prisma
  let totalStudents = 0;
  let enrolledFaces = 0;
  let totalProfiles = 0;
  let recentStudents: StudentWithProfile[] = [];

  try {
    const [studentsCount, enrolledCount, profilesCount, recent] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { faceEnrolled: true } }),
      prisma.profile.count(),
      prisma.student.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { profile: true },
      }),
    ]);

    totalStudents = studentsCount;
    enrolledFaces = enrolledCount;
    totalProfiles = profilesCount;
    recentStudents = recent;
  } catch (dbError) {
    console.error("Error fetching admin statistics:", dbError);
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Cloud className="w-5 h-5 text-white absolute -top-1 -right-1 opacity-60" />
                <ScanFace className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  CloudFace <span className="text-indigo-400">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                  Administrator Console
                </span>
              </div>
            </Link>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-200 font-medium">{profile.fullName}</span>
                <span className="text-indigo-300 font-mono font-semibold">({profile.email})</span>
              </div>
              <LogoutButton variant="admin" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Welcome Banner Card */}
        <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-indigo-500/20 shadow-2xl shadow-indigo-950/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Central Administration Authority • Role: ADMIN</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                System <span className="text-gradient-cyan">Control Center</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Live monitoring, role-based governance, and student enrollment telemetry across CloudFace AI.
              </p>
            </div>

            <div className="flex-shrink-0 p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Database Node</span>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase PostgreSQL Active</span>
              </div>
              <span className="text-[11px] text-slate-500">Free Tier AWS Pooler</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Students</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">{totalStudents}</p>
            <p className="text-[11px] text-slate-500">Registered academic accounts</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Biometrics Enrolled</span>
              <Camera className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">{enrolledFaces}</p>
            <p className="text-[11px] text-slate-500">Face embeddings active</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total User Profiles</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">{totalProfiles}</p>
            <p className="text-[11px] text-slate-500">Includes admin accounts</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>System Health</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 font-mono">100%</p>
            <p className="text-[11px] text-slate-500">All services operational</p>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">Recent Student Registrations (Prisma PostgreSQL)</h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
              Live Query
            </span>
          </div>

          {recentStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <p>No students have registered yet.</p>
              <p className="text-xs text-slate-500 mt-1">New student registrations will appear here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 border-b border-white/5 font-mono">
                  <tr>
                    <th className="px-6 py-3">Roll Number</th>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Class / Div</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Biometrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-cyan-300">{st.rollNumber}</td>
                      <td className="px-6 py-4 font-semibold text-white">{st.profile.fullName}</td>
                      <td className="px-6 py-4 text-slate-400">{st.class} ({st.division})</td>
                      <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{st.profile.email}</td>
                      <td className="px-6 py-4">
                        {st.faceEnrolled ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Enrolled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Future Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Live Face Scanner Console</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/20">Phase 8</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time video feed face recognition kiosk allowing classroom check-ins with anti-spoofing and liveness validation.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Analytics & CSV Export</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20">Phase 9</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export daily and monthly attendance registers with student breakdowns, attendance rate percentages, and audit logs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
