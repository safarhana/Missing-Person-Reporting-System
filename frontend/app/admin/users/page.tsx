import Link from "next/link";

export default function UsersPage() {
  const users = [
    { id: "1", name: "User 1", role: "Case Officer", email: "officer1@mprs.com" },
    { id: "2", name: "User 2", role: "Volunteer", email: "volunteer2@mprs.com" },
    { id: "3", name: "User 3", role: "Volunteer", email: "volunteer3@mprs.com" },
  ];

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="header-container">
          <div className="header-brand">
            <Link href="/admin" className="brand-icon" style={{ textDecoration: "none" }}>
              ←
            </Link>
            <div className="brand-title-wrap">
              <span className="brand-name">MPRS System Users</span>
              <p className="brand-sub">User Directory</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="admin-btn admin-btn-secondary btn-small"
            style={{ textDecoration: "none" }}
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="admin-main admin-main-narrow">
        <div>
          <Link href="/admin" className="back-link">
            ← Back to Dashboard
          </Link>
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">System Users</h1>
            <p className="dashboard-subtitle">Review, monitor, and inspect registered system user roles and statuses.</p>
          </div>
        </div>

        <div className="directory-list">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="user-row-card"
            >
              <div className="user-row-info">
                <div className="user-row-avatar">
                  {user.name.charAt(0)}{user.id}
                </div>
                <div>
                  <h3 className="user-meta-name">{user.name}</h3>
                  <div className="user-meta-details">
                     <span>{user.email}</span>
                     <span className="meta-divider"></span>
                     <span className="meta-role">{user.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="user-row-action">
                <span>View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="admin-footer">
        &copy; {new Date().getFullYear()} Missing Person Reporting System. Admin Directory.
      </footer>
    </div>
  );
}