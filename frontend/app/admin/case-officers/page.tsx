"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { getAdminCaseOfficers, assignCaseOfficerToAdmin, removeCaseOfficerFromAdmin, getAdminByUsername } from "../services/api";
import { getStoredUsername, assignmentSchema } from "../utils/validation";

export interface CaseOfficer {
  id: number;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  uniqueId?: string;
  badgeNumber?: string;
}

export default function CaseOfficersManagementPage() {
  const [adminId, setAdminId] = useState<number | null>(null);
  const [officers, setOfficers] = useState<CaseOfficer[]>([]);
  const [officerIdInput, setOfficerIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [inputError, setInputError] = useState("");

  const loadOfficers = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const username = getStoredUsername();
      let currentAdminId = adminId;

      if (!currentAdminId) {
        if (!username) {
          setMessage({
            text: "No logged-in administrator session detected. Please log in.",
            type: "error",
          });
          setIsLoading(false);
          return;
        }

        try {
          const profile = await getAdminByUsername(username);
          currentAdminId = profile.id;
          setAdminId(profile.id);
        } catch (e) {
          setMessage({
            text: "Could not identify current admin account. Please refresh or re-login.",
            type: "error",
          });
          setIsLoading(false);
          return;
        }
      }

      if (!currentAdminId) {
        setMessage({
          text: "Administrator ID could not be determined. Operation halted.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      const data = await getAdminCaseOfficers(currentAdminId);
      setOfficers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "No case officers currently under supervision.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  const handleAssign = async (e: FormEvent) => {
    e.preventDefault();
    setInputError("");
    setMessage(null);

    if (!adminId) {
      setMessage({
        text: "Cannot assign case officer: Administrator ID is missing. Please re-login.",
        type: "error",
      });
      return;
    }

    const validation = assignmentSchema.safeParse({ targetId: officerIdInput });
    if (!validation.success) {
      setInputError(validation.error.issues[0].message);
      return;
    }

    const targetOfficerId = parseInt(officerIdInput, 10);
    setActionLoading(true);

    try {
      await assignCaseOfficerToAdmin(adminId, targetOfficerId);
      setMessage({
        text: `Case Officer #${targetOfficerId} assigned to your supervision roster.`,
        type: "success",
      });
      setOfficerIdInput("");
      await loadOfficers();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Failed to assign case officer. Verify the Officer ID.",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (officerId: number) => {
    if (!adminId) return;
    setActionLoading(true);
    setMessage(null);

    try {
      await removeCaseOfficerFromAdmin(adminId, officerId);
      setMessage({
        text: `Case Officer #${officerId} removed from supervision.`,
        type: "success",
      });
      setOfficers((prev) => prev.filter((o) => o.id !== officerId));
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Failed to remove case officer assignment.",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-slate-900 transition-colors">
              Admin
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Case Officers</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Case Officer Supervision
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervise case officers and link them to administrator oversight
          </p>
        </div>

        <button
          onClick={loadOfficers}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
        >
          ↻ Refresh Officers
        </button>
      </div>

      {message && (
        <div
          className={`rounded-xl p-3 text-xs flex items-center justify-between border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-red-50 text-red-700 border-red-300"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700 ml-2">
            ✕
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Assign Case Officer</h2>
        <p className="text-xs text-slate-500 mb-4">
          Enter the numeric ID of a case officer to place their investigations under your oversight.
        </p>

        <form onSubmit={handleAssign} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={officerIdInput}
              onChange={(e) => setOfficerIdInput(e.target.value)}
              placeholder="Enter Case Officer ID (e.g. 1)"
              disabled={actionLoading}
              className={`w-full rounded-xl bg-white border px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                inputError ? "border-red-500" : "border-slate-300 focus:border-slate-900"
              }`}
            />
            {inputError && <p className="mt-1 text-[11px] text-red-600">{inputError}</p>}
          </div>

          <button
            type="submit"
            disabled={actionLoading}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            {actionLoading ? "Assigning..." : "Assign Officer"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-semibold">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Supervised Officers
          </h3>
          <span className="text-xs text-slate-600 font-medium">
            {officers.length} Supervised
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-6 py-3">Officer ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email / Badge</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-slate-400">
                    Loading supervised case officers...
                  </td>
                </tr>
              ) : officers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-slate-400">
                    No case officers currently assigned. Use the form above to link one.
                  </td>
                </tr>
              ) : (
                officers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-700">#{officer.id}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {officer.fullName || officer.name || `Officer #${officer.id}`}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500">{officer.email || officer.badgeNumber || "N/A"}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-300">
                        Supervised
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleRemove(officer.id)}
                        disabled={actionLoading}
                        className="inline-flex items-center rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
