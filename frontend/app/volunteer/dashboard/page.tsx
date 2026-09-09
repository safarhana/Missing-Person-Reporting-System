"use client"

import VolunteerNavbar from "../components/volunteerNavbar"; 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Volunteer = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
};


export default function  VolunteerDashboard() {

    const router = useRouter();
    const [volunteer, setVolunteer] =
    useState<Volunteer | null>(null);

  useEffect(() => {
     const token = localStorage.getItem("token");
    const savedVolunteer =
      localStorage.getItem("volunteer");

    if (!token) {
      router.push("/volunteer/login");
      return;
    }

    if (savedVolunteer) {
      setVolunteer(JSON.parse(savedVolunteer));
    }

  }, [router]);

const toggleStatus = async () => {
  if (!volunteer) return;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `http://localhost:5000/volunteer/${volunteer.id}/status`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setVolunteer(response.data);

    localStorage.setItem(
      "volunteer",
      JSON.stringify(response.data)
    );

    alert("Status updated successfully!");
  } catch (error: any) {
    console.log("Status update error:", error);
    console.log("Response:", error.response?.data);
    console.log("Status:", error.response?.status);

    alert(
      error.response?.data?.message ||
      "Failed to update status"
    );
  }
};
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("volunteer");

    router.push("/volunteer/login");
  };


    return (
        <div>

            <VolunteerNavbar />

            <h1>Volunteer Dashboard</h1>
            <br />
            <h2>Your Information</h2>

            <p>
                <strong>ID:</strong> {volunteer?.id}
            </p>

            <p>
                <strong>Username:</strong> {volunteer?.username}
            </p>

            <p>
                <strong>Full Name:</strong> {volunteer?.fullName}
            </p>

            <p>
                <strong>Email:</strong> {volunteer?.email}
            </p>

            <p>
                <strong>Phone:</strong> {volunteer?.phone}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                {volunteer?.isActive ? "Active" : "Inactive"}
            </p>

            <button onClick={toggleStatus}>Deactivate Account: 
            {volunteer?.isActive ? "Deactivate" : "Activate"}
            </button>

            <br />

        </div>
    );
}

