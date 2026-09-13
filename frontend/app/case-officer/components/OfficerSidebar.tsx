"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OfficerSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/case-officer",
      tag: "D",
      description: "Overview & case metrics",
      exact: true,
    },
    {
      name: "My Cases",
      href: "/case-officer/cases",
      tag: "C",
      description: "Manage & track cases",
      exact: false,
    },
    {
      name: "My Profile",
      href: "/case-officer/profile",
      tag: "P",
      description: "View & edit my account",
      exact: false,
    },
    {
      name: "Register Officer",
      href: "/case-officer/register",
      tag: "R",
      description: "New officer enrollment",
      exact: true,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-4 flex-1">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Case Officer Management
        </p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                  }`}
                >
                  {item.tag}
                </div>
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span
                    className={`text-[10px] leading-tight ${
                      isActive ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-slate-800">Dispatch Online</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Missing Person Operations & Authority Network
          </p>
        </div>
      </div>
    </aside>
  );
}
