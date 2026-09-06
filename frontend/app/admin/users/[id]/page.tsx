"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getAdminById, updateAdmin, updateAdminStatus, deleteAdmin, AdminUser } from "../../services/api";
import { updateAdminSchema } from "../../utils/validation";

export default function UserDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = Array.isArray(routeParams.id) ? routeParams.id[0] : (routeParams.id as string);

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      setUpdateMessage(`Account status changed to ${newStatus ? 'Active' : 'Inactive'}.`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleDelete = async () => {
    if (!admin) return;
    setIsSubmitting(true);
    try {
      await deleteAdmin(admin.username);
      setShowDeleteModal(false);
      router.push("/admin/users");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete administrator");
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin"></div>
        <p className="text-xs text-slate-500">Fetching dynamic profile for ID #{id}...</p>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center max-w-lg mx-auto shadow-md">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600 mb-3 text-lg font-bold">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-900">Administrator Record Missing</h2>
        <p className="mt-1 text-xs text-slate-500">{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/admin/users"
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            ← Back to Directory
          </Link>
          <button
            onClick={fetchAdminDetails}
            className="rounded-xl bg-slate-100 border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
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
        <Link href="/admin" className="hover:text-slate-900 transition-colors">
          Admin
        </Link>
        <span>/</span>
        <Link href="/admin/users" className="hover:text-slate-900 transition-colors">
          User Directory
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Profile #{id}</span>
      </div>

      {updateMessage && (
        <div className="rounded-xl bg-slate-100 border border-slate-300 p-3 text-xs text-slate-800 flex justify-between items-center">
          <span>{updateMessage}</span>
          <button onClick={() => setUpdateMessage(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xs">
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
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-slate-100 text-slate-600 border-slate-300"
                  }`}
                >
                  {admin.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">@{admin.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 sm:flex-initial rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={handleToggleStatus}
              className="rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
              title="Toggle status"
            >
              {admin.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3 text-xs text-slate-600">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Account Details
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Admin ID:</span>
              <span className="font-mono text-slate-900 font-semibold">#{admin.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Username:</span>
              <span className="font-mono text-slate-900 font-semibold">@{admin.username}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
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

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3 text-xs text-slate-600">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Personnel
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Assigned Volunteers:</span>
              <span className="font-bold text-slate-900">{admin.volunteers?.length || 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Supervised Case Officers:</span>
              <span className="font-bold text-slate-900">{admin.caseOfficers?.length || 0}</span>
            </div>
            <div className="pt-2 flex gap-2">
              <Link
                href="/admin/volunteers"
                className="flex-1 text-center py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-semibold text-slate-800 transition-colors shadow-xs"
              >
                Manage Volunteers →
              </Link>
              <Link
                href="/admin/case-officers"
                className="flex-1 text-center py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-semibold text-slate-800 transition-colors shadow-xs"
              >
                Manage Officers →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Edit Profile — @{admin.username}
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
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
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  required
                />
                {editErrors.fullName && (
                  <p className="mt-1 text-red-600">{editErrors.fullName}</p>
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
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
                {editErrors.password && (
                  <p className="mt-1 text-red-600">{editErrors.password}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modalStatus"
                  checked={editStatus}
                  onChange={(e) => setEditStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="modalStatus" className="text-slate-700">
                  Account is Active
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2 font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && admin && (
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
              Are you sure you want to permanently delete administrator <strong className="text-slate-900">@{admin.username}</strong>?
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="btn btn-sm rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border-none font-medium px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="btn btn-sm rounded-xl bg-red-600 hover:bg-red-700 text-white border-none font-medium shadow-sm px-4 cursor-pointer"
              >
                {isSubmitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}