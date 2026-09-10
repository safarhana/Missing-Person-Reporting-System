export default function UsersLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
      <div className="h-10 bg-slate-100 rounded-xl w-full border border-slate-200"></div>
      <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-xs"></div>
    </div>
  );
}
