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
     if (!volunteerId.trim()) {
      setError("Please enter Volunteer ID.");
      setMessage("");
      return;
    }

     const confirmed = window.confirm(
      "Are you sure you want to remove the admin from this volunteer?"
    );

    if (!confirmed) {
      return;
    }

    try {

      const response = await axios.delete(
        `http://localhost:5000/volunteer/${volunteerId}/admin`,
        {
          withCredentials: true,
        }
      );

      console.log("Remove Admin Response:", response.data);

      setMessage("Admin removed successfully.");
      setError("");

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
    <div className="flex min-h-screen flex-col bg-base-200 lg:flex-row">

       <ManagementSidebar />

       <main className="flex-1 p-6 lg:p-12">
      <div className="card mx-auto max-w-2xl border border-base-300 bg-base-100 shadow-sm"><div className="card-body">

        <h1 className="card-title text-3xl">
          Remove Admin
        </h1>

        <p className="text-base-content/60">
          Remove the admin assigned to a volunteer.
        </p>

        <label className="form-control mt-6">
          <span className="label-text">Volunteer ID</span>
        <input
          type="text"
          value={volunteerId}
          onChange={(e) => setVolunteerId(e.target.value)}
          placeholder="Enter Volunteer ID"
          className="input input-bordered mt-2 w-full"
        />
        </label>

        <button
          onClick={removeAdmin}
          className="btn btn-error mt-4 w-full"
        >
          Remove Admin
        </button>

         {message && (
          <div className="alert alert-success">{message}</div>
        )}

         {error && (
          <div className="alert alert-error">{error}</div>
        )}

      </div></div></main>
    </div>
  );
}