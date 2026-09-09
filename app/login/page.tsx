"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Cloud,
  ScanFace,
  ShieldCheck,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = searchParams.get("role");
  const initialRole = roleParam === "admin" ? "admin" : "student";
  const initialError =
    searchParams.get("error") === "unauthorized_admin"
      ? "Unauthorized access: Student accounts cannot access the Administrator Console."
      : null;

  const [activeTab, setActiveTab] = useState<"student" | "admin">(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          expectedRole: activeTab === "student" ? "STUDENT" : "ADMIN",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      setSuccess("Authentication successful! Redirecting to dashboard...");
      const returnUrl = searchParams.get("returnUrl");
      const targetUrl = returnUrl || data.redirectTo || (activeTab === "admin" ? "/admin/dashboard" : "/student/dashboard");

      setTimeout(() => {
        router.push(targetUrl);
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs text-slate-300">Return to CloudFace AI Home</span>
        </Link>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-xl shadow-cyan-500/25">
            <Cloud className="w-6 h-6 text-white absolute -top-1 -right-1 opacity-60" />
            <ScanFace className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Sign In to <span className="text-cyan-400">CloudFace AI</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Cloud-Based Smart Face Recognition Attendance Management
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="glass-panel p-1.5 rounded-2xl border border-white/10 mb-6 flex items-center gap-1.5 bg-slate-900/60">
        <button
          type="button"
          id="login-tab-student"
          onClick={() => {
            setActiveTab("student");
            setError(null);
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === "student"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student Portal</span>
        </button>

        <button
          type="button"
          id="login-tab-admin"
          onClick={() => {
            setActiveTab("admin");
            setError(null);
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === "admin"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Console</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-950/60">
        <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <h2 className="text-base font-semibold text-white">
              {activeTab === "student" ? "Student Access" : "Administrator Authentication"}
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            {activeTab === "student" ? "ROLE: STUDENT" : "ROLE: ADMIN"}
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            id="login-error-alert"
            className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div
            id="login-success-alert"
            className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="login-email">
              Institutional / Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === "student" ? "student@example.edu" : "admin@cloudface.edu"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            className={`w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              activeTab === "student"
                ? "bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 shadow-cyan-500/20"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-indigo-500/20"
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In as {activeTab === "student" ? "Student" : "Administrator"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info & Links */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
          {activeTab === "student" ? (
            <p>
              New student to CloudFace AI?{" "}
              <Link
                href="/register"
                id="login-link-to-register"
                className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4"
              >
                Register your account
              </Link>
            </p>
          ) : (
            <p className="text-slate-400">
              Administrator accounts are provisioned securely by the college administration.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading authentication portal...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
