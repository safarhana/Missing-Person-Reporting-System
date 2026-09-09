 "use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ManagementSidebar from "../../components/managementSidebar";

export default function RemoveAdminPage() {
  const router = useRouter();

  const [volunteerId, setVolunteerId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const removeAdmin = async () => {
    // Check Volunteer ID
    if (!volunteerId.trim()) {
      setError("Please enter Volunteer ID.");
      setMessage("");
      return;
    }

    // Confirmation popup
    const confirmed = window.confirm(
      "Are you sure you want to remove the admin from this volunteer?"
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
        `http://localhost:5000/volunteer/${volunteerId}/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Remove Admin Response:", response.data);

      setMessage("Admin removed successfully.");
      setError("");

      // Clear input
      setVolunteerId("");

    } catch (error: any) {
      console.log(error);

      setMessage("");

      if (error.response) {
        setError(
          error.response.data.message ||
          "Failed to remove admin."
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

        <h1 className="text-2xl font-bold">
          Remove Admin
        </h1>

        <p className="mt-2">
          Remove the admin assigned to a volunteer.
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

        <button
          onClick={removeAdmin}
          className="border border-gray-500 px-4 py-2"
        >
          Remove Admin
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