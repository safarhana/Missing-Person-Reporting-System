export default function CaseOfficerLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute h-full w-full rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
        <div className="h-4 w-4 rounded-full bg-slate-900"></div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-slate-800 animate-pulse">
          Loading Case Officer Console...
        </p>
        <p className="text-xs text-slate-500">
          Communicating with MPRS backend services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-6 animate-pulse">
        <div className="h-24 bg-white rounded-2xl border border-slate-200 shadow-xs"></div>
        <div className="h-24 bg-white rounded-2xl border border-slate-200 shadow-xs"></div>
        <div className="h-24 bg-white rounded-2xl border border-slate-200 shadow-xs"></div>
      </div>
    </div>
  );
}
