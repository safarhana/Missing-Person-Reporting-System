import axios from "axios";
import { notFound } from "next/navigation";

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

  try {
    const response = await axios.get(
      `http://localhost:5000/volunteer/${id}`
    );

    const volunteer: Volunteer = response.data;

    return (
      <div>
        <h1>Volunteer Details</h1>

        <p>
          <strong>ID:</strong> {volunteer.id}
        </p>

        <p>
          <strong>Username:</strong> {volunteer.username}
        </p>

        <p>
          <strong>Full Name:</strong> {volunteer.fullName}
        </p>

        <p>
          <strong>Email:</strong> {volunteer.email}
        </p>

        <p>
          <strong>Phone:</strong> {volunteer.phone}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {volunteer.isActive ? "Active" : "Inactive"}
        </p>
      </div>
    );
  } catch (error) {
    notFound();
  }
}