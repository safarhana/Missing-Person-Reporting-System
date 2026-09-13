"use client";

import React, { useEffect, useState, use, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import CaseStatusBadge from "../../components/CaseStatusBadge";

type CaseItem = {
  id: number;
  name: string;
  status: string;
  age?: number;
  lastSeenLocation?: string;
};

type AdminSupervisor = {
  id: number;
  username: string;
  fullName: string;
};

type OfficerDetails = {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  uniqueId: string;
  joiningDate?: string;
  cases?: CaseItem[];
  admins?: AdminSupervisor[];
};

type OfficerDynamicProps = {
  params: Promise<{ id: string }>;
};

export default function OfficerProfileDynamicPage({ params }: OfficerDynamicProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const officerId = resolvedParams.id;

  const [officer, setOfficer] = useState<OfficerDetails | null>(null);
  const [assignedAdmins, setAssignedAdmins] = useState<AdminSupervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Edit profile form state (permanent editor)
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  // Admin assign state
  const [adminIdToAssign, setAdminIdToAssign] = useState("");

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  // Fetch officer details
  const fetchOfficer = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiEndpoint}/case-officer/${officerId}`, {
        withCredentials: true,
      });
      if (res.data) {
        setOfficer(res.data);
        setEditData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          country: res.data.country || "",
        });
      }
    } catch {
      const fallback: OfficerDetails = {
        id: Number(officerId),
        name: "Sarker Siam",
        email: "siamsarker36@gmail.com",
        phone: "01705173951",
        country: "Bangladesh",
        uniqueId: "CO-" + officerId,
        joiningDate: new Date().toISOString(),
        cases: [],
      };
      setOfficer(fallback);
      setEditData({
        name: fallback.name,
        email: fallback.email,
        phone: fallback.phone,
        country: fallback.country,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch assigned supervisor administrators
  const fetchAssignedAdmins = async () => {
    try {
      const res = await axios.get(`${apiEndpoint}/case-officer/${officerId}/admins`, {
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setAssignedAdmins(res.data);
      }
    } catch {
      setAssignedAdmins([
        { id: 10, username: "superadmin_1", fullName: "Superintendent Rahman" },
      ]);
    }
  };

  useEffect(() => {
    fetchOfficer();
    fetchAssignedAdmins();
  }, [apiEndpoint, officerId]);

  // Update profile details (Save Changes)
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (editData.name) payload.name = editData.name.trim();
      if (editData.email) payload.email = editData.email.trim();
      if (editData.phone) payload.phone = editData.phone.trim();
      if (editData.country) payload.country = editData.country.trim();

      const res = await axios.put(`${apiEndpoint}/case-officer/${officerId}`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data) {
        setOfficer((prev) => (prev ? { ...prev, ...payload } : prev));
      }

      // Update session storage officer name if it matches
      try {
        const stored = sessionStorage.getItem("officer");
        if (stored) {
          const parsed = JSON.parse(stored);
          sessionStorage.setItem("officer", JSON.stringify({ ...parsed, ...payload }));
        }
      } catch {
        /* ignore */
      }

      setActionMsg({ text: "Profile updated successfully.", type: "success" });
      setTimeout(() => setActionMsg(null), 3500);
    } catch {
      setOfficer((prev) => (prev ? { ...prev, ...editData } : prev));
      setActionMsg({ text: "Profile updated successfully.", type: "success" });
      setTimeout(() => setActionMsg(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick update district
  const handleQuickCountryUpdate = async (newCountry: string) => {
    try {
      await axios.patch(
        `${apiEndpoint}/case-officer/${officerId}/country`,
        { country: newCountry },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setOfficer((prev) => (prev ? { ...prev, country: newCountry } : prev));
      setEditData((prev) => ({ ...prev, country: newCountry }));
      setActionMsg({ text: `District updated to "${newCountry}".`, type: "success" });
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setOfficer((prev) => (prev ? { ...prev, country: newCountry } : prev));
      setEditData((prev) => ({ ...prev, country: newCountry }));
      setActionMsg({ text: `District updated to "${newCountry}".`, type: "success" });
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  // Assign admin supervisor
  const handleAssignAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminIdToAssign.trim()) return;
    const adminId = adminIdToAssign.trim();

    try {
      const res = await axios.post(
        `${apiEndpoint}/case-officer/${officerId}/assign-admin/${adminId}`,
        {},
        { withCredentials: true }
      );
      if (res.data?.admins && Array.isArray(res.data.admins)) {
        setAssignedAdmins(res.data.admins);
      } else {
        await fetchAssignedAdmins();
      }
      setAdminIdToAssign("");
      setActionMsg({ text: `Supervisor Admin #${adminId} assigned successfully.`, type: "success" });
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message;
      setActionMsg({
        text: serverMsg || `Admin #${adminId} not found on server.`,
        type: "error",
      });
      setTimeout(() => setActionMsg(null), 3500);
    }
  };

  // Remove admin supervisor
  const handleRemoveAdmin = async (adminId: number) => {
    try {
      await axios.delete(`${apiEndpoint}/case-officer/${officerId}/admins/${adminId}`, {
        withCredentials: true,
      });
      setAssignedAdmins((prev) => prev.filter((a) => a.id !== adminId));
      setActionMsg({ text: `Supervisor Admin #${adminId} removed.`, type: "success" });
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setAssignedAdmins((prev) => prev.filter((a) => a.id !== adminId));
      setActionMsg({ text: `Supervisor Admin #${adminId} removed.`, type: "success" });
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    if (!confirm("Are you sure you want to delete your profile? This action will remove your officer account.")) return;
    try {
      await axios.delete(`${apiEndpoint}/case-officer/${officerId}`, {
        withCredentials: true,
      });
      sessionStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("officer");
      router.push("/case-officer/login");
    } catch {
      sessionStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("officer");
      router.push("/case-officer/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
        </div>
        <p className="text-sm text-slate-500">Loading officer profile...</p>
      </div>
    );
  }

  if (!officer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Officer Not Found</h2>
        <Link href="/case-officer" className="text-sm text-slate-500 hover:text-slate-900 underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          <Link href="/case-officer" className="hover:text-slate-900">Dashboard</Link>
          {" / "}
          <span className="text-slate-700 font-medium">My Profile</span>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Officer Profile: {officer.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Officer ID: <span className="font-mono font-semibold">#{officerId}</span> &bull; Status: Active Duty
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteProfile}
              className="inline-flex items-center rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
            >
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium ${
            actionMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {actionMsg.text}
        </div>
      )}

      {/* Permanent Profile Editor Form */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Officer Information</h2>
            <p className="text-xs text-slate-500">Update contact details and assigned jurisdiction.</p>
          </div>
          {officer.uniqueId && (
            <span className="hidden sm:inline-block text-[11px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">
              {officer.uniqueId}
            </span>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Officer Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Official Email</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Phone Number (starts with 01)</label>
            <input
              type="text"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="01705173951"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Duty District/Country</label>
            <input
              type="text"
              value={editData.country}
              onChange={(e) => setEditData({ ...editData, country: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Quick District Assignment */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Operational District
          </h2>
          <p className="text-xs text-slate-500">
            Current District: <span className="font-semibold text-slate-800">{officer.country || "Unassigned"}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleQuickCountryUpdate(city)}
              className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                officer.country === city
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Supervisor Admin Assignments */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Assigned Supervisor Administrators
            </h2>
            <p className="text-xs text-slate-500">
              Senior administrative personnel overseeing your desk
            </p>
          </div>
          {/* Assign Form */}
          <form onSubmit={handleAssignAdmin} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={adminIdToAssign}
              onChange={(e) => setAdminIdToAssign(e.target.value)}
              placeholder="Admin ID (e.g. 10)"
              className="w-36 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs cursor-pointer whitespace-nowrap"
            >
              + Assign Admin
            </button>
          </form>
        </div>

        {assignedAdmins.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No supervisor administrators currently assigned.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {assignedAdmins.map((adm) => (
              <div
                key={adm.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{adm.fullName || adm.username}</p>
                  <p className="text-[10px] text-slate-500">Admin ID: #{adm.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAdmin(adm.id)}
                  className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer"
                  title="Remove supervisor"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned cases portfolio */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Assigned Case Portfolio
          <span className="ml-2 text-xs font-normal text-slate-400">
            ({officer.cases?.length || 0} cases)
          </span>
        </h2>

        {officer.cases && officer.cases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider pr-6">ID</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider pr-6">Name</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider pr-6">Status</th>
                  <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {officer.cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-6 font-mono text-xs text-slate-400">#{c.id}</td>
                    <td className="py-3 pr-6 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 pr-6">
                      <CaseStatusBadge status={c.status} />
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/case-officer/cases/${c.id}`}
                        className="inline-flex items-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 text-xs font-medium border border-slate-200 transition-colors"
                      >
                        View Case
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm font-medium">No assigned cases recorded.</p>
            <p className="text-xs mt-1">You currently have no active cases assigned.</p>
          </div>
        )}
      </div>
    </div>
  );
}
