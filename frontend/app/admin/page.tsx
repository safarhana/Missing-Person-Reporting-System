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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#f8fafc", color: "#0f172a" }}>
        <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="header-container">
          <div className="header-brand">
            <Link href="/" className="brand-icon">
              🔍
            </Link>
            <div className="brand-title-wrap">
              <span className="brand-name">MPRS Admin</span>
              <p className="brand-sub">Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="admin-btn admin-btn-danger btn-small"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome, {username || "Admin"}. Use the tools below to manage the system.</p>
        </div>

        <section className="dashboard-section">
          <h2 className="section-label">Profile Information</h2>
          <AdminCard name={username} role="Administrator" />
        </section>

        <section className="dashboard-section">
          <h2 className="section-label">System Tasks</h2>
          
          <div className="task-grid">
            <Link href="/admin/users" className="admin-card">
              <div className="admin-card-header">
                <div className="card-icon-wrap">
                  👥
                </div>
                <span className="card-arrow">
                  →
                </span>
              </div>
              <div className="card-body">
                <h3 className="card-title">Manage system users</h3>
                <p className="card-desc">Review accounts and view individual profiles.</p>
              </div>
            </Link>

            <div className="admin-card-disabled">
              <div className="card-icon-wrap">
                🤝
              </div>
              <div className="card-body">
                <h3 className="card-title">Manage volunteers</h3>
                <p className="card-desc">Verify credentials & coordinate tasks (Coming soon).</p>
              </div>
            </div>

            <div className="admin-card-disabled">
              <div className="card-icon-wrap">
                📋
              </div>
              <div className="card-body">
                <h3 className="card-title">Manage missing reports</h3>
                <p className="card-desc">Review new case submittals & logs (Coming soon).</p>
              </div>
            </div>

            <div className="admin-card-disabled">
              <div className="card-icon-wrap">
                📹
              </div>
              <div className="card-body">
                <h3 className="card-title">Monitor case officers</h3>
                <p className="card-desc">Audit logs, assign cases, and chat (Coming soon).</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="admin-footer">
        &copy; {new Date().getFullYear()} Missing Person Reporting System. Admin Dashboard.
      </footer>
    </div>
  );
}