export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-6 text-center">
      <div className="card max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="font-semibold text-primary">Volunteer Portal</p>
          <h1 className="card-title justify-center text-3xl">Volunteer not found</h1>
          <p className="text-base-content/60">The volunteer you are looking for does not exist.</p>
        </div>
      </div>
    </div>
  );
}