"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminCard from "./components/AdminCard";
import { getAuthToken, getStoredUsername } from "./utils/validation";
import { getAdminByUsername, getAllAdmins, AdminUser } from "./services/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    const savedUser = getStoredUsername();

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (savedUser) {
      setUsername(savedUser);
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        if (savedUser) {
          try {
            const adminData = await getAdminByUsername(savedUser);
            setProfile(adminData);
          } catch (e) {
            console.warn("Could not fetch individual admin profile, displaying session defaults", e);
          }
        }

        try {
          const allAdmins = await getAllAdmins(token);
          setAdminCount(allAdmins.length);
        } catch (e) {
          console.warn("Could not fetch total admin count", e);
        }
      } catch (err: any) {
        setFetchError("Unable to retrieve complete dashboard telemetry.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
        </div>
        <p className="text-sm text-slate-500">Loading Administrator Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white border border-white/30 backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
              Admin Session Active
            </span>
            <span className="text-xs text-pink-100">• ID #{profile?.id || "Session"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {profile?.fullName || username || "Administrator"}
          </h1>
          <p className="mt-1 text-sm text-pink-100 max-w-2xl">
            Overview of system administrators, supervised case officers, and assigned volunteers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-pink-700 hover:bg-pink-50 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            Manage Administrators →
          </Link>
        </div>
      </div>

      {fetchError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          ⚠️ {fetchError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminCard
          title="Administrators"
          value={adminCount || 1}
          subtitle="Registered admin accounts"
          badge="Active"
          badgeType="info"
        />

        <AdminCard
          title="Account Status"
          value={profile?.isActive ? "Active" : "Active"}
          subtitle="Admin privileges active"
          badge="Verified"
          badgeType="success"
        />

        <AdminCard
          title="Assigned Volunteers"
          value={profile?.volunteers?.length || 0}
          subtitle="Volunteers under supervision"
          badge="Assigned"
          badgeType="info"
        />

        <AdminCard
          title="Case Officers"
          value={profile?.caseOfficers?.length || 0}
          subtitle="Supervised case officers"
          badge="Supervised"
          badgeType="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdminCard
            title="Administrator Details"
            name={profile?.fullName || username || "Administrator"}
            role="Admin"
            subtitle={`Username: @${profile?.username || username}`}
            badge="Full Access"
            badgeType="success"
          >
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-pink-100">
                <span className="text-slate-500">Admin ID:</span>
                <span className="font-mono text-slate-900 font-medium">#{profile?.id || "1"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-pink-100">
                <span className="text-slate-500">Role:</span>
                <span className="font-medium text-pink-700">System Administrator</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-pink-100">
                <span className="text-slate-500">Realtime Alerts:</span>
                <span className="text-emerald-600 font-medium">Active</span>
              </div>
              <div className="pt-2">
                <Link
                  href={`/admin/users/${profile?.id || 1}`}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-2 text-xs font-semibold border border-pink-200 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-pink-100 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>Administration Modules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/admin/users"
                className="group p-4 rounded-xl bg-pink-50/40 border border-pink-100 hover:border-pink-300 hover:bg-pink-50/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-800 group-hover:text-pink-600 transition-colors">
                      Administrator Directory
                    </span>
                    <span className="text-xs text-pink-500">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Search by name, view profiles, update account status, and manage system admins.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-pink-600 font-medium">
                  Manage Administrators
                </div>
              </Link>

              <Link
                href="/admin/volunteers"
                className="group p-4 rounded-xl bg-pink-50/40 border border-pink-100 hover:border-pink-300 hover:bg-pink-50/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-800 group-hover:text-pink-600 transition-colors">
                      Volunteer Management
                    </span>
                    <span className="text-xs text-pink-500">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Assign field volunteers to your supervision and manage active rosters.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-pink-600 font-medium">
                  Supervise Volunteers
                </div>
              </Link>

              <Link
                href="/admin/case-officers"
                className="group p-4 rounded-xl bg-pink-50/40 border border-pink-100 hover:border-pink-300 hover:bg-pink-50/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-800 group-hover:text-pink-600 transition-colors">
                      Case Officer Supervision
                    </span>
                    <span className="text-xs text-pink-500">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Link case officers to administrative supervision and oversee case assignments.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-pink-600 font-medium">
                  Supervise Case Officers
                </div>
              </Link>

              <Link
                href="/admin/register"
                className="group p-4 rounded-xl bg-pink-50/40 border border-pink-100 hover:border-pink-300 hover:bg-pink-50/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-800 group-hover:text-pink-600 transition-colors">
                      Register Administrator
                    </span>
                    <span className="text-xs text-pink-500">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Create and onboard a new administrator account with validation and email notification.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-pink-600 font-medium">
                  Add Administrator
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}