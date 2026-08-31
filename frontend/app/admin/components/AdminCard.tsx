type AdminCardProps = {
  name: string;
  role: string;
};

export default function AdminCard({ name, role }: AdminCardProps) {
  return (
    <fieldset>
      <legend>Admin Profile</legend>
      <p><strong>Username:</strong> {name || "Admin User"}</p>
      <p><strong>Role:</strong> {role || "Administrator"}</p>
    </fieldset>
  );
}