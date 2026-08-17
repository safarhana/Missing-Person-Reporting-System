import AdminCard from "./components/AdminCard";

export default function AdminPage() {
  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>Welcome to the Missing Person Reporting System.</p>

      <AdminCard
        name="Farhana"
        role="Administrator"
      />

      <h2>Admin Tasks</h2>

      <ul>
        <li>Manage volunteers</li>
        <li>Manage missing person reports</li>
        <li>Monitor case officers</li>
        <li>Manage system users</li>
      </ul>
    </main>
  );
}