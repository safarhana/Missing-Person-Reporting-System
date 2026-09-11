import Link from "next/link";

type VolunteerCardProps = {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    isActive : boolean;
};

export default function VolunteerCard({
    id,
    fullName,
    email,
    phone,
    isActive
}: VolunteerCardProps) {
    return (
      <article className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="card-body">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Volunteer #{id}</p>
              <h3 className="mt-1 text-xl font-bold">{fullName || "Name not provided"}</h3>
            </div>
            <span className={`badge ${isActive ? "badge-success" : "badge-ghost"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-sm text-base-content/70">
            <p>{email || "Email not provided"}</p>
            <p>{phone || "Phone not provided"}</p>
          </div>
          <div className="card-actions mt-4 justify-end">
            <Link className="btn btn-primary btn-sm" href={`/volunteer/${id}`}>
              View Details
            </Link>
          </div>
        </div>
      </article>
    );
}
