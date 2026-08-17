type AdminCardProps = {
  name: string;
  role: string;
};

export default function AdminCard({ name, role }: AdminCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Role: {role}</p>
    </div>
  );
}