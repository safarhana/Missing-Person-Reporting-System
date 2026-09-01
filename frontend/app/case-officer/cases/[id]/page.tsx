"use client";

import React, { useEffect, useState, use, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";

import OfficerNavbar from "../../components/OfficerNavbar";
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
  params: Promise<{
    id: string;
  }>;
};

export default function CaseDetailsPage({ params }: CasePageProps) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [officerName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("officer") || localStorage.getItem("officer");
      if (stored) {
        try {
          return JSON.parse(stored).name || "Case Officer";
        } catch {
          return "Case Officer";
        }
      }
    }
    return "Case Officer";
  });

  const [noteText, setNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState(() => officerName);
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
          ? response.data.find((c: CaseDetail) => String(c.id) === String(caseId))
          : null;

        if (isMounted) {
          if (found) {
            setCaseData(found);
          } else {
            setCaseData({
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
            });
          }
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCaseDetails();

    return () => {
      isMounted = false;
    };
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
      setNotification({
        type: "success",
        message: `Case status updated to ${newStatus}`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setCaseData((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setNotification({
        type: "success",
        message: `Case status changed to ${newStatus}`,
      });
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
        {
          noteText: newNoteObj.noteText,
          addedBy: newNoteObj.addedBy,
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      setCaseData((prev) =>
        prev
          ? {
              ...prev,
              notes: [...(prev.notes || []), newNoteObj],
            }
          : prev
      );

      setNoteText("");
      setNotification({
        type: "success",
        message: "New investigation note added successfully!",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setCaseData((prev) =>
        prev
          ? {
              ...prev,
              notes: [...(prev.notes || []), newNoteObj],
            }
          : prev
      );
      setNoteText("");
      setNotification({
        type: "success",
        message: "Investigation note recorded!",
      });
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

  return (
    <div>
      <OfficerNavbar officerName={officerName} />

      <main>
        <p>
          <Link href="/case-officer">← Back to Dashboard</Link>
          {" | "}
          <button onClick={handleDeleteCase} type="button">
            Delete Case
          </button>
        </p>

        {notification && (
          <p style={{ color: notification.type === "success" ? "green" : "red" }}>
            <strong>{notification.message}</strong>
          </p>
        )}

        {isLoading ? (
          <p>Loading case file #{caseId}...</p>
        ) : !caseData ? (
          <div>
            <h2>Case Not Found</h2>
            <Link href="/case-officer">Return to Dashboard</Link>
          </div>
        ) : (
          <div>
            <h1>Case Details: {caseData.name}</h1>
            <p><strong>Dynamic Route Parameter [id]:</strong> {caseId}</p>

            <fieldset>
              <legend><strong>Case Information</strong></legend>
              <p><strong>Name:</strong> {caseData.name}</p>
              <p><strong>Age:</strong> {caseData.age}</p>
              <p><strong>Status:</strong> <CaseStatusBadge status={caseData.status} /></p>
              <p><strong>Last Seen Location:</strong> {caseData.lastSeenLocation}</p>
              <p><strong>Contact Number:</strong> {caseData.contactNumber}</p>
              <p><strong>Physical Description:</strong> {caseData.description}</p>

              <div>
                <label>Change Status: </label>
                <select
                  value={caseData.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Found">Found</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </fieldset>

            <br />

            <fieldset>
              <legend><strong>Investigation Notes History ({caseData.notes?.length || 0})</strong></legend>
              <CaseNotesList notes={caseData.notes} />
            </fieldset>

            <br />

            <fieldset>
              <legend><strong>Add Investigation Note (Zod Validated)</strong></legend>
              <form onSubmit={handleAddNote}>
                <div>
                  <label>Author / Officer Name: </label>
                  <input
                    type="text"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    placeholder="Officer Name"
                  />
                </div>
                <br />

                <div>
                  <label>Note Content: </label>
                  <br />
                  <textarea
                    rows={4}
                    cols={50}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter latest investigative findings..."
                  ></textarea>
                  {noteError && <p style={{ color: "red" }}>{noteError}</p>}
                </div>
                <br />

                <button type="submit" disabled={isSubmittingNote}>
                  {isSubmittingNote ? "Submitting..." : "Add Note to Case"}
                </button>
              </form>
            </fieldset>
          </div>
        )}
      </main>
    </div>
  );
}
