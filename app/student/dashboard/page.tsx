import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import {
  Cloud,
  ScanFace,
  GraduationCap,
  Hash,
  BookOpen,
  Layers,
  Mail,
  ShieldCheck,
  Sparkles,
  Camera,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const authData = await getCurrentProfile();

  if (!authData || authData.profile.role !== "STUDENT") {
    redirect("/login?role=student");
  }

  const { profile } = authData;
  const student = profile.student;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      {/* Student Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
                <Cloud className="w-5 h-5 text-white absolute -top-1 -right-1 opacity-60" />
                <ScanFace className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  CloudFace <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                  Student Portal
                </span>
              </div>
            </Link>

            {/* Top Right User & Logout */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">{profile.fullName}</span>
                <span className="text-cyan-400 font-mono font-semibold">({student?.rollNumber || "STUDENT"})</span>
              </div>
              <LogoutButton variant="student" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Student Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Welcome Banner Card */}
        <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
          {/* Background ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Academic Portal • Verified</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-gradient-cyan">{profile.fullName}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Your CloudFace AI academic profile is connected. Daily attendance and verification records are synced securely with college databases.
              </p>
            </div>

            {/* Biometric Status Indicator Badge */}
            <div className="flex-shrink-0 p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Face Enrollment Status</span>
              {student?.faceEnrolled ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Biometrics Enrolled</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Face Setup Pending (Phase 6)</span>
                </div>
              )}
              <span className="text-[11px] text-slate-500">Encrypted Facial Vector Format</span>
            </div>
          </div>
        </div>

        {/* Academic Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Roll Number</span>
              <Hash className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-lg font-bold text-white font-mono">{student?.rollNumber || "N/A"}</p>
            <p className="text-[11px] text-slate-500">Unique Academic ID</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Class / Program</span>
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-lg font-bold text-white">{student?.class || "N/A"}</p>
            <p className="text-[11px] text-slate-500">Enrolled Degree</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Division</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-lg font-bold text-white font-mono">{student?.division || "N/A"}</p>
            <p className="text-[11px] text-slate-500">Section Group</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Registered Email</span>
              <Mail className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-sm font-semibold text-white truncate">{profile.email}</p>
            <p className="text-[11px] text-slate-500">Supabase Auth Verified</p>
          </div>
        </div>

        {/* Action / Roadmap Phase Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Attendance Modules</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phase 6 Feature Card */}
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4 hover:border-cyan-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">Face Enrollment</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/20">Phase 6</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Capture reference face landmarks to generate numerical vector embeddings for automated attendance.
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <span>Integrated via client-side face-api.js</span>
              </div>
            </div>

            {/* Phase 7 Feature Card */}
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4 hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">Attendance Log</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-500/20">Phase 7</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  View your complete attendance ledger, check-in timestamps, verification methods, and overall percentage.
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <span>Enforces one check-in per calendar day</span>
              </div>
            </div>

            {/* Privacy & Security Card */}
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4 hover:border-cyan-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">Security & Privacy</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/20">Encrypted</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your identity is protected with zero raw photo retention. Only one-way biometric vectors are verified.
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <span>College Academic Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
