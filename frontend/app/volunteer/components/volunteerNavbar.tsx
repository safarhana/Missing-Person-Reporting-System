"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VolunteerNavbar() {
  const router = useRouter();

  const logout = () => {
    //localStorage.removeItem("token");
    localStorage.removeItem("volunteer");

    alert("Logged out successfully!");

    router.push("/volunteer/login");
  };

  return (
    <nav className="navbar border-b border-base-300 bg-base-100 shadow-sm">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="navbar-start">
          <Link href="/volunteer" className="text-lg font-bold text-primary sm:text-xl">
            <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-primary-content">V</span>
            Volunteer Portal
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <div className="dropdown dropdown-end sm:hidden">
            <button className="btn btn-ghost btn-square" aria-label="Open navigation menu">
              <span className="text-xl">☰</span>
            </button>
            <ul className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
              <li><Link href="/volunteer/dashboard">Dashboard</Link></li>
              <li><Link href="/volunteer/updateinformation">Update Information</Link></li>
              <li><Link href="/volunteer/delete">Delete Account</Link></li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <Link href="/volunteer/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
            <Link href="/volunteer/updateinformation" className="btn btn-ghost btn-sm">Update</Link>
            <Link href="/volunteer/delete" className="btn btn-ghost btn-sm">Delete Account</Link>
            <button onClick={logout} className="btn btn-primary btn-sm">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
