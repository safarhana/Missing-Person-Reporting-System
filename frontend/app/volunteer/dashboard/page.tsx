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
      <div className="min-h-screen bg-base-200">
        <VolunteerNavbar />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8">
            <p className="font-semibold text-primary">Volunteer Portal</p>
            <h1 className="mt-2 text-4xl font-bold">Your dashboard</h1>
            <p className="mt-2 text-base-content/60">Manage your profile and availability from one place.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.35fr]">
            <section className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="card-title">Your information</h2>
                  <span className={`badge ${volunteer?.isActive ? "badge-success" : "badge-error"}`}>{volunteer?.isActive ? "Active" : "Inactive"}</span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[["ID", volunteer?.id], ["Username", volunteer?.username], ["Full name", volunteer?.fullName], ["Email", volunteer?.email], ["Phone", volunteer?.phone]].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-base-200 p-4"><p className="text-sm text-base-content/60">{label}</p><p className="mt-1 font-medium">{value || "Not provided"}</p></div>
                  ))}
                </div>
              </div>
            </section>
            <aside className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-lg">Availability</h2>
                <p className="text-sm text-base-content/70">Update your public status when your availability changes.</p>
                <button className="btn btn-primary mt-4" onClick={toggleStatus}>{volunteer?.isActive ? "Deactivate" : "Activate"} account</button>
                {/* <button className="btn btn-outline mt-2" onClick={logout}>Sign out</button> */}
              </div>
            </aside>
          </div>
        </main>
      </div>
    );
}
