import Link from "next/link";

export default function ManagementSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-6">
        Volunteer Management
      </h2>

      <nav className="flex flex-col gap-2">

        <Link
          href="/volunteer/management"
          className="p-3 rounded hover:bg-gray-200"
        >
          Management Home
        </Link>

        <Link
          href="/volunteer/management/assign-admin"
          className="p-3 rounded hover:bg-gray-200"
        >
          Assign Admin
        </Link>

        <Link
          href="/volunteer/management/remove-admin"
          className="p-3 rounded hover:bg-gray-200"
        >
          Remove Admin
        </Link>

        <Link
          href="/volunteer/management/assign-mpr"
          className="p-3 rounded hover:bg-gray-200"
        >
          Assign MPR
        </Link>

        <Link
          href="/volunteer/management/remove-mpr"
          className="p-3 rounded hover:bg-gray-200"
        >
          Remove MPR
        </Link>

        <Link
          href="/volunteer/login"
          className="p-3 rounded hover:bg-gray-200"
        >
          Back to Login
        </Link>

      </nav>
    </aside>
  );
}