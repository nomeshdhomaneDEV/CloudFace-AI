"use client";

import { useState } from "react";
import Link from "next/link";
import { Cloud, ScanFace, ShieldCheck, Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenAuth?: (role: "student" | "admin" | "register") => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  void onOpenAuth;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <a
            href="#"
            id="nav-brand-logo"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cloud className="w-5 h-5 text-white absolute -top-1 -right-1 opacity-60" />
              <ScanFace className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CloudFace <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                Cloud Attendance
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#features"
              id="nav-link-features"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#architecture"
              id="nav-link-architecture"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Architecture
            </a>
            <a
              href="#tech-stack"
              id="nav-link-tech"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Tech Stack
            </a>
            <a
              href="#roadmap"
              id="nav-link-roadmap"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Roadmap
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login?role=student"
              id="nav-btn-student-login"
              className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-all duration-200"
            >
              Student Portal
            </Link>
            <Link
              href="/login?role=admin"
              id="nav-btn-admin-login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-all duration-200 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Admin
            </Link>
            <Link
              href="/register"
              id="nav-btn-register"
              className="px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 rounded-lg shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 flex items-center gap-1.5"
            >
              Register
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              id="nav-mobile-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#070d1d] px-4 pt-2 pb-6 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Features
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Architecture
          </a>
          <a
            href="#tech-stack"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Tech Stack
          </a>
          <a
            href="#roadmap"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Roadmap
          </a>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/login?role=student"
              id="mobile-btn-student-login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 text-center font-medium text-sm text-slate-200 bg-white/5 rounded-lg border border-white/10"
            >
              Student Portal
            </Link>
            <Link
              href="/login?role=admin"
              id="mobile-btn-admin-login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 text-center font-medium text-sm text-cyan-300 bg-cyan-950/40 rounded-lg border border-cyan-500/20"
            >
              Admin Console
            </Link>
            <Link
              href="/register"
              id="mobile-btn-register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 text-center font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-lg shadow-md"
            >
              Register Student
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
