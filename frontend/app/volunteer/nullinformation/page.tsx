"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type Volunteer = {
  id: number;
  username: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
};

export default function NullInformationPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const getVolunteers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/volunteer/getVolunteersWithMissingInfo"
        );

        console.log("Response:", response.data);

        setVolunteers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getVolunteers();
  }, []);

  return (
    <main className="min-h-screen bg-base-200 px-6 py-12">
      <div className="mx-auto max-w-5xl">
      <p className="font-semibold text-primary">Coordinator workspace</p>
      <h1 className="mt-2 text-3xl font-bold">Volunteers with missing information</h1>
      <p className="mt-2 text-base-content/60">Review profiles that still need contact details.</p>

      {volunteers.length === 0 && <div className="alert alert-info mt-8">No volunteers with missing information were found.</div>}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
      {volunteers.map((volunteer) => (
        <div className="card border border-base-300 bg-base-100 shadow-sm" key={volunteer.id}>
          <div className="card-body">
          <p>ID: {volunteer.id}</p>
          <p>Username: {volunteer.username}</p>
          <p>Full Name: {volunteer.fullName || "Missing"}</p>
          <p>Email: {volunteer.email || "Missing"}</p>
          <p>Phone: {volunteer.phone || "Missing"}</p>
          <span className={`badge mt-3 ${volunteer.isActive ? "badge-success" : "badge-ghost"}`}>{volunteer.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>
      ))}
      </div>
      </div>
    </main>
  );
}