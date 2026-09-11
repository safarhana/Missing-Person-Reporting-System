"use client";

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
    <div className="flex min-h-screen flex-col bg-base-200 lg:flex-row">
       <ManagementSidebar />
      <main className="flex-1 p-6 lg:p-12">
        <div className="mx-auto max-w-6xl">
         <p className="font-semibold text-primary">Coordinator workspace</p>
         <h1 className="mt-2 text-3xl font-bold">
          Volunteer Management
        </h1>
        <p className="mt-3 text-base-content/60">
          Select an operation from the sidebar.
        </p>
        <h2 className="mt-10 text-2xl font-bold">Our volunteers</h2>

        {loading && <div className="py-10"><span className="loading loading-spinner text-primary" /></div>}

        {error && <div className="alert alert-error mt-4">{error}</div>}

        {!loading && !error && volunteers.length === 0 && (
          <p className="mt-4 rounded-xl border border-dashed border-base-300 p-8 text-center text-base-content/60">No volunteers found.</p>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
        </div>
      </main>
    </div>
  );
}
