import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-pink-50 border border-pink-200 px-4 py-2 mb-4 text-pink-700 font-bold text-lg">
        404
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        The admin route or management resource you are looking for does not exist or has been relocated.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-pink-500 transition-colors"
        >
          Return to Dashboard
        </Link>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-pink-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-pink-50 transition-colors shadow-xs"
        >
          View User Directory
        </Link>
      </div>
    </div>
  );
}
