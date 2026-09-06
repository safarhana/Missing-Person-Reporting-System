import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
      <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-900 border border-slate-300 flex items-center justify-center mb-4 text-xl font-bold">
        !
      </div>

      <h3 className="text-xl font-bold text-slate-900">Administrator Profile Not Found</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The user ID requested does not exist in operational database records or could not be retrieved.
      </p>

      <div className="mt-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          Back to User Directory
        </Link>
      </div>
    </div>
  );
}
