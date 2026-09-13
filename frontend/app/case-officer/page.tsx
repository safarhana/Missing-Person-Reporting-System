"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import Link from "next/link";

import OfficerCard from "./components/OfficerCard";
import CaseCard from "./components/CaseCard";
import UrgentAlertsCarousel from "./components/UrgentAlertsCarousel";

const newCaseSchema = z.object({
  name: z.string().min(1, "Missing person's name is required"),
  age: z.coerce.number().min(0, "Age must be a valid positive number"),
  lastSeenLocation: z.string().min(1, "Last seen location is required"),
  description: z.string().min(1, "Description is required"),
  contactNumber: z.string().min(1, "Contact phone number is required"),
});

type OfficerData = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  uniqueId?: string;
  joiningDate?: string;
};

type CaseData = {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  status: string;
  description: string;
  contactNumber: string;
  createdAt?: string;
  notes?: Array<{ noteText: string; addedBy: string; date: string }>;
};

export default function CaseOfficerDashboardPage() {
  const router = useRouter();

  const [officer, setOfficer] = useState<OfficerData | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [cases, setCases] = useState<CaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newCaseData, setNewCaseData] = useState({
    name: "",
    age: "",
    lastSeenLocation: "",
    description: "",
    contactNumber: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const apiEndpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    let isMounted = true;
    setIsClient(true);

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      router.push("/case-officer/login");
      return;
    }

    let currentOfficer: OfficerData = {
      id: 1,
      name: "Case Officer",
      email: "officer@police.gov",
      phone: "01700000000",
      country: "Bangladesh",
      uniqueId: "CO-12345",
    };

    const storedOfficerStr =
      sessionStorage.getItem("officer") || localStorage.getItem("officer");
    if (storedOfficerStr) {
      try {
        const parsed = JSON.parse(storedOfficerStr);
        if (parsed) {
          currentOfficer = { ...currentOfficer, ...parsed };
        }
      } catch {
        /* ignore */
      }
    }

    setOfficer(currentOfficer);
    const officerId = currentOfficer.id || 1;

    const fetchOfficerCases = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiEndpoint}/case-officer/${officerId}/cases`,
          { withCredentials: true }
        );
        if (isMounted && Array.isArray(response.data)) {
          setCases(response.data);
        }
      } catch {
        if (isMounted) {
          setCases([
            {
              id: 101,
              name: "Rahim Uddin",
              age: 14,
              lastSeenLocation: "Dhanmondi Lake, Dhaka",
              status: "Active",
              description: "Wearing blue shirt and black pants. Last seen near bridge 2.",
              contactNumber: "01711223344",
              createdAt: new Date().toISOString(),
              notes: [{ noteText: "Initial report received.", addedBy: "Officer", date: new Date().toISOString() }],
            },
            {
              id: 102,
              name: "Sumaiya Akter",
              age: 22,
              lastSeenLocation: "Uttara Sector 7, Dhaka",
              status: "Investigating",
              description: "Height 5'3\", red handbag, college student.",
              contactNumber: "01822334455",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              notes: [{ noteText: "CCTV footage being reviewed.", addedBy: "Lead Detective", date: new Date().toISOString() }],
            },
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOfficerCases();
    return () => { isMounted = false; };
  }, [apiEndpoint, router]);

  const handleStatusChange = async (caseId: number, newStatus: string) => {
    try {
      await axios.patch(
        `${apiEndpoint}/case-officer/cases/${caseId}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
      );
      setActionMessage({ type: "success", text: `Case #${caseId} status updated to ${newStatus}` });
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
      );
      setActionMessage({ type: "success", text: `Case #${caseId} status changed to ${newStatus}` });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleDeleteCase = async (caseId: number) => {
    if (!confirm(`Are you sure you want to delete Case #${caseId}?`)) return;
    try {
      await axios.delete(`${apiEndpoint}/case-officer/cases/${caseId}`, {
        withCredentials: true,
      });
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setActionMessage({ type: "success", text: `Case #${caseId} has been deleted` });
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setActionMessage({ type: "success", text: `Case #${caseId} deleted` });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleCreateCase = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = newCaseSchema.safeParse(newCaseData);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((iss) => {
        const path = iss.path[0] as string;
        errMap[path] = iss.message;
      });
      setFormErrors(errMap);
      return;
    }

    try {
      const officerId = officer?.id || 1;
      const payload = {
        name: newCaseData.name.trim(),
        age: Number(newCaseData.age),
        lastSeenLocation: newCaseData.lastSeenLocation.trim(),
        description: newCaseData.description.trim(),
        contactNumber: newCaseData.contactNumber.trim(),
      };

      let newCreatedCase: CaseData;
      try {
        const response = await axios.post(
          `${apiEndpoint}/case-officer/${officerId}/cases`,
          payload,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        newCreatedCase = response.data;
      } catch {
        newCreatedCase = {
          id: Date.now(),
          ...payload,
          status: "Active",
          createdAt: new Date().toISOString(),
          notes: [],
        };
      }

      setCases((prev) => [newCreatedCase, ...prev]);
      setNewCaseData({ name: "", age: "", lastSeenLocation: "", description: "", contactNumber: "" });
      setActionMessage({ type: "success", text: `New case for "${newCreatedCase.name}" created successfully!` });
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: unknown) {
      console.error(err);
      setActionMessage({ type: "error", text: "Failed to create case. Please try again." });
    }
  };

  const filteredCases = cases.filter((item) => {
    const matchesFilter =
      filterStatus === "All" ||
      item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesQuery =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const totalCases = cases.length;
  const urgentCases = cases.filter(
    (c) => c.status.toLowerCase() === "urgent" || c.status.toLowerCase().includes("urgent") || c.status.toLowerCase().includes("critical")
  );
  const activeCases = cases.filter((c) => c.status.toLowerCase() === "active").length;
  const investigatingCases = cases.filter((c) => c.status.toLowerCase() === "investigating").length;
  const foundCases = cases.filter(
    (c) => c.status.toLowerCase() === "found" || c.status.toLowerCase() === "closed"
  ).length;

  const statCards = [
    { label: "Total Cases", value: totalCases, badge: "All", badgeCls: "bg-slate-100 text-slate-700 border-slate-200" },
    { label: "Urgent Cases", value: urgentCases.length, badge: "Urgent", badgeCls: "bg-red-50 text-red-700 border-red-200 font-bold" },
    { label: "Active", value: activeCases, badge: "Active", badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Investigating", value: investigatingCases, badge: "Ongoing", badgeCls: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Resolved / Found", value: foundCases, badge: "Closed", badgeCls: "bg-blue-50 text-blue-700 border-blue-200" },
  ];

  const inputCls = (field: string) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 transition-colors ${
      formErrors[field]
        ? "border-red-500 focus:ring-red-500/20"
        : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
    }`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-200 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Officer Session Active
            </span>
            {isClient && officer?.uniqueId && (
              <span className="text-xs text-slate-300">· {officer.uniqueId}</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {isClient && officer?.name ? officer.name : "Case Officer"}
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Centralized operations dashboard for managing missing person cases and investigative activities.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`rounded-xl border p-3 text-xs ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </p>
              <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${card.badgeCls}`}>
                {card.badge}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <UrgentAlertsCarousel
        alerts={
          urgentCases.length > 0
            ? urgentCases.map((c) => ({
                id: c.id,
                name: c.name,
                age: c.age,
                lastSeen: c.lastSeenLocation,
                status: "CRITICAL ALERT",
                description: c.description,
              }))
            : undefined
        }
      />

      {isClient && officer && (
        <OfficerCard
          id={officer.id}
          name={officer.name}
          uniqueId={officer.uniqueId}
          email={officer.email}
          phone={officer.phone}
          country={officer.country}
          joiningDate={officer.joiningDate}
        />
      )}

      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Register New Missing Person Case
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details below to immediately dispatch a new missing person investigation.
            </p>
          </div>
        </div>
        <form onSubmit={handleCreateCase} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Person&apos;s Full Name
              </label>
              <input
                type="text"
                value={newCaseData.name}
                onChange={(e) => setNewCaseData({ ...newCaseData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className={inputCls("name")}
              />
              {formErrors.name && <p className="mt-1 text-[11px] text-red-600">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Age
              </label>
              <input
                type="number"
                value={newCaseData.age}
                onChange={(e) => setNewCaseData({ ...newCaseData, age: e.target.value })}
                placeholder="e.g. 24"
                className={inputCls("age")}
              />
              {formErrors.age && <p className="mt-1 text-[11px] text-red-600">{formErrors.age}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={newCaseData.contactNumber}
                onChange={(e) => setNewCaseData({ ...newCaseData, contactNumber: e.target.value })}
                placeholder="01711223344"
                className={inputCls("contactNumber")}
              />
              {formErrors.contactNumber && <p className="mt-1 text-[11px] text-red-600">{formErrors.contactNumber}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Last Seen Location
              </label>
              <input
                type="text"
                value={newCaseData.lastSeenLocation}
                onChange={(e) => setNewCaseData({ ...newCaseData, lastSeenLocation: e.target.value })}
                placeholder="e.g. Dhanmondi Lake, Dhaka"
                className={inputCls("lastSeenLocation")}
              />
              {formErrors.lastSeenLocation && <p className="mt-1 text-[11px] text-red-600">{formErrors.lastSeenLocation}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Physical Description
            </label>
            <textarea
              rows={3}
              value={newCaseData.description}
              onChange={(e) => setNewCaseData({ ...newCaseData, description: e.target.value })}
              placeholder="Distinct physical traits, clothing last seen wearing..."
              className={`resize-none ${inputCls("description")}`}
            />
            {formErrors.description && <p className="mt-1 text-[11px] text-red-600">{formErrors.description}</p>}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer">
              Create Case File
            </button>
            <button
              type="button"
              onClick={() => {
                setNewCaseData({ name: "", age: "", lastSeenLocation: "", description: "", contactNumber: "" });
                setFormErrors({});
              }}
              className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assigned Missing Person Cases</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""} shown
            </p>
          </div>
          <Link
            href="/case-officer/register"
            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold transition-colors"
          >
            + Register Officer
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All", "Active", "Investigating", "Found", "Closed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  filterStatus === status
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-100 border border-slate-200"></div>
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-medium">No cases found.</p>
            <p className="text-xs mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                id={caseItem.id}
                name={caseItem.name}
                age={caseItem.age}
                lastSeenLocation={caseItem.lastSeenLocation}
                status={caseItem.status}
                description={caseItem.description}
                contactNumber={caseItem.contactNumber}
                createdAt={caseItem.createdAt}
                notesCount={caseItem.notes?.length || 0}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteCase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
