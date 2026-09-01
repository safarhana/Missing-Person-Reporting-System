import Link from "next/link";

type VolunteerCardProps = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: string;
};

export default function VolunteerCard({
    id,
    fullName,
    email,
    phone,
    status
}: VolunteerCardProps) {
    return(
        <div>
            <h3>{fullName}</h3>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>Status: {status}</p>
            <Link href={`/volunteer/${id}`}>
            View Details
            </Link>
        </div>
    )
}
