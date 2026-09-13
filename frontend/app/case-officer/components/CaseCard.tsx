import React from "react";
import Link from "next/link";
import CaseStatusBadge from "./CaseStatusBadge";

export type CaseCardProps = {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  status: string;
  description: string;
  contactNumber: string;
  createdAt?: string;
  notesCount?: number;
  onStatusChange?: (id: number, newStatus: string) => void;
  onDelete?: (id: number) => void;
};

export default function CaseCard({
  id,
  name,
  age,
  lastSeenLocation,
  status,
  description,
  contactNumber,
  createdAt,
  notesCount = 0,
  onStatusChange,
  onDelete,
}: CaseCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-shadow p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/case-officer/cases/${id}`}
              className="text-base font-bold text-slate-900 hover:text-slate-600 transition-colors"
            >
              {name}
            </Link>
            <span className="text-xs text-slate-400">({age} yrs)</span>
            <CaseStatusBadge status={status} />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Case #{id} · Reported {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/case-officer/cases/${id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-medium border border-slate-200 transition-colors"
          >
            View Details
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              type="button"
              className="inline-flex items-center gap-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 text-xs font-medium border border-red-200 transition-colors cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-slate-600 mb-3">
        <div>
          <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Last Seen</span>
          <p className="font-medium text-slate-800 mt-0.5">{lastSeenLocation}</p>
        </div>
        <div>
          <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Contact</span>
          <p className="font-medium text-slate-800 mt-0.5">{contactNumber}</p>
        </div>
        <div>
          <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Notes</span>
          <p className="font-medium text-slate-800 mt-0.5">{notesCount} logged</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{description}</p>

      {onStatusChange && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Update Status:
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Urgent">Urgent</option>
            <option value="Investigating">Investigating</option>
            <option value="Found">Found</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      )}
    </div>
  );
}
