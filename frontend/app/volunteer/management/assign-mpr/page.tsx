"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ManagementSidebar from "../../components/managementSidebar";

export default function AssignMprPage() {
  const router = useRouter();

  const [volunteerId, setVolunteerId] = useState("");
  const [mprId, setMprId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const assignMpr = async () => {
    // Check Volunteer ID
    if (!volunteerId.trim()) {
      setError("Please enter Volunteer ID.");
      setMessage("");
      return;
    }

    // Check MPR ID
    if (!mprId.trim()) {
      setError("Please enter MPR ID.");
      setMessage("");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/volunteer/login");
        return;
      }

      // API Call: POST /volunteer/:volunteerId/mpr/:mprId
      const response = await axios.post(
        `http://localhost:5000/volunteer/${volunteerId}/mpr/${mprId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Assign MPR Response:", response.data);

      setMessage("Missing Person Reporter assigned successfully.");
      setError("");

      setVolunteerId("");
      setMprId("");

    } catch (error: any) {
      console.log(error);

      setMessage("");

      if (error.response) {
        setError(
          error.response.data.message ||
          "Failed to assign Missing Person Reporter."
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

      {/* Right Side - Assign MPR */}
      <main className="flex-1 p-8">

        <h1 className="text-2xl font-bold">
          Assign MPR (Missing Person Reporter)
        </h1>

        <p className="mt-2">
          Assign a Missing Person Reporter to a volunteer.
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

        {/* MPR ID */}
        <label>
          MPR ID (Missing Person Reporter ID)
        </label>

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
          onClick={assignMpr}
          className="border border-gray-500 px-4 py-2"
        >
          Assign MPR
        </button>

        <br />
        <br />

        {/* Success message */}
        {message && (
          <p className="text-600">{message}</p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-600">{error}</p>
        )}

      </main>

    </div>
  );
}