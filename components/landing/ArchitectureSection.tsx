import { Server, Database, Smartphone, ShieldCheck, ArrowRight, Check } from "lucide-react";

export function ArchitectureSection() {
  const steps = [
    {
      num: "01",
      title: "Student Camera Scan",
      desc: "Student opens scanner on mobile or laptop; camera detects face alignment.",
      icon: Smartphone,
    },
    {
      num: "02",
      title: "Edge API Verification",
      desc: "Next.js serverless route performs identity verification & eligibility checks.",
      icon: Server,
    },
    {
      num: "03",
      title: "PostgreSQL Record Sync",
      desc: "Prisma validates uniqueness and atomically registers attendance in DB.",
      icon: Database,
    },
    {
      num: "04",
      title: "Live Dashboard Telemetry",
      desc: "Student & Admin interfaces update in real-time with attendance metrics.",
      icon: ShieldCheck,
    },
  ];

  const technologies = [
    { name: "Next.js 16 (App Router)", type: "Framework" },
    { name: "React 19", type: "Frontend Core" },
    { name: "TypeScript 5", type: "Type Safety" },
    { name: "Tailwind CSS v4", type: "Styling" },
    { name: "Prisma ORM 6.19", type: "Database Layer" },
    { name: "PostgreSQL / Supabase", type: "Cloud Database" },
    { name: "Vercel Platform", type: "Cloud Hosting" },
    { name: "Three.js / R3F Ready", type: "3D Visuals" },
  ];

  return (
    <section id="architecture" className="py-20 md:py-28 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            Cloud Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How CloudFace AI Operates
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A resilient pipeline combining client camera feeds, edge computing, relational database transactions, and role-based access.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-cyan-400">
                    <ArrowRight className="w-5 h-5 opacity-60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tech Stack Matrix */}
        <div id="tech-stack" className="glass-panel rounded-3xl p-8 sm:p-10 border border-cyan-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Zero-Cost Cloud Computing Tech Stack
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Built strictly using 100% free, open-source libraries and cloud free tiers.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <Check className="w-3.5 h-3.5" />
              100% ₹0 Free-Tier Compliant
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  {tech.type}
                </span>
                <span className="text-sm font-semibold text-white block">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
