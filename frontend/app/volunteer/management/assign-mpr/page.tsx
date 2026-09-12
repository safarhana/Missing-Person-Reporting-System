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

       const response = await axios.post(
        `http://localhost:5000/volunteer/${volunteerId}/mpr/${mprId}`,
        {},
        {
          withCredentials: true,
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
    <div className="flex min-h-screen flex-col bg-base-200 lg:flex-row">

       <ManagementSidebar />

       <main className="flex-1 p-6 lg:p-12">
      <div className="card mx-auto max-w-2xl border border-base-300 bg-base-100 shadow-sm"><div className="card-body">

        <h1 className="card-title text-3xl">
          Assign MPR (Missing Person Reporter)
        </h1>

        <p className="text-base-content/60">
          Assign a Missing Person Reporter to a volunteer.
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

         <label className="form-control mt-4">
          <span className="label-text">MPR ID (Missing Person Reporter ID)</span>
        <input
          type="text"
          value={mprId}
          onChange={(e) => setMprId(e.target.value)}
          placeholder="Enter MPR ID"
          className="input input-bordered mt-2 w-full"
        />
        </label>

        <button
          onClick={assignMpr}
          className="btn btn-primary mt-4 w-full"
        >
          Assign MPR
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