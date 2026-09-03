"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";
import { clearAuthSession, getStoredUsername } from "../utils/validation";

export default function AdminNavbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const saved = getStoredUsername();
    if (saved) setUsername(saved);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-pink-100 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-xs">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-600 text-white font-bold text-lg shadow-sm group-hover:bg-pink-500 transition-colors">
            M
          </span>
          <div className="hidden sm:block text-left">
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">MPRS ADMIN</h1>
            <p className="text-[10px] text-pink-600 font-medium">Missing Person Reporting</p>
          </div>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50/80 border border-pink-200/80 text-xs text-pink-800 font-medium">
        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span>Admin Console</span>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-pink-600 px-2.5 py-1.5 rounded-md hover:bg-pink-50 transition-colors"
          title="Return to Public Portal"
        >
          <span>🌐 Main Site</span>
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-pink-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold uppercase">
            {username ? username.slice(0, 2) : "AD"}
          </div>
          <span className="hidden lg:inline text-xs font-medium text-slate-700">
            {username || "Admin"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 text-xs font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
