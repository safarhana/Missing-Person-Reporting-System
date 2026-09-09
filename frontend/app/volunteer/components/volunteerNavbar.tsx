"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VolunteerNavbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("volunteer");

    alert("Logged out successfully!");

    router.push("/volunteer/login");
  };

  return (
    <nav className="text-black shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Website Name */}
        <div>
          <h2 className="text-2xl font-bold">
            Volunteer Portal
          </h2>
          <p className="text-sm ">
            Volunteer Management System
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">

          <Link
            href="/volunteer/dashboard"
            className="px-4 py-2 rounded-lg transition"
          >
            Dashboard
          </Link>

          <Link
            href="/volunteer/updateinformation"
            className="px-4 py-2 rounded-lg transition"
          >
            Update Information
          </Link>

          <Link
            href="/volunteer/delete"
            className="px-4 py-2 rounded-lg transition"
          > 
            Delete Account
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}
