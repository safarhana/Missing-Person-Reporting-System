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


      const response = await axios.get(
        `http://localhost:5000/volunteer/admin/${adminId}`,
        {
          withCredentials: true,
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
    <div className="flex min-h-screen flex-col bg-base-200 lg:flex-row">

      {/* Management Sidebar */}
      <ManagementSidebar />

       <main className="flex-1 p-6 lg:p-12">
        <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold">
          Volunteers By Admin
        </h1>

        <p className="mt-2 text-base-content/60">
          Enter an Admin ID to see the volunteers assigned to that admin.
        </p>

        <br />

         <label className="form-control mt-6 max-w-md">
          <span className="label-text">Admin ID</span>
        <input
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Enter Admin ID"
          className="input input-bordered mt-2 w-full"
        />
        </label>

        <button
          onClick={getVolunteersByAdmin}
          className="btn btn-primary mt-4"
        >
          Show Volunteers
        </button>

        <br />
        <br />

        
        {loading && (
          <div className="mt-6"><span className="loading loading-spinner text-primary" /></div>
        )}

       
        {error && (
          <div className="alert alert-error mt-6">{error}</div>
        )}
 
        {!loading &&
          !error &&
          adminId &&
          volunteers.length === 0 && (
            <p className="alert alert-info mt-6">No volunteers found for this admin.</p>
          )}

         {!loading && volunteers.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">
              Assigned Volunteers
            </h2>

            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="card mb-4 border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body grid gap-2 sm:grid-cols-2">
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
              </div>
            ))}
          </div>
        )}

        </div>
      </main>
    </div>
  );
}