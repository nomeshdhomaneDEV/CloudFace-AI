import { CheckCircle2, Clock } from "lucide-react";

export function RoadmapSection() {
  const phases = [
    { num: "01", name: "Architecture & Planning", status: "completed" },
    { num: "02", name: "Foundation & Setup (Next.js + Prisma)", status: "current" },
    { num: "03", name: "Supabase & PostgreSQL Cloud DB", status: "upcoming" },
    { num: "04", name: "Authentication & Role Security", status: "upcoming" },
    { num: "05", name: "Student Profile & Dashboard", status: "upcoming" },
    { num: "06", name: "Face Enrollment Camera Module", status: "upcoming" },
    { num: "07", name: "Face Attendance Verification", status: "upcoming" },
    { num: "08", name: "Admin Console & Student Management", status: "upcoming" },
    { num: "09", name: "Analytics, Metrics & CSV Export", status: "upcoming" },
    { num: "10", name: "3D Visual Experience (Three.js)", status: "upcoming" },
    { num: "11", name: "End-to-End Testing & Hardening", status: "upcoming" },
    { num: "12", name: "Production Vercel Cloud Deployment", status: "upcoming" },
  ];

  return (
    <section id="roadmap" className="py-20 md:py-28 relative border-t border-white/5 bg-[#050a18]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            Project Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Development Lifecycle
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A methodical step-by-step engineering progression ensuring each module is fully verified before proceeding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) => {
            const isCompleted = phase.status === "completed";
            const isCurrent = phase.status === "current";

            return (
              <div
                key={phase.num}
                className={`p-5 rounded-2xl border transition-all duration-200 ${
                  isCurrent
                    ? "bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30"
                    : isCompleted
                    ? "bg-slate-900/40 border-emerald-500/30"
                    : "bg-slate-900/20 border-white/5 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    PHASE {phase.num}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  ) : isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-400/40 animate-pulse">
                      Active Phase
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> Planned
                    </span>
                  )}
                </div>
                <h4 className="text-base font-semibold text-white">{phase.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
