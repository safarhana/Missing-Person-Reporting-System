import Link from "next/link";

type UserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;

  const userDetails = {
    "1": { name: "User 1", role: "Case Officer", email: "officer1@mprs.com", status: "Active", phone: "+880 1711-223344", joined: "Jan 12, 2026", casesAssigned: 8 },
    "2": { name: "User 2", role: "Volunteer", email: "volunteer2@mprs.com", status: "Active", phone: "+880 1812-998877", joined: "Feb 05, 2026", casesAssigned: 3 },
    "3": { name: "User 3", role: "Volunteer", email: "volunteer3@mprs.com", status: "Suspended", phone: "+880 1913-556677", joined: "Mar 22, 2026", casesAssigned: 0 }
  }[id] || { name: `Unknown User`, role: "Unassigned", email: "unknown@mprs.com", status: "Inactive", phone: "N/A", joined: "N/A", casesAssigned: 0 };

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="header-container">
          <div className="header-brand">
            <Link href="/admin/users" className="brand-icon" style={{ textDecoration: "none" }}>
              ←
            </Link>
            <div className="brand-title-wrap">
              <span className="brand-name">User Inspection</span>
              <p className="brand-sub">User Details</p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="admin-btn admin-btn-secondary btn-small"
            style={{ textDecoration: "none" }}
          >
            Back to Directory
          </Link>
        </div>
      </header>

      <main className="admin-main admin-main-narrow">
        <div>
          <Link href="/admin/users" className="back-link">
            ← Back to User Directory
          </Link>
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">User Profile</h1>
            <p className="dashboard-subtitle">Reviewing verification status and contact records for user #{id}.</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <div className="detail-avatar">
              {userDetails.name.charAt(0)}{id}
            </div>
            <div className="detail-header-info">
              <h2 className="detail-name">{userDetails.name}</h2>
              <div className="detail-badges">
                <span className="status-badge inactive">
                  {userDetails.role}
                </span>
                <span className={`status-badge ${
                  userDetails.status === "Active"
                    ? "active"
                    : userDetails.status === "Suspended"
                    ? "suspended"
                    : "inactive"
                }`}>
                  {userDetails.status}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <p className="detail-value">{userDetails.email}</p>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              <p className="detail-value">{userDetails.phone}</p>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date Joined</span>
              <p className="detail-value">{userDetails.joined}</p>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cases Managed</span>
              <p className="detail-value">{userDetails.casesAssigned} reports</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="admin-footer">
        &copy; {new Date().getFullYear()} Missing Person Reporting System. User Profiler.
      </footer>
    </div>
  );
}