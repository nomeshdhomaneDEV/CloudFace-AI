"use client";

import { useState } from "react";
import type { Attendance } from "@prisma/client";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ScanFace,
} from "lucide-react";

interface AttendanceHistoryTableProps {
  records: Attendance[];
}

export function AttendanceHistoryTable({ records }: AttendanceHistoryTableProps) {
  const [filter, setFilter] = useState<"ALL" | "PRESENT" | "LATE" | "ABSENT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((r) => {
    // Status filter
    if (filter !== "ALL" && r.status !== filter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const dateString = new Date(r.attendanceDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return (
        dateString.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return true;
  });

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;

  return (
    <div className="space-y-5">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "ALL"
                ? "bg-white/15 text-white font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("PRESENT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "PRESENT"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                : "text-slate-400 hover:text-emerald-400"
            }`}
          >
            Present ({presentCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("LATE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "LATE"
                ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                : "text-slate-400 hover:text-amber-400"
            }`}
          >
            Late ({lateCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ABSENT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "ABSENT"
                ? "bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30"
                : "text-slate-400 hover:text-rose-400"
            }`}
          >
            Absent ({absentCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No attendance records found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {records.length === 0
                ? "No attendance check-ins have been recorded for your account yet."
                : "No attendance records match the selected filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-900/70 text-xs uppercase text-slate-400 font-mono border-b border-white/5">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Session Date</th>
                  <th className="px-6 py-3.5 font-medium">Check-In Time</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium">Verification Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.map((record) => {
                  const dateFormatted = new Date(record.attendanceDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  const timeFormatted = new Date(record.checkInTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        {dateFormatted}
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                        {timeFormatted}
                      </td>
                      <td className="px-6 py-4">
                        {record.status === "PRESENT" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </span>
                        ) : record.status === "LATE" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono bg-white/5 text-slate-300 border border-white/10">
                          <ScanFace className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{record.verificationMethod}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
