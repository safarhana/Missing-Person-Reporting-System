import React from "react";

export type CaseStatusBadgeProps = {
  status: string;
};

export default function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  const normalized = (status || "Active").toLowerCase();

  const styles: Record<string, string> = {
    active:
      "inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700",
    investigating:
      "inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-700",
    found:
      "inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700",
    closed:
      "inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-xs font-semibold text-slate-600",
    urgent:
      "inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-semibold text-red-700 animate-pulse",
    "critical alert":
      "inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-300 px-2.5 py-0.5 text-xs font-bold text-red-800 animate-pulse",
  };

  const dots: Record<string, string> = {
    active: "bg-emerald-500",
    investigating: "bg-amber-500",
    found: "bg-blue-500",
    closed: "bg-slate-400",
    urgent: "bg-red-600",
    "critical alert": "bg-red-600",
  };

  const cls = styles[normalized] || styles.active;
  const dot = dots[normalized] || dots.active;

  return (
    <span className={cls}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`}></span>
      {status || "Active"}
    </span>
  );
}
