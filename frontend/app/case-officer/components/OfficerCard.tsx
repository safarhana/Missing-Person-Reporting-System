import React from "react";
import Link from "next/link";

export type OfficerCardProps = {
  id?: number;
  name: string;
  uniqueId?: string;
  email: string;
  phone?: string;
  country?: string;
  joiningDate?: string;
};

export default function OfficerCard({
  id,
  name,
  uniqueId,
  email,
  phone,
  country,
  joiningDate,
}: OfficerCardProps) {
  const formattedDate = joiningDate
    ? new Date(joiningDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold text-xl shadow-sm">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900 leading-tight">{name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Case Officer</p>
          {uniqueId && (
            <span className="inline-block mt-1 text-[10px] font-mono font-semibold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
              {uniqueId}
            </span>
          )}
        </div>
        {id && (
          <Link
            href={`/case-officer/officers/${id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-medium border border-slate-200 transition-colors"
          >
            View Profile
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">Officer ID</span>
          <span className="font-mono font-semibold text-slate-900">
            {id ? `#${id}` : "—"}
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">Email</span>
          <span className="font-medium text-slate-800 truncate max-w-[140px]">{email}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">Phone</span>
          <span className="font-medium text-slate-800">{phone || "—"}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">District</span>
          <span className="font-medium text-slate-800">{country || "Unknown"}</span>
        </div>
        {formattedDate && (
          <div className="flex justify-between py-1.5 border-b border-slate-100 col-span-2">
            <span className="text-slate-500">Joined</span>
            <span className="font-medium text-slate-800">{formattedDate} (Active Duty)</span>
          </div>
        )}
      </div>
    </div>
  );
}
