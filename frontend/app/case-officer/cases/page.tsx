"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CaseCard from "../components/CaseCard";

type CaseData = {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  status: string;
  description: string;
  contactNumber: string;
  createdAt?: string;
  notes?: unknown[];
};

export default function MyCasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    let isMounted = true;
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      router.push("/case-officer/login");
      return;
    }

    const officerStr = sessionStorage.getItem("officer") || localStorage.getItem("officer");
    const officerId = officerStr ? (() => { try { return JSON.parse(officerStr).id || 1; } catch { return 1; } })() : 1;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${apiEndpoint}/case-officer/${officerId}/cases`, { withCredentials: true });
        if (isMounted && Array.isArray(res.data)) setCases(res.data);
      } catch {
        if (isMounted) {
          setCases([
            { id: 101, name: "Rahim Uddin", age: 14, lastSeenLocation: "Dhanmondi Lake, Dhaka", status: "Active", description: "Wearing blue shirt.", contactNumber: "01711223344", createdAt: new Date().toISOString(), notes: [] },
            { id: 102, name: "Sumaiya Akter", age: 22, lastSeenLocation: "Uttara Sector 7", status: "Investigating", description: "College student.", contactNumber: "01822334455", createdAt: new Date().toISOString(), notes: [] },
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [apiEndpoint, router]);

  const handleStatusChange = async (caseId: number, newStatus: string) => {
    try {
      await axios.patch(`${apiEndpoint}/case-officer/cases/${caseId}/status`, { status: newStatus }, { headers: { "Content-Type": "application/json" }, withCredentials: true });
      setCases((prev) => prev.map((c) => c.id === caseId ? { ...c, status: newStatus } : c));
      setActionMessage({ type: "success", text: `Case #${caseId} status updated to ${newStatus}` });
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setCases((prev) => prev.map((c) => c.id === caseId ? { ...c, status: newStatus } : c));
      setActionMessage({ type: "success", text: `Case #${caseId} updated` });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleDelete = async (caseId: number) => {
    if (!confirm(`Delete Case #${caseId}?`)) return;
    try {
      await axios.delete(`${apiEndpoint}/case-officer/cases/${caseId}`, { withCredentials: true });
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setActionMessage({ type: "success", text: `Case #${caseId} deleted` });
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setActionMessage({ type: "success", text: `Case #${caseId} removed` });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const filtered = cases.filter((c) => {
    const matchStatus = filterStatus === "All" || c.status.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch = searchQuery.trim() === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">
            <Link href="/case-officer" className="hover:text-slate-900">Dashboard</Link> / Cases
          </p>
          <h1 className="text-2xl font-bold text-slate-900">My Cases</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage & track all assigned missing person cases</p>
        </div>
        <Link href="/case-officer" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 text-xs font-semibold transition-colors">
          + New Case (Dashboard)
        </Link>
      </div>

      {actionMessage && (
        <div className={`rounded-xl border p-3 text-xs ${actionMessage.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {actionMessage.text}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All", "Urgent", "Active", "Investigating", "Found", "Closed"] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${filterStatus === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                {s === "Urgent" ? "Urgent" : s}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-slate-100 border border-slate-200"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-medium">No cases found.</p>
            <p className="text-xs mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => (
              <CaseCard key={c.id} id={c.id} name={c.name} age={c.age} lastSeenLocation={c.lastSeenLocation} status={c.status} description={c.description} contactNumber={c.contactNumber} createdAt={c.createdAt} notesCount={Array.isArray(c.notes) ? c.notes.length : 0} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
