import { ScanFace, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#02050e] py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600">
              <ScanFace className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base">
                CloudFace <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Cloud-Based Smart Face Recognition Attendance Management System
              </span>
            </div>
          </div>

          {/* College Project Notice */}
          <div className="text-center md:text-right text-xs text-slate-400 space-y-1">
            <p className="flex items-center justify-center md:justify-end gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> for Academic Cloud Computing Excellence
            </p>
            <p>
              Deployed on Vercel • Supabase PostgreSQL • 100% Free-Tier Architecture
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CloudFace AI. Educational Micro-Project.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300">Phase 2: Foundation & Setup</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-slate-300">Privacy & Biometrics Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
