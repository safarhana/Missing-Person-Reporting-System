type UserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;

  return (
    <div>
      <h1>User Details</h1>

      <p>User ID: {id}</p>
    </div>
  );
}