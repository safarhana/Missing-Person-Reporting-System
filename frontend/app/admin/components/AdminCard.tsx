type AdminCardProps = {
  name: string;
  role: string;
};

export default function AdminCard({ name, role }: AdminCardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h3>Officer / Admin Profile</h3>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Role:</strong> {role}</p>
    </div>
  );
}