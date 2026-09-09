"use client";

import { useEffect } from "react";
import { X, ShieldAlert, Sparkles, Database, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  role: "student" | "admin" | "register" | null;
  onClose: () => void;
}

export function AuthModal({ role, onClose }: AuthModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!role) return null;

  const roleTitle =
    role === "student"
      ? "Student Portal"
      : role === "admin"
      ? "Administrator Console"
      : "Student Registration";

  return (
    <div
      role="dialog"
      aria-modal="true"
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-content"
        className="relative w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-950/80 space-y-6"
      >
        {/* Close button */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Preview Mode • Phase 2
            </span>
            <h3 className="text-xl font-bold text-white">{roleTitle}</h3>
          </div>
        </div>

        {/* Informative Explanation */}
        <div className="space-y-3 text-sm text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-white/5">
          <p className="leading-relaxed">
            You are viewing the <strong className="text-white">CloudFace AI Phase 2 Foundation</strong>.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Per the project development roadmap, <strong className="text-cyan-300">Phase 2 establishes the core Next.js, Tailwind CSS, TypeScript, and Prisma PostgreSQL foundation</strong>.
          </p>
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Phase 2: App Router & Prisma PostgreSQL schema initialized</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <Database className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Phase 3: Supabase Cloud Database connection & tables</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-cyan-300">
              <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Phase 4: Full Authentication & Role-Based Portals</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="auth-modal-acknowledge"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 shadow-lg shadow-cyan-500/20 transition-all"
        >
          Got It, Continue Exploring
        </button>
      </div>
    </div>
  );
}
