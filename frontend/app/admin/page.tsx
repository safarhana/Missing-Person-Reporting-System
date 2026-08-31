"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminCard from "./components/AdminCard";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const savedUsername = sessionStorage.getItem("username");

    if (!token) {
      router.push("/admin/login");
    } else {
      setTimeout(() => {
        setIsAuthenticated(true);
        if (savedUsername) {
          setUsername(savedUsername);
        }
      }, 0);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return (
      <main>
        <p>Verifying access...</p>
      </main>
    );
  }

  return (
    <div>
      <header>
        <nav>
          <Link href="/">🔍 Home</Link>
          {" | "}
          <button onClick={handleLogout}>Logout</button>
        </nav>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {username || "Admin"}. Use the links below to manage the system.</p>
      </header>

      <hr />

      <main>
        <section>
          <h2>Profile Information</h2>
          <AdminCard name={username} role="Administrator" />
        </section>

        <section>
          <h2>System Tasks</h2>
          <ul>
            <li>
              <Link href="/admin/users">
                <strong>Manage System Users</strong>
              </Link>
              {" - "}Review accounts and view individual profiles.
            </li>
            <li>
              <strong>Manage Volunteers</strong> - Verify credentials & coordinate tasks (Coming soon).
            </li>
            <li>
              <strong>Manage Missing Reports</strong> - Review new case submittals & logs (Coming soon).
            </li>
            <li>
              <strong>Monitor Case Officers</strong> - Audit logs, assign cases, and chat (Coming soon).
            </li>
          </ul>
        </section>
      </main>

      <hr />

      <footer>
        <p>&copy; {new Date().getFullYear()} Missing Person Reporting System. Admin Dashboard.</p>
      </footer>
    </div>
  );
}