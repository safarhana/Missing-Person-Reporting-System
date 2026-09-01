import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Missing Person Reporting System</h1>
      <p>
        A centralized platform to report, track, and manage missing person cases effectively.
      </p>
      <hr />

      <section>
        <h2>For Case Officers</h2>
        <p>
          Investigate assigned cases, log notes, update status, and manage missing person files.
        </p>
        <div>
          <Link href="/case-officer/login">Officer Login</Link>
          {" | "}
          <Link href="/case-officer/register">Officer Register</Link>
          {" | "}
          <Link href="/case-officer">Go to Dashboard</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>For Reporters</h2>
        <p>
          Report a missing person and track your submissions easily.
        </p>
        <div>
          <Link href="/case-officer/login">Login</Link>
          {" | "}
          <Link href="/case-officer/register">Register</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>For Authorities</h2>
        <p>
          Admin portal for system management.
        </p>
        <div>
          <Link href="/admin/login">Admin Login</Link>
          {" | "}
          <Link href="/admin/register">Admin Register</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>For Volunteers</h2>
        <p>
          Community search and rescue portal.
        </p>
        <div>
          <Link href="/case-officer/login">Volunteer Login</Link>
          {" | "}
          <Link href="/case-officer/register">Volunteer Register</Link>
        </div>
      </section>
    </main>
  );
}
