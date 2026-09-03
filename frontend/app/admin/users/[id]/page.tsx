"use client";

import { use, useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminById, updateAdmin, updateAdminStatus, deleteAdmin, AdminUser } from "../../services/api";
import { updateAdminSchema } from "../../utils/validation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editStatus, setEditStatus] = useState(true);
  const [editErrors, setEditErrors] = useState<{ fullName?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const fetchAdminDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminById(id);
      setAdmin(data);
      setEditFullName(data.fullName || "");
      setEditStatus(data.isActive ?? true);
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? `Administrator ID #${id} not found in database records.`
          : "Unable to retrieve administrator profile from backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!admin) return;

    setEditErrors({});
    setUpdateMessage(null);

    const result = updateAdminSchema.safeParse({
      fullName: editFullName,
      password: editPassword || undefined,
      isActive: editStatus,
    });

    if (!result.success) {
      const formatted: { fullName?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "fullName") formatted.fullName = issue.message;
        if (issue.path[0] === "password") formatted.password = issue.message;
      });
      setEditErrors(formatted);
      return;
    }

    setIsSubmitting(true);
    try {
      const updatePayload: { username: string; fullName: string; isActive: boolean; password?: string } = {
        username: admin.username,
        fullName: editFullName,
        isActive: editStatus,
        ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
      };

      const updated = await updateAdmin(admin.username, updatePayload);

      setAdmin(updated);
      setIsEditOpen(false);
      setUpdateMessage("Profile updated successfully!");
      setEditPassword("");
    } catch (err: any) {
      setUpdateMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!admin) return;
    try {
      const newStatus = !admin.isActive;
      await updateAdminStatus(admin.username, newStatus);
      setAdmin({ ...admin, isActive: newStatus });
    } catch (err: any) {
      alert("Failed to toggle status");
    }
  };

  const handleDelete = async () => {
    if (!admin) return;
    if (!confirm(`Permanently remove administrator @${admin.username}?`)) return;
    try {
      await deleteAdmin(admin.username);
      router.push("/admin/users");
    } catch (err: any) {
      alert("Failed to delete administrator");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <p className="text-xs text-slate-400">Fetching dynamic profile for ID #{id}...</p>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-slate-900/90 p-8 text-center max-w-lg mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 mb-3">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white">Administrator Record Missing</h2>
        <p className="mt-1 text-xs text-slate-400">{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/admin/users"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            ← Back to Directory
          </Link>
          <button
            onClick={fetchAdminDetails}
            className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/admin" className="hover:text-pink-600 transition-colors">
          Admin
        </Link>
        <span>/</span>
        <Link href="/admin/users" className="hover:text-pink-600 transition-colors">
          User Directory
        </Link>
        <span>/</span>
        <span className="text-pink-600 font-medium">Profile #{id}</span>
      </div>

      {updateMessage && (
        <div className="rounded-xl bg-pink-50 border border-pink-200 p-3 text-xs text-pink-700 flex justify-between items-center">
          <span>{updateMessage}</span>
          <button onClick={() => setUpdateMessage(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      <div className="rounded-2xl border border-pink-100 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pink-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-pink-600 flex items-center justify-center text-white text-2xl font-black shadow-xs">
              {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {admin.fullName}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                    admin.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {admin.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-pink-600 font-mono mt-0.5">@{admin.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 sm:flex-initial rounded-xl bg-pink-600 hover:bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={handleToggleStatus}
              className="rounded-xl bg-white hover:bg-pink-50 border border-pink-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              title="Toggle status"
            >
              {admin.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-2 text-xs font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <div className="rounded-xl bg-pink-50/40 p-4 border border-pink-100 space-y-3 text-xs text-slate-600">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Account Details
            </h3>
            <div className="flex justify-between py-1 border-b border-pink-100">
              <span className="text-slate-500">Admin ID:</span>
              <span className="font-mono text-slate-900 font-medium">#{admin.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-pink-100">
              <span className="text-slate-500">Username:</span>
              <span className="font-mono text-pink-700 font-medium">@{admin.username}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-pink-100">
              <span className="text-slate-500">Role:</span>
              <span className="text-slate-900 font-medium">System Administrator</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Status:</span>
              <span className={admin.isActive ? "text-emerald-700 font-semibold" : "text-slate-500 font-semibold"}>
                {admin.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-pink-50/40 p-4 border border-pink-100 space-y-3 text-xs text-slate-600">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Personnel
            </h3>
            <div className="flex justify-between py-1 border-b border-pink-100">
              <span className="text-slate-500">Assigned Volunteers:</span>
              <span className="font-bold text-slate-900">{admin.volunteers?.length || 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-pink-100">
              <span className="text-slate-500">Supervised Case Officers:</span>
              <span className="font-bold text-slate-900">{admin.caseOfficers?.length || 0}</span>
            </div>
            <div className="pt-2 flex gap-2">
              <Link
                href="/admin/volunteers"
                className="flex-1 text-center py-1.5 rounded-lg bg-white hover:bg-pink-50 border border-pink-200 text-[11px] font-medium text-pink-700 transition-colors shadow-xs"
              >
                Manage Volunteers →
              </Link>
              <Link
                href="/admin/case-officers"
                className="flex-1 text-center py-1.5 rounded-lg bg-white hover:bg-pink-50 border border-pink-200 text-[11px] font-medium text-pink-700 transition-colors shadow-xs"
              >
                Manage Officers →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-pink-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-pink-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Edit Profile — @{admin.username}
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full rounded-xl bg-white border border-pink-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
                {editErrors.fullName && (
                  <p className="mt-1 text-rose-600">{editErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white border border-pink-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
                {editErrors.password && (
                  <p className="mt-1 text-rose-600">{editErrors.password}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modalStatus"
                  checked={editStatus}
                  onChange={(e) => setEditStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="modalStatus" className="text-slate-700">
                  Account is Active
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-pink-600 hover:bg-pink-500 text-white py-2 font-semibold shadow-xs transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}