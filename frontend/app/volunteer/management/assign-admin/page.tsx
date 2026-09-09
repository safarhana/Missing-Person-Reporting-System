"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ManagementSidebar from "../../components/managementSidebar";

export default function AssignAdminPage() {
  const router = useRouter();

  const [volunteerId, setVolunteerId] = useState("");
  const [adminId, setAdminId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const assignAdmin = async () => {
    // Check Volunteer ID
    if (!volunteerId.trim()) {
      setError("Please enter Volunteer ID.");
      setMessage("");
      return;
    }

    // Check Admin ID
    if (!adminId.trim()) {
      setError("Please enter Admin ID.");
      setMessage("");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/volunteer/login");
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/volunteer/${volunteerId}/admin/${adminId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Assign Admin Response:", response.data);

      setMessage("Admin assigned successfully.");
      setError("");

      setVolunteerId("");
      setAdminId("");

    } catch (error: any) {
      console.log(error);

      setMessage("");

      if (error.response) {
        setError(
          error.response.data.message ||
          "Failed to assign admin."
        );
      } else {
        setError("Cannot connect to backend.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Left Sidebar */}
      <ManagementSidebar />

      {/* Right Side - Assign Admin */}
      <main className="flex-1 p-8">

        <h1 className="text-2xl font-bold">
          Assign Admin
        </h1>

        <p className="mt-2">
          Assign an admin to a volunteer.
        </p>

        <br />

        {/* Volunteer ID */}
        <label>
          Volunteer ID
        </label>

        <br />

        <input
          type="text"
          value={volunteerId}
          onChange={(e) => setVolunteerId(e.target.value)}
          placeholder="Enter Volunteer ID"
          className="border border-gray-400 p-2"
        />

        <br />
        <br />

        {/* Admin ID */}
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
          onClick={assignAdmin}
          className="border border-gray-500 px-4 py-2"
        >
          Assign Admin
        </button>

        <br />
        <br />

        {/* Success message */}
        {message && (
          <p>{message}</p>
        )}

        {/* Error message */}
        {error && (
          <p>{error}</p>
        )}

      </main>

    </div>
  );
}