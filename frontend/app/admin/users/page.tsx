import Link from "next/link";

export default function UsersPage() {
  const users = [
    { id: "1", name: "User 1" },
    { id: "2", name: "User 2" },
    { id: "3", name: "User 3" },
  ];

  return (
    <div>
      <h1>Admin Users</h1>

      <p>List of users managed by the admin.</p>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:underline">
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}