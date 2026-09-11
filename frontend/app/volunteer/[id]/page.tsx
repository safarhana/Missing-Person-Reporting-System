import axios from "axios";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusButton from "../components/statusButton";

type VolunteerDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

type Volunteer = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export const dynamic = "force-dynamic";

export default async function VolunteerDetails({
  params,
}: VolunteerDetailsProps) {

  const { id } = await params;
  let volunteer: Volunteer;

  try {
    const response = await axios.get(
      `http://localhost:5000/volunteer/${id}`
    );

    volunteer = response.data;
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
        <Link href="/volunteer/management" className="link link-primary">← Back to volunteers</Link>
        <div className="card mt-6 border border-base-300 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Volunteer #{volunteer.id}</p>
                <h1 className="mt-2 text-4xl font-bold">{volunteer.fullName}</h1>
                <p className="mt-1 text-base-content/60">@{volunteer.username}</p>
              </div>
             {/* <span className={`badge badge-lg ${volunteer.isActive ? "badge-success" : "badge-ghost"}`}>{volunteer.isActive ? "Active" : "Inactive"}</span> */}
            <StatusButton
              id={volunteer.id}
      initialStatus={volunteer.isActive}
            />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-base-200 p-4"><p className="text-sm text-base-content/60">Email</p><p className="mt-1 font-medium">{volunteer.email}</p></div>
              <div className="rounded-xl bg-base-200 p-4"><p className="text-sm text-base-content/60">Phone</p><p className="mt-1 font-medium">{volunteer.phone}</p></div>
            </div>
          </div>
        </div>
    </main>
  );
}