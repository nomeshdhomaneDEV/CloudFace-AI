"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { Footer } from "@/components/landing/Footer";
import { AuthModal } from "@/components/landing/AuthModal";

export default function LandingPage() {
  const [authRole, setAuthRole] = useState<"student" | "admin" | "register" | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar */}
      <Navbar onOpenAuth={(role) => setAuthRole(role)} />

      {/* Main Landing Sections */}
      <main className="flex-1">
        <HeroSection onOpenAuth={(role) => setAuthRole(role)} />
        <FeaturesSection />
        <ArchitectureSection />
        <RoadmapSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Auth Modal Placeholder */}
      <AuthModal role={authRole} onClose={() => setAuthRole(null)} />
    </div>
  );
}
