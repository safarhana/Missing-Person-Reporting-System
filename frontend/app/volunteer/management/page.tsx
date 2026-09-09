"use client";

import VolunteerNav from "../components/volunteerNavbar";
import ManagementSidebar from "../components/managementSidebar";
import VolunteerCard from "../components/volunteerCard";
import axios from "axios";
import { useEffect, useState } from "react";

type Volunteer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  isActive : boolean;
};

export default function VolunteerHome() {

  // Store volunteers received from backend
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  // Store loading state
  const [loading, setLoading] = useState(true);

  // Store error message
  const [error, setError] = useState("");

  useEffect(() => {

    // Function to get volunteers from backend
    const getVolunteers = async () => {
      try {

        const response = await axios.get(
          "http://localhost:5000/volunteer"
        );

        // Put backend data into volunteers state
        setVolunteers(response.data);

      } catch (error) {

        console.log(error);
        setError("Failed to load volunteers");

      } finally {

        setLoading(false);
      }
    };

    getVolunteers();

  }, []);

  return (
    <div className="flex">
       <ManagementSidebar />

      <br />

      <main className="p-8">
         <h1 className="text-2xl font-bold">
          Volunteer Management
        </h1>
        <p className="mt-3">
          Select an operation from the sidebar.
        </p>

         
        <br />

        <h2>Our Volunteers</h2>

        {/* Loading message */}
        {loading && <p>Loading volunteers...</p>}

        {/* Error message */}
        {error && <p>{error}</p>}

        {/* Show volunteers */}
        {!loading && !error && volunteers.length === 0 && (
          <p>No volunteers found.</p>
        )}

        {volunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            id={volunteer.id}
            fullName={volunteer.fullName}
            email={volunteer.email}
            phone={volunteer.phone}
            isActive={volunteer.isActive}
          />
        ))}
      </main>
    </div>
  );
}
