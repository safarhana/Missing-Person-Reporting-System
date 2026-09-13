"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminCard from "./components/AdminCard";
import { getAuthToken, getStoredUsername } from "./utils/validation";
import { getAdminByUsername, getAllAdmins, getAdminVolunteers, getAdminCaseOfficers, AdminUser } from "./services/api";

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
            let vols = adminData.volunteers;
            let officers = adminData.caseOfficers;
            if ((!vols || !officers) && adminData.id) {
              try {
                const [volsData, officersData] = await Promise.all([
                  getAdminVolunteers(adminData.id),
                  getAdminCaseOfficers(adminData.id),
                ]);
                vols = vols || volsData;
                officers = officers || officersData;
              } catch (e) {}
            }
            setProfile({
              ...adminData,
              volunteers: vols || [],
              caseOfficers: officers || [],
            });
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
          <div className="absolute h-full w-full rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
        </div>
        <p className="text-sm text-slate-500">Loading Administrator Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-200 border border-white/20 backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Admin Session Active
            </span>
            <span className="text-xs text-slate-300">• ID #{profile?.id || "Session"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {profile?.fullName || username || "Administrator"}
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Centralized operations for system administrators, case officers, and missing person search volunteers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            Manage Administrators →
          </Link>
        </div>
      </div>

      {fetchError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          ⚠️ {fetchError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminCard
          title="Administrators"
          value={isLoading ? "..." : adminCount}
          subtitle="Registered admin accounts"
          badge="Active"
          badgeType="info"
        />

        <AdminCard
          title="Account Status"
          value={profile?.isActive ? "Active" : "Inactive"}
          subtitle={profile?.isActive ? "Privileges active" : "Account deactivated"}
          badge={profile?.isActive ? "Verified" : "Inactive"}
          badgeType={profile?.isActive ? "success" : "danger"}
        />

        <AdminCard
          title="Assigned Volunteers"
          value={profile?.volunteers?.length || 0}
          subtitle="Search & field volunteers"
          badge="Assigned"
          badgeType="info"
        />

        <AdminCard
          title="Case Officers"
          value={profile?.caseOfficers?.length || 0}
          subtitle="Supervised investigation leads"
          badge="Supervised"
          badgeType="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdminCard
            title="Administrator Profile"
            name={profile?.fullName || username || "Administrator"}
            role="System Administrator"
            subtitle={`Username: @${profile?.username || username}`}
            badge="Full Access"
            badgeType="success"
          >
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Admin ID:</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {profile?.id ? `#${profile.id}` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-slate-900">Operations Admin</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Dispatch Alerts:</span>
                <span className="text-emerald-700 font-semibold">Active</span>
              </div>
              {profile?.id && (
                <div className="pt-2">
                  <Link
                    href={`/admin/users/${profile.id}`}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-2 text-xs font-semibold border border-slate-300 transition-colors"
                  >
                    View Account Profile
                  </Link>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>Operations Modules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/admin/users"
                className="group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                      Administrator Directory
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-700">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Search by name, view profiles, update account status, and manage system admins.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-800 font-semibold">
                  Manage Administrators
                </div>
              </Link>

              <Link
                href="/admin/volunteers"
                className="group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                      Volunteer Management
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-700">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Assign field volunteers to your supervision and coordinate search rosters.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-800 font-semibold">
                  Supervise Volunteers
                </div>
              </Link>

              <Link
                href="/admin/case-officers"
                className="group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                      Case Officer Supervision
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-700">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Link case officers to administrative oversight and monitor case assignments.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-800 font-semibold">
                  Supervise Case Officers
                </div>
              </Link>

              <Link
                href="/admin/register"
                className="group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                      Register Administrator
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-700">→</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Onboard an authorized administrative account with validation safeguards.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-800 font-semibold">
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