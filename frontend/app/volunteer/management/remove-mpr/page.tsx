"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ManagementSidebar from "../../components/managementSidebar";

export default function RemoveMprPage() {
  const router = useRouter();

  const [volunteerId, setVolunteerId] = useState("");
  const [mprId, setMprId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const removeMpr = async () => {
    // Check Volunteer ID
    if (!volunteerId.trim()) {
      setError("Please enter Volunteer ID.");
      setMessage("");
      return;
    }

    // Check MPR ID
    if (!mprId.trim()) {
      setError("Please enter Missing Person Reporter (MPR) ID.");
      setMessage("");
      return;
    }

    // Confirmation popup
    const confirmed = window.confirm(
      "Are you sure you want to remove this reporter from this volunteer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/volunteer/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/volunteer/${volunteerId}/mpr/${mprId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Remove MPR Response:", response.data);

      setMessage("Missing person reporter removed successfully.");
      setError("");

      // Clear input fields
      setVolunteerId("");
      setMprId("");
    } catch (error: any) {
      console.log(error);

      setMessage("");

      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to remove missing person reporter."
        );
      } else {
        setError("Cannot connect to backend.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Management Sidebar */}
      <ManagementSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Remove Missing Person Reporter</h1>

        <p className="mt-2">
          Remove an assigned missing person reporter from a volunteer.
        </p>

        <br />

        {/* Volunteer ID */}
        <label>Volunteer ID</label>

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

        {/* MPR ID */}
        <label>Reporter (MPR) ID</label>

        <br />

        <input
          type="text"
          value={mprId}
          onChange={(e) => setMprId(e.target.value)}
          placeholder="Enter MPR ID"
          className="border border-gray-400 p-2"
        />

        <br />
        <br />

        <button
          onClick={removeMpr}
          className="border border-gray-500 px-4 py-2"
        >
          Remove Reporter
        </button>

        <br />
        <br />

        {/* Success message */}
        {message && <p className="text-600">{message}</p>}

        {/* Error message */}
        {error && <p className="text-600">{error}</p>}
      </main>
    </div>
  );
}