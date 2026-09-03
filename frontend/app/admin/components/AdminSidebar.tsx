"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      tag: "D",
      description: "Overview & system metrics",
    },
    {
      name: "Admins & Users",
      href: "/admin/users",
      tag: "U",
      description: "Directory, Search & Status",
    },
    {
      name: "Volunteers",
      href: "/admin/volunteers",
      tag: "V",
      description: "Assignment & management",
    },
    {
      name: "Case Officers",
      href: "/admin/case-officers",
      tag: "O",
      description: "Supervision & assignment",
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-pink-100 flex flex-col shrink-0">
      <div className="p-4 flex-1">
        <p className="text-[11px] font-semibold text-pink-700/80 uppercase tracking-wider px-3 mb-2">
          Admin Management
        </p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-pink-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-pink-50 text-pink-600 group-hover:bg-pink-100"
                  }`}
                >
                  {item.tag}
                </div>
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span
                    className={`text-[10px] leading-tight ${
                      isActive ? "text-pink-100" : "text-slate-400"
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

      <div className="p-4 border-t border-pink-100 bg-pink-50/40">
        <div className="rounded-xl bg-white p-3 border border-pink-100 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-pink-500"></span>
            <span className="text-xs font-semibold text-slate-800">System Online</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Missing Person Reporting System Admin Console
          </p>
        </div>
      </div>
    </aside>
  );
}
