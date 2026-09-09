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
    return(
        <div>
        <p>ID: {id}</p>
        <h3>{fullName}</h3>
        {/* <p>Email: {email}</p>
        <p>Phone: {phone}</p>
        <p>Status: {isActive ? "Active" : "Inactive"}</p> */}

      <Link href={`/volunteer/${id}`}>
        View Details
      </Link>

      <br />
        </div>
    )
}
