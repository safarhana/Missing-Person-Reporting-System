import Link from "next/link";

export default function ManagementSidebar() {
  return (
    <aside className="w-full border-b border-base-300 bg-base-200 p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <h2 className="mb-4 text-xl font-bold text-primary lg:mb-6">
        Volunteer Management
      </h2>

      <nav className="grid grid-cols-2 gap-2 text-sm lg:flex lg:flex-col">

        <Link
          href="/volunteer/management"
          className="rounded-lg p-3 hover:bg-base-300"
        >
          Management Home
        </Link>

        <Link
          href="/volunteer/management/assign-admin"
          className="rounded-lg p-3 hover:bg-base-300"
        >
          Assign Admin
        </Link>

        <Link
          href="/volunteer/management/remove-admin"
          className="rounded-lg p-3 hover:bg-base-300"
        >
          Remove Admin
        </Link>

        <Link
          href="/volunteer/management/assign-mpr"
          className="rounded-lg p-3 hover:bg-base-300"
        >
          Assign MPR
        </Link>

        <Link
          href="/volunteer/management/remove-mpr"
          className="rounded-lg p-3 hover:bg-base-300"
        >
          Remove MPR
        </Link>

        <Link
          href="/volunteer/login"
          className="rounded-lg p-3 hover:bg-base-300"
        >
          Back to Login
        </Link>

      </nav>
    </aside>
  );
}