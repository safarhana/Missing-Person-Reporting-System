type VolunteerDetailsProps = {
  params: Promise<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: string;
  }>;
};

export default async function VolunteerDetails({
  params,
}: VolunteerDetailsProps) {
  const { id,fullName,email,phone,status } = await params;

  return (
    <div>
      <h1>Volunteer Details</h1>

      <p>Volunteer ID: {id}</p>

      <p>Full Name: {fullName}</p>

      <p>Email: {email}</p>

      <p>Phone: {phone}</p>

      <p>Status: {status}</p>
    </div>
  );
}