import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedStudent } from "@/lib/student";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { StudentNav } from "@/components/student/StudentNav";
import { Cloud, ScanFace } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await getAuthenticatedStudent();

  if (!authData) {
    redirect("/login?role=student");
  }

  const { profile, student } = authData;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      {/* Student Portal Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
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

            {/* Right: Student Identity Pill & Logout */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200 font-medium">{profile.fullName}</span>
                <span className="text-cyan-400 font-mono font-semibold">({student.rollNumber})</span>
              </div>
              <LogoutButton variant="student" />
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Navigation Tabs */}
      <StudentNav />

      {/* Main Student Portal Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
