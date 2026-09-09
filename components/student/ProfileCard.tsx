"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile, Student } from "@prisma/client";
import {
  User,
  Mail,
  Hash,
  BookOpen,
  Layers,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
  student: Student;
}

export function ProfileCard({ profile, student }: ProfileCardProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.fullName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Full name cannot be empty." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile name.");
      }

      setMessage({ type: "success", text: "Profile name updated successfully." });
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: "error", text: err.message });
      } else {
        setMessage({ type: "error", text: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  const accountCreatedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Summary Identity Card */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
            <User className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">{profile.fullName}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{profile.email}</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono">
            <span>ROLE: STUDENT</span>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 text-left text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Account Created</span>
              </span>
              <span className="text-slate-300 font-medium">{accountCreatedDate}</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>Face Enrollment</span>
              </span>
              {student.faceEnrolled ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Enrolled
                </span>
              ) : (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Not Enrolled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Academic Integrity Box */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Academic Records Security</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Roll Number, Class, and Division are verified institutional records locked to preserve attendance audit integrity. If any academic detail requires correction, contact your institution administrator.
          </p>
        </div>
      </div>

      {/* Right: Academic Details Form */}
      <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Student Academic Profile</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage personal details and view verified credentials</p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            PRISMA POSTGRESQL
          </span>
        </div>

        {/* Alerts */}
        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in ${
              message.type === "success"
                ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
                : "bg-red-950/60 border border-red-500/30 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Editable Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="profile-fullName">
              Full Name (Editable)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="profile-fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Displayed across your attendance records and portal header.</p>
          </div>

          {/* Read-Only Institutional Email */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300" htmlFor="profile-email">
                Institutional Email Address
              </label>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3" /> Supabase Auth Verified
              </span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="profile-email"
                type="email"
                disabled
                value={profile.email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Read-Only Academic Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300" htmlFor="profile-rollNumber">
                  Roll Number
                </label>
                <Lock className="w-3 h-3 text-slate-500" />
              </div>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="profile-rollNumber"
                  type="text"
                  disabled
                  value={student.rollNumber}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-slate-300 font-mono text-sm cursor-not-allowed uppercase"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300" htmlFor="profile-class">
                  Class / Program
                </label>
                <Lock className="w-3 h-3 text-slate-500" />
              </div>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="profile-class"
                  type="text"
                  disabled
                  value={student.class}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-slate-300 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300" htmlFor="profile-division">
                  Division
                </label>
                <Lock className="w-3 h-3 text-slate-500" />
              </div>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="profile-division"
                  type="text"
                  disabled
                  value={student.division}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-slate-300 text-sm cursor-not-allowed uppercase"
                />
              </div>
            </div>
          </div>

          {/* Biometric Status Summary */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Facial Biometrics Status</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80">Phase 6 Ready</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {student.faceEnrolled
                ? "Your face enrollment is active and ready for automated check-ins."
                : "Face Enrollment: Not Enrolled. Camera enrollment interface will be connected in Phase 6."}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || fullName.trim() === profile.fullName}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                fullName.trim() !== profile.fullName && !loading
                  ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 cursor-pointer"
                  : "bg-white/10 text-slate-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
