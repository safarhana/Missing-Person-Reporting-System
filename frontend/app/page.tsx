import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-slate-300/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-900/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 p-8 sm:p-12 transition-all">
        <div className="mb-6 flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded mr-2">
                CRITICAL ALERT
              </span>
              <span className="text-xs sm:text-sm font-medium text-red-900">
                Active Missing Person Inquiries in Progress
              </span>
            </div>
          </div>
          <div className="hidden sm:block text-xs font-semibold text-red-700 underline cursor-pointer hover:text-red-900">
            View Alerts
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 mb-4">
          <span className="h-2 w-2 rounded-full bg-slate-900"></span>
          Official Operations Portal
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          Missing Person Reporting System
        </h1>
        <p className="text-base text-slate-600 leading-relaxed mb-8">
          A centralized, secure infrastructure to report, broadcast, track, and resolve missing person cases with rapid multi-agency coordination.
        </p>

        <div className="mb-8 p-5 rounded-2xl border border-amber-200 bg-amber-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
              <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                Have Information or Sighted Someone?
              </h2>
            </div>
            <p className="text-xs text-amber-800">
              Every detail helps. Submit anonymous or verified sightings immediately to investigation teams.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-[0.99]"
          >
            Report a Sighting
          </button>
        </div>

        <hr className="border-0 border-t border-slate-200 mb-8" />

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">For Authorized Personnel</h2>
          </div>

          <p className="text-sm text-slate-500 mb-5 ml-10.5">
            Restricted access for Case Officers, Investigators, and System Administrators.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 transition-all active:scale-[0.99]"
            >
              Admin Sign In
            </Link>
            <Link
              href="/admin/register"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-all active:scale-[0.99]"
            >
              Admin Registration
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Missing Person Reporting System (MPRS) &bull; Official & Urgent Operations.
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Dispatch Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
