import VolunteerNav from "./components/volunteerNavbar";
import VolunteerCard from "./components/volunteerCard";

const volunteers = [
  {
    id: "volunteer_08",
    fullName: "Rahim Ahmed",
    email: "rahim@gmail.com",
    phone: "01711111111",
    status: "Deactive",
  },
  {
    id: "volunteer_09",
    fullName: "Karim Hasan",
    email: "karim@gmail.com",
    phone: "01822222222",
    status: "Active",
  },
  {
    id: "volunteer_10",
    fullName: "Sakib Khan",
    email: "sakib@gmail.com",
    phone: "01933333333",
    status: "Active",
  },
];

export default function VolunteerHome() {
  return (
    <div>
      <VolunteerNav />
      <br />

      <main>
        <p>
          Welcome to our Volunteer Management System.
        </p>
        <br />
        <h2>Our Volunteers</h2>

        {volunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            id={volunteer.id}
            fullName={volunteer.fullName}
            email={volunteer.email}
            phone={volunteer.phone}
            status={volunteer.status}
          />
        ))}
      </main>
    </div>
  );
}