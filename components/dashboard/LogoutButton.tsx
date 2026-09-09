"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?: "student" | "admin";
}

export function LogoutButton({ className = "", variant = "student" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push(`/login?role=${variant}`);
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="dashboard-logout-btn"
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
        variant === "admin"
          ? "border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500/50"
          : "border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
      } ${loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Signing Out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </>
      )}
    </button>
  );
}
