"use client";

import axios from "axios";
import { useState } from "react";

type StatusButtonProps = {
  id: number;
  initialStatus: boolean;
};

export default function StatusButton({
  id,
  initialStatus,
}: StatusButtonProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:5000/volunteer/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsActive(response.data.isActive);

      alert(
        response.data.isActive
          ? "Volunteer activated!"
          : "Volunteer deactivated!"
      );
    } catch (error: any) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to update volunteer status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // <button
    //   onClick={toggleStatus}
    //   disabled={loading}
    //   className={`btn ${
    //     isActive ? "btn-error" : "btn-success"
    //   }`}
    // >
    //   {loading
    //     ? "Updating..."
    //     : isActive
    //     ? "Deactivate"
    //     : "Activate"}
    // </button>
 <button
      onClick={toggleStatus}
      disabled={loading}
      className={`badge badge-lg cursor-pointer ${
        isActive ? "badge-success" : "badge-error"
      }`}
    >
      {loading
        ? "Updating..."
        : isActive
        ? "Active"
        : "Inactive"}
    </button>

  );
}