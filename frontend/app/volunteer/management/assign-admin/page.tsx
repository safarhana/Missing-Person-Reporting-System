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
     if (!volunteerId.trim()) {
      setError("Please enter Volunteer ID.");
      setMessage("");
      return;
    }

     if (!adminId.trim()) {
      setError("Please enter Admin ID.");
      setMessage("");
      return;
    }

    try {

      const response = await axios.patch(
        `http://localhost:5000/volunteer/${volunteerId}/admin/${adminId}`,
        {},
        {
          withCredentials: true,
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
    <div className="flex min-h-screen flex-col bg-base-200 lg:flex-row">

       <ManagementSidebar />

       <main className="flex-1 p-6 lg:p-12">
        <div className="card mx-auto max-w-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">

        <h1 className="card-title text-3xl">
          Assign Admin
        </h1>

        <p className="text-base-content/60">
          Assign an admin to a volunteer.
        </p>

        <div className="mt-6 space-y-4">
        <label className="form-control">
          <span className="label-text">Volunteer ID</span>
        <input
          type="text"
          value={volunteerId}
          onChange={(e) => setVolunteerId(e.target.value)}
          placeholder="Enter Volunteer ID"
          className="input input-bordered mt-2 w-full"
        />
        </label>
        <label className="form-control">
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
          onClick={assignAdmin}
          className="btn btn-primary w-full"
        >
          Assign Admin
        </button>

         {message && (
          <div className="alert alert-success">{message}</div>
        )}

         {error && (
          <div className="alert alert-error">{error}</div>
        )}

        </div>
        </div>
        </div>
      </main>

    </div>
  );
}