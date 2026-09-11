export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Loading volunteer page</h2>
        <p className="mt-1 text-base-content/60">Please wait...</p>
      </div>
    </div>
  );
}