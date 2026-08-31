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
    <div>
      <header>
        <nav>
          <Link href="/admin/users">← Back to User Directory</Link>
        </nav>
        <h1>User Profile</h1>
        <p>User details for ID #{id}</p>
      </header>

      <hr />

      <main>
        <table border={1} cellPadding={8} cellSpacing={0}>
          <tbody>
            <tr>
              <th>User ID</th>
              <td>{id}</td>
            </tr>
            <tr>
              <th>Full Name</th>
              <td>{userDetails.name}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{userDetails.role}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{userDetails.status}</td>
            </tr>
            <tr>
              <th>Email Address</th>
              <td>{userDetails.email}</td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>{userDetails.phone}</td>
            </tr>
            <tr>
              <th>Date Joined</th>
              <td>{userDetails.joined}</td>
            </tr>
            <tr>
              <th>Cases Managed</th>
              <td>{userDetails.casesAssigned}</td>
            </tr>
          </tbody>
        </table>
      </main>

      <hr />

      <footer>
        <p>&copy; {new Date().getFullYear()} Missing Person Reporting System. User Profiler.</p>
      </footer>
    </div>
  );
}