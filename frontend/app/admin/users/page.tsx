import Link from "next/link";

export default function UsersPage() {
  const users = [
    { id: "1", name: "User 1", role: "Case Officer", email: "officer1@mprs.com" },
    { id: "2", name: "User 2", role: "Volunteer", email: "volunteer2@mprs.com" },
    { id: "3", name: "User 3", role: "Volunteer", email: "volunteer3@mprs.com" },
  ];

  return (
    <div>
      <header>
        <nav>
          <Link href="/admin">← Dashboard</Link>
        </nav>
        <h1>System Users</h1>
        <p>User Directory & Verification</p>
      </header>

      <hr />

      <main>
        <table border={1} cellPadding={8} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Link href={`/admin/users/${user.id}`}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <hr />

      <footer>
        <p>&copy; {new Date().getFullYear()} Missing Person Reporting System. Admin Directory.</p>
      </footer>
    </div>
  );
}