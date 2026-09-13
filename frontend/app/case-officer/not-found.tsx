import Link from "next/link";

export default function CaseOfficerNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-slate-100 border border-slate-300 px-4 py-2 mb-4 text-slate-900 font-bold text-lg">
        404
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        Case or Resource Not Found
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        The case file, officer profile, or route you are looking for does not
        exist or may have been removed from the system.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/case-officer"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
        >
          Return to Dashboard
        </Link>
        <Link
          href="/case-officer/login"
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
