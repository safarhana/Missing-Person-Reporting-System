"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "./components/AdminCard";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const savedUsername = sessionStorage.getItem("username");

    if (!token) {
      // Redirect to login if not authenticated
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      if (savedUsername) {
        setUsername(savedUsername);
      }
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

      <p>Welcome to the Missing Person Reporting System, {username || "Admin"}.</p>

      <AdminCard
        name={username || "Admin"}
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
      <button 
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </main>
  );
}