import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl border border-pink-100 shadow-xl shadow-pink-100/60 p-8 sm:p-12 transition-all">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-semibold text-pink-700 mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
          </span>
          Official Portal
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          Missing Person Reporting System
        </h1>
        <p className="text-base text-slate-500 leading-relaxed mb-8">
          A centralized platform to report, track, and manage missing person cases effectively.
        </p>

        <hr className="border-0 border-t border-pink-100 mb-8" />

        <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/60 via-white to-rose-50/40 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="h-8 w-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">
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
            <h2 className="text-lg font-bold text-slate-900">For Authorities</h2>
          </div>

          <p className="text-sm text-slate-500 mb-5 ml-10.5">
            Admin portal for authorized personnel.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-200 hover:shadow-pink-300 transition-all active:scale-[0.99]"
            >
              Admin Login
            </Link>
            <Link
              href="/admin/register"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 hover:border-pink-300 shadow-xs transition-all active:scale-[0.99]"
            >
              Admin Register
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Missing Person Reporting System (MPRS) &bull; All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
