"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import OfficerNavbar from "./components/OfficerNavbar";
import OfficerSidebar from "./components/OfficerSidebar";

export default function CaseOfficerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/case-officer/login" || pathname === "/case-officer/register";

  const tnr: React.CSSProperties = {
    fontFamily: '"Times New Roman", "Times", Georgia, serif',
  };

  if (isAuthPage) {
    return (
      <div
        style={tnr}
        className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        {children}
      </div>
    );
  }

  return (
    <div style={tnr} className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col">
      <OfficerNavbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <OfficerSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white/80 py-4 px-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Missing Person Reporting System (MPRS) — Case Officer Console
      </footer>
    </div>
  );
}
