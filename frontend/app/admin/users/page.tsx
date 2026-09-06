"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllAdmins, searchAdminsByName, updateAdminStatus, deleteAdmin, AdminUser } from "../services/api";
import { getAuthToken } from "../utils/validation";

export default function UsersDirectoryPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setMessage({
          text: "You are not signed in. Please sign in to view administrative records.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      const data = await getAllAdmins(token);
      if (Array.isArray(data)) {
        setAdmins(data);
      } else if (data) {
        setAdmins([data]);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.status === 401
          ? "Authentication required. Please sign in to view administrative records."
          : err.response?.data?.message || "Failed to load administrator records.";
      setMessage({
        text: errorMsg,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      if (!searchQuery.trim()) {
        await fetchAdmins();
      } else {
        const results = await searchAdminsByName(searchQuery.trim());
        if (Array.isArray(results)) {
          setAdmins(results);
        } else if (results) {
          setAdmins([results]);
        }
      }
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Search failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (username: string, currentStatus: boolean) => {
    setActionLoading(username);
    setMessage(null);
    try {
      await updateAdminStatus(username, !currentStatus);
      setAdmins((prev) =>
        prev.map((adm) => (adm.username === username ? { ...adm, isActive: !currentStatus } : adm))
      );
      setMessage({
        text: `Status for ${username} updated to ${!currentStatus ? "Active" : "Inactive"}.`,
        type: "success",
      });
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Failed to update administrator status.",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const requestDelete = (username: string) => {
    setAdminToDelete(username);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    setActionLoading(adminToDelete);
    setMessage(null);
    try {
      await deleteAdmin(adminToDelete);
      setAdmins((prev) => prev.filter((adm) => adm.username !== adminToDelete));
      setMessage({
        text: `Administrator ${adminToDelete} was permanently removed.`,
        type: "success",
      });
      setAdminToDelete(null);
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Failed to delete administrator.",
        type: "error",
      });
    } finally {
      setActionLoading(null);
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
            <span className="text-slate-900 font-semibold">Users</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Administrator Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrative personnel, credentials, and access credentials
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/register"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <span>+ Add Admin</span>
          </Link>
          <button
            onClick={fetchAdmins}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`alert rounded-xl p-3 text-xs flex items-center justify-between border ${
            message.type === "success"
              ? "alert-success bg-emerald-50 text-emerald-800 border-emerald-300"
              : "alert-error bg-red-50 text-red-700 border-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{message.text}</span>
            {message.type === "error" && message.text.includes("sign in") && (
              <Link
                href="/admin/login"
                className="underline font-semibold text-slate-900 hover:text-slate-700 ml-2"
              >
                Go to Sign In →
              </Link>
            )}
          </div>
          <button onClick={() => setMessage(null)} className="btn btn-ghost btn-xs text-slate-400 hover:text-slate-700 ml-2">
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search administrators by name..."
            className="input input-bordered w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-xs"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-sm rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors border-none cursor-pointer"
        >
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              fetchAdmins();
            }}
            className="btn btn-sm rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Clear
          </button>
        )}
      </form>

      <div className="card rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="table w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">Administrator</th>
                <th className="px-6 py-3.5">Username</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin"></div>
                      <span>Loading administrators...</span>
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                    No administrators found matching your search.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{admin.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <Link
                        href={`/admin/users/${admin.id}`}
                        className="hover:text-blue-900 transition-colors"
                      >
                        {admin.fullName || "Administrator"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-700">
                      @{admin.username}
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge badge-sm inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800 border border-slate-300">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(admin.username, admin.isActive)}
                        disabled={actionLoading === admin.username}
                        title="Click to toggle status"
                        className={`badge badge-sm inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border transition-all cursor-pointer ${
                          admin.isActive
                            ? "badge-success bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            admin.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        ></span>
                        {admin.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/users/${admin.id}`}
                        className="btn btn-xs rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800 border border-slate-300 transition-colors"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() => requestDelete(admin.username)}
                        disabled={actionLoading === admin.username}
                        className="btn btn-xs rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total Administrators: {admins.length}</span>
          <span className="text-[11px] text-slate-400">
            Click an administrator name or "View Profile" to see full details
          </span>
        </div>
      </div>

      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Administrator</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to permanently delete administrator <strong className="text-slate-900">@{adminToDelete}</strong>?
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAdminToDelete(null)}
                disabled={actionLoading === adminToDelete}
                className="btn btn-sm rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border-none font-medium px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={actionLoading === adminToDelete}
                className="btn btn-sm rounded-xl bg-red-600 hover:bg-red-700 text-white border-none font-medium shadow-sm px-4 cursor-pointer"
              >
                {actionLoading === adminToDelete ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}