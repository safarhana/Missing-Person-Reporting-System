import Link from "next/link";

export default function Home() {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">Missing Person Reporting System</h1>
        <p className="landing-desc">
          A centralized platform to report, track, and manage missing person cases effectively.
        </p>

        <hr className="landing-divider" />

        <div className="landing-section">
          <h2 className="landing-section-title dark">For Authorities</h2>
          <p className="landing-section-desc">
            Admin portal.
          </p>
          <div className="landing-btn-group">
            <Link href="/admin/login" className="landing-btn btn-auth-primary">
              Admin Login
            </Link>
            <Link href="/admin/register" className="landing-btn btn-auth-secondary">
              Admin Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
