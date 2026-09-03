"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/30 text-slate-800 flex flex-col">
      <AdminNavbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <footer className="border-t border-pink-100 bg-white/80 py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Missing Person Reporting System (MPRS) — Administrator Console
      </footer>
    </div>
  );
}
