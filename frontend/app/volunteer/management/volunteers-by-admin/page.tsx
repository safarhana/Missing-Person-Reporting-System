"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ManagementSidebar from "../../components/managementSidebar";

type Volunteer = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export default function VolunteersByAdminPage() {
  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getVolunteersByAdmin = async () => {
     if (!adminId.trim()) {
      setError("Please enter Admin ID.");
      setVolunteers([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/volunteer/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/volunteer/admin/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Volunteers By Admin:", response.data);

      setVolunteers(response.data);
    } catch (error: any) {
      console.log(error);

      setVolunteers([]);

      if (error.response) {
        setError(
          error.response.data.message ||
          "Failed to get volunteers."
        );
      } else {
        setError("Cannot connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Management Sidebar */}
      <ManagementSidebar />

       <main className="flex-1 p-8">

        <h1 className="text-2xl font-bold">
          Volunteers By Admin
        </h1>

        <p className="mt-2">
          Enter an Admin ID to see the volunteers assigned to that admin.
        </p>

        <br />

         <label>
          Admin ID
        </label>

        <br />

        <input
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Enter Admin ID"
          className="border border-gray-400 p-2"
        />

        <br />
        <br />

        <button
          onClick={getVolunteersByAdmin}
          className="border border-gray-500 px-4 py-2"
        >
          Show Volunteers
        </button>

        <br />
        <br />

        
        {loading && (
          <p>Loading volunteers...</p>
        )}

       
        {error && (
          <p>{error}</p>
        )}
 
        {!loading &&
          !error &&
          adminId &&
          volunteers.length === 0 && (
            <p>No volunteers found for this admin.</p>
          )}

         {!loading && volunteers.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Assigned Volunteers
            </h2>

            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="border border-gray-400 p-4 mb-4"
              >
                <p>
                  <strong>ID:</strong> {volunteer.id}
                </p>

                <p>
                  <strong>Username:</strong> {volunteer.username}
                </p>

                <p>
                  <strong>Full Name:</strong> {volunteer.fullName}
                </p>

                <p>
                  <strong>Email:</strong> {volunteer.email}
                </p>

                <p>
                  <strong>Phone:</strong> {volunteer.phone}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {volunteer.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}