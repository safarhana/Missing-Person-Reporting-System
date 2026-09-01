"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "./components/AdminCard";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(sessionStorage.getItem("token"));
    }
    return false;
  });

  const [username] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("username") || "Admin";
    }
    return "Admin";
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Missing Person Reporting System, {username}.</p>

      <AdminCard
        name={username}
        role="Administrator"
      />

      <h2>Admin Tasks</h2>
      <ul>
        <li>Manage volunteers</li>
        <li>Manage missing person reports</li>
        <li>Monitor case officers</li>
        <li>Manage system users</li>
      </ul>

      <br />
      <button onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}