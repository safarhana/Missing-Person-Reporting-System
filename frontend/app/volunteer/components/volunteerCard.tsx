import Link from "next/link";

type VolunteerCardProps = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
};

export default function VolunteerCard({
    id,
    fullName,
    email,
    phone,
}: VolunteerCardProps) {
    return(
        <div>
            <h3>{fullName}</h3>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <Link href={`/volunteer/${id}`}>
            View Details
            </Link>
        </div>
    )
}
