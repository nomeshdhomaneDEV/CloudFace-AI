import { Cloud, ScanFace, ShieldCheck, BarChart3, FileSpreadsheet, Lock, Cpu } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      id: "feature-cloud-db",
      icon: Cloud,
      title: "Cloud-Native Architecture",
      description:
        "Built on serverless Next.js, Vercel Edge, and PostgreSQL via Prisma ORM for seamless horizontal scale and sub-second query response.",
      tag: "PostgreSQL",
    },
    {
      id: "feature-face-recognition",
      icon: ScanFace,
      title: "Smart Facial Verification",
      description:
        "Automated student identity matching via device camera. Instant verification replaces manual registers and prevents buddy punching.",
      tag: "Computer Vision",
    },
    {
      id: "feature-duplicate-prevention",
      icon: ShieldCheck,
      title: "Duplicate Check-In Prevention",
      description:
        "Database-level composite unique constraints guarantee that students can only mark attendance once per session or calendar date.",
      tag: "Integrity",
    },
    {
      id: "feature-realtime-analytics",
      icon: BarChart3,
      title: "Real-Time Attendance Analytics",
      description:
        "Interactive dashboard telemetry showing present vs. absent ratios, overall attendance percentage, and historical trend curves.",
      tag: "Analytics",
    },
    {
      id: "feature-privacy-first",
      icon: Lock,
      title: "Privacy-First Biometrics",
      description:
        "Designed to store compact mathematical embeddings instead of raw photos, with strict Role-Based Access Control (RBAC).",
      tag: "Privacy & RBAC",
    },
    {
      id: "feature-csv-export",
      icon: FileSpreadsheet,
      title: "Institutional CSV Export",
      description:
        "College administrators and professors can instantly export filtered attendance logs into standard CSV sheets for grading and records.",
      tag: "Reporting",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative border-t border-white/5 bg-[#050a18]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Modern Academic Institutions
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Every layer of CloudFace AI is structured to showcase enterprise cloud computing, robust data models, and automated attendance tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className="glass-panel-interactive rounded-2xl p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:text-white group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-indigo-600 transition-all duration-300 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300/80 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
