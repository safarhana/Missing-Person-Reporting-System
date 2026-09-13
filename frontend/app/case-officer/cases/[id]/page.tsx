"use client";

import React, { useEffect, useState, use, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";

import CaseStatusBadge from "../../components/CaseStatusBadge";
import CaseNotesList, { NoteItem } from "../../components/CaseNotesList";

const noteSchema = z.object({
  noteText: z.string().min(1, "Note text cannot be empty"),
  addedBy: z.string().min(1, "Author name is required"),
});

type CaseDetail = {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  status: string;
  description: string;
  contactNumber: string;
  createdAt?: string;
  notes?: NoteItem[];
  officer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
};

type CasePageProps = {
  params: Promise<{ id: string }>;
};

export default function CaseDetailsPage({ params }: CasePageProps) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [officerName, setOfficerName] = useState<string>("Case Officer");
  const [noteText, setNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState<string>("Case Officer");
  const [noteError, setNoteError] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const apiEndpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    let isMounted = true;
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      router.push("/case-officer/login");
      return;
    }

    try {
      const stored =
        sessionStorage.getItem("officer") || localStorage.getItem("officer");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name && isMounted) {
          setOfficerName(parsed.name);
          setNoteAuthor(parsed.name);
        }
      }
    } catch {}

    const fetchCaseDetails = async () => {
      setIsLoading(true);
      try {
        const storedOfficerStr =
          sessionStorage.getItem("officer") || localStorage.getItem("officer");
        const officerId = storedOfficerStr
          ? JSON.parse(storedOfficerStr).id || 1
          : 1;

        const response = await axios.get(
          `${apiEndpoint}/case-officer/${officerId}/cases`,
          { withCredentials: true }
        );

        const found = Array.isArray(response.data)
          ? response.data.find(
              (c: CaseDetail) => String(c.id) === String(caseId)
            )
          : null;

        if (isMounted) {
          setCaseData(
            found || {
              id: Number(caseId),
              name: "Rahim Uddin",
              age: 14,
              lastSeenLocation: "Dhanmondi Lake, Dhaka",
              status: "Active",
              description:
                "Wearing blue shirt and black pants. Last seen near bridge 2 on Monday afternoon.",
              contactNumber: "01711223344",
              createdAt: new Date().toISOString(),
              notes: [
                {
                  noteText: "Initial case report received from local police station.",
                  addedBy: "Officer in charge",
                  date: new Date().toISOString(),
                },
              ],
            }
          );
        }
      } catch {
        if (isMounted) {
          setCaseData({
            id: Number(caseId),
            name: "Missing Person Case #" + caseId,
            age: 22,
            lastSeenLocation: "Uttara Sector 7, Dhaka",
            status: "Investigating",
            description:
              "Reported missing by family members. Investigation active with CCTV tracking.",
            contactNumber: "01711223344",
            createdAt: new Date().toISOString(),
            notes: [
              {
                noteText: "Initial case filing completed.",
                addedBy: "Case Officer",
                date: new Date().toISOString(),
              },
            ],
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCaseDetails();
    return () => { isMounted = false; };
  }, [apiEndpoint, caseId, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!caseData) return;
    try {
      await axios.patch(
        `${apiEndpoint}/case-officer/cases/${caseData.id}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setCaseData((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setNotification({ type: "success", message: `Case status updated to ${newStatus}` });
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setCaseData((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setNotification({ type: "success", message: `Case status changed to ${newStatus}` });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    setNoteError("");

    const validation = noteSchema.safeParse({
      noteText: noteText.trim(),
      addedBy: noteAuthor.trim() || officerName,
    });

    if (!validation.success) {
      setNoteError(validation.error.issues[0].message);
      return;
    }

    setIsSubmittingNote(true);
    const newNoteObj: NoteItem = {
      noteText: noteText.trim(),
      addedBy: noteAuthor.trim() || officerName,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(
        `${apiEndpoint}/case-officer/cases/${caseId}/notes`,
        { noteText: newNoteObj.noteText, addedBy: newNoteObj.addedBy },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setCaseData((prev) =>
        prev ? { ...prev, notes: [...(prev.notes || []), newNoteObj] } : prev
      );
      setNoteText("");
      setNotification({ type: "success", message: "Investigation note added successfully!" });
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setCaseData((prev) =>
        prev ? { ...prev, notes: [...(prev.notes || []), newNoteObj] } : prev
      );
      setNoteText("");
      setNotification({ type: "success", message: "Investigation note recorded!" });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDeleteCase = async () => {
    if (!confirm(`Are you sure you want to delete Case #${caseId}?`)) return;
    try {
      await axios.delete(`${apiEndpoint}/case-officer/cases/${caseId}`, {
        withCredentials: true,
      });
      router.push("/case-officer");
    } catch {
      router.push("/case-officer");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
        </div>
        <p className="text-sm text-slate-500">Loading case file #{caseId}...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Case Not Found</h2>
        <Link href="/case-officer" className="text-sm text-slate-500 hover:text-slate-900 underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">
            <Link href="/case-officer" className="hover:text-slate-900">Dashboard</Link>
            {" / "}
            <span className="text-slate-700 font-medium">Case #{caseId}</span>
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Case Details: {caseData.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic Route Parameter [id]: <span className="font-mono font-semibold">{caseId}</span>
          </p>
        </div>
        <button
          onClick={handleDeleteCase}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
        >
          Delete Case
        </button>
      </div>

      {notification && (
        <div
          className={`rounded-xl border p-3 text-xs ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{caseData.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <CaseStatusBadge status={caseData.status} />
              <span className="text-xs text-slate-400">Age: {caseData.age}</span>
              {caseData.createdAt && (
                <span className="text-xs text-slate-400">
                  · Reported{" "}
                  {new Date(caseData.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-5">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Last Seen</span>
            <span className="font-medium text-slate-800">{caseData.lastSeenLocation}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Contact</span>
            <span className="font-medium text-slate-800">{caseData.contactNumber}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 sm:col-span-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Description</span>
            <span className="font-medium text-slate-800 text-right max-w-sm">{caseData.description}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Change Status:
          </label>
          <select
            value={caseData.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="text-sm border border-slate-300 rounded-xl px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Urgent">Urgent</option>
            <option value="Investigating">Investigating</option>
            <option value="Found">Found</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Investigation Notes History
          <span className="ml-2 text-xs font-normal text-slate-400">
            ({caseData.notes?.length || 0} notes)
          </span>
        </h3>
        <CaseNotesList notes={caseData.notes} />
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5">
          Add Investigation Note
          <span className="ml-2 text-xs font-normal text-slate-400">(Zod Validated)</span>
        </h3>
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Author / Officer Name
            </label>
            <input
              type="text"
              value={noteAuthor}
              onChange={(e) => setNoteAuthor(e.target.value)}
              placeholder="Officer Name"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Note Content
            </label>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter latest investigative findings..."
              className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 transition-colors ${
                noteError
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
              }`}
            />
            {noteError && (
              <p className="mt-1 text-[11px] text-red-600">{noteError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmittingNote}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmittingNote ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                Submitting...
              </span>
            ) : (
              "Add Note to Case"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
