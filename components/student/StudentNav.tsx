"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck2,
  History,
  User,
  Menu,
  X,
} from "lucide-react";

interface StudentNavProps {
  className?: string;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Attendance",
    href: "/student/attendance",
    icon: CalendarCheck2,
  },
  {
    name: "History",
    href: "/student/history",
    icon: History,
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
  },
];

export function StudentNav({ className = "" }: StudentNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`w-full border-b border-white/5 bg-[#030712]/90 backdrop-blur-md ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Desktop Navigation Tabs */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Section Indicator on Desktop */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Student Management</span>
            <span>•</span>
            <span className="text-cyan-400/80">Phase 5</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden w-full items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Portal Navigation
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle student navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-3 pt-1 border-t border-white/5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
