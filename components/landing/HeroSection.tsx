"use client";

import { Scan, ShieldCheck, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onOpenAuth: (role: "student" | "admin" | "register") => void;
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background ambient lighting gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Project Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>College Cloud Computing Project</span>
              <span className="text-white/30">•</span>
              <span className="text-cyan-200">Phase 2 Foundation Ready</span>
            </div>

            {/* Tagline & Main Headline */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base uppercase tracking-widest font-semibold text-cyan-400">
                Smart Face Recognition Attendance
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Next-Gen Attendance,{" "}
                <span className="text-gradient-cyan">Powered by Cloud & AI</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <strong className="text-white font-medium">CloudFace AI</strong> is a modern cloud-based attendance management system automating student verification with facial recognition. Eliminate proxy check-ins and paper registers with instant identity verification and real-time cloud analytics.
            </p>

            {/* Key benefits list */}
            <div className="pt-1 flex flex-wrap justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Zero proxy attendance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>100% Free-tier cloud stack</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Vercel + Supabase PostgreSQL</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                id="hero-btn-student"
                onClick={() => onOpenAuth("student")}
                className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-btn-admin"
                onClick={() => onOpenAuth("admin")}
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 rounded-xl border border-white/10 hover:border-cyan-500/40 shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Admin Console</span>
              </button>

              <button
                id="hero-btn-register"
                onClick={() => onOpenAuth("register")}
                className="w-full sm:w-auto px-5 py-3.5 text-sm font-medium text-cyan-300 hover:text-cyan-200 hover:bg-cyan-950/40 rounded-xl transition-all duration-200"
              >
                Register Student
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Visual & 3D Container Placeholder */}
          <div className="lg:col-span-5 relative">
            {/* 3D Canvas Placeholder Container */}
            <div
              id="3d-canvas-placeholder"
              className="relative mx-auto max-w-md w-full rounded-2xl glass-panel p-6 border border-cyan-500/20 shadow-2xl shadow-cyan-950/50 group"
            >
              {/* Corner tech reticle decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br" />

              {/* Header inside visualization card */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
                    Face Scanner Simulation
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                  Prisma • PostgreSQL
                </span>
              </div>

              {/* Facial AI Scanner Visual Box */}
              <div className="relative my-6 aspect-square w-full rounded-xl bg-gradient-to-b from-slate-900 to-[#020617] border border-cyan-500/30 overflow-hidden flex flex-col items-center justify-center">
                {/* Laser scan line animation */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline z-20 pointer-events-none" />

                {/* Concentric orbital radar rings */}
                <div className="absolute w-64 h-64 rounded-full border border-cyan-500/10 pointer-events-none animate-spin" style={{ animationDuration: "25s" }} />
                <div className="absolute w-48 h-48 rounded-full border border-dashed border-indigo-500/20 pointer-events-none animate-spin" style={{ animationDuration: "18s", animationDirection: "reverse" }} />
                <div className="absolute w-32 h-32 rounded-full border border-cyan-400/25 pointer-events-none" />

                {/* Central Holographic Face Icon */}
                <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 backdrop-blur-md shadow-lg shadow-cyan-500/10">
                  <Scan className="w-16 h-16 text-cyan-300 animate-float" />
                  <span className="mt-3 text-xs font-semibold text-white tracking-wide">
                    Live Face Biometrics
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Target: Roll #CS-2026-042
                  </span>
                </div>

                {/* Real-time telemetry badges */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono px-3 py-1.5 rounded-lg bg-black/70 border border-white/10 backdrop-blur-md text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Liveness: OK
                  </span>
                  <span className="text-cyan-300">Confidence: 99.4%</span>
                  <span className="text-slate-400">Duplication: 0</span>
                </div>
              </div>

              {/* 3D Scene Notice (Objective 8) */}
              <div className="pt-2 flex items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>3D Canvas slot ready</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                  Three.js / R3F (Phase 10)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
