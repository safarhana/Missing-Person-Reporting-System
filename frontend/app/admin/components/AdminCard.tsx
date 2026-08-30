type AdminCardProps = {
  name: string;
  role: string;
};

export default function AdminCard({ name, role }: AdminCardProps) {
  return (
    <div className="profile-card">
      <div className="profile-avatar">
        {name ? name.substring(0, 2).toUpperCase() : "AD"}
      </div>
      <div className="profile-details">
        <h3 className="profile-name">{name || "Admin User"}</h3>
        <div className="profile-badge">
          <span className="profile-badge-dot"></span>
          {role || "Administrator"}
        </div>
      </div>
    </div>
  );
}