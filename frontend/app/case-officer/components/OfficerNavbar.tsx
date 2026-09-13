"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OfficerNotificationBell from "./OfficerNotificationBell";

export default function OfficerNavbar() {
  const router = useRouter();
  const [officerName, setOfficerName] = useState("Officer");
  const [officerUniqueId, setOfficerUniqueId] = useState("");

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem("officer") || localStorage.getItem("officer");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setOfficerName(parsed.name);
        if (parsed.uniqueId) setOfficerUniqueId(parsed.uniqueId);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("officer");
    router.push("/case-officer/login");
  };

  const initials = officerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-xs">
      <div className="flex items-center gap-3">
        <Link href="/case-officer" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-lg shadow-xs group-hover:bg-slate-800 transition-colors">
            C
          </span>
          <div className="hidden sm:block text-left">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">CO PORTAL</h1>
            <p className="text-[10px] text-slate-500 font-medium">
              Missing Person Reporting System
            </p>
          </div>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span>Secure Console</span>
      </div>

      <div className="flex items-center gap-3">
        <OfficerNotificationBell />

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Public Portal
        </Link>

        <Link
          href="/case-officer/profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity"
          title="View my profile"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold uppercase">
            {initials || "CO"}
          </div>
          <div className="hidden lg:flex flex-col leading-none">
            <span className="text-xs font-medium text-slate-700">
              {officerName.length > 16 ? officerName.slice(0, 16) + "…" : officerName}
            </span>
            {officerUniqueId && (
              <span className="text-[10px] text-slate-400">{officerUniqueId}</span>
            )}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
