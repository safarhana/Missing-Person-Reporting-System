"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Volunteer = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export default function UpdateVolunteer() {
  const router = useRouter();

  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

 useEffect(() => {
  const getVolunteer = async () => {
    try {
      const savedVolunteer =
        localStorage.getItem("volunteer");

      if (!savedVolunteer) {
        router.push("/volunteer/login");
        return;
      }

      const savedData = JSON.parse(savedVolunteer);

      const response = await axios.get(
        `http://localhost:5000/volunteer/${savedData.id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      setVolunteer(data);
      setFullName(data.fullName || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");

    } catch (error: any) {
      console.log(error);

      if (error.response?.status === 401) {
        router.push("/volunteer/login");
      }
    }
  };

  getVolunteer();
}, [router]);

  const updateVolunteer = async () => {
    try {

      if (!volunteer) {
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/volunteer/${volunteer.id}`,
        {
          fullName: fullName,
          phone: phone,
          email: email,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Updated volunteer:", response.data);

      // Update localStorage with new information
      localStorage.setItem(
        "volunteer",
        JSON.stringify(response.data)
      );
        setVolunteer(response.data);

      alert("Information updated successfully!");

      router.push("/volunteer/dashboard");
    } catch (error: any) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Failed to update information"
        );
      } else {
        alert("Cannot connect to backend");
      }
    }
  };

  if (!volunteer) {
    return <div className="flex min-h-screen items-center justify-center bg-base-200"><span className="loading loading-spinner loading-lg text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="card border border-base-300 bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="font-semibold text-primary">Volunteer Portal</p>
            <h1 className="card-title text-3xl">Update your information</h1>
            <p className="text-sm text-base-content/60">Keep your contact information accurate.</p>
            <div className="mt-4 rounded-xl bg-base-200 p-4 text-sm"><span className="font-semibold">#{volunteer.id}</span> · @{volunteer.username}</div>
            <div className="mt-4 space-y-4">
              {[
                ["Full name", fullName, setFullName, "text"],
                ["Phone", phone, setPhone, "text"],
                ["Email", email, setEmail, "email"],
              ].map(([label, value, setter, type]) => (
                <label key={label as string} className="form-control">
                  <span className="label-text mb-2">{label as string}</span>
                  <input type={type as string} value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} className="input input-bordered w-full" />
                </label>
              ))}
            </div>
            <button className="btn btn-primary mt-4" onClick={updateVolunteer}>Save changes</button>
            <button className="btn btn-ghost" onClick={() => router.push("/volunteer/dashboard")}>Back to dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}