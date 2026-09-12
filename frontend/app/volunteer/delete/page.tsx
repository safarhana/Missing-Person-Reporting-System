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

export default function DeleteVolunteer() {
  const router = useRouter();

  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedVolunteer = localStorage.getItem("volunteer");

    if (savedVolunteer) {
      const data = JSON.parse(savedVolunteer);

      setVolunteer(data);
      setUsername(data.username);
    }
  }, [router]);

  const deleteAccount = async () => {
    if (!volunteer) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/volunteer/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/volunteer/${volunteer.id}`,
        {
          withCredentials: true,
          data: {
            username: username,
            password: password,
          },
        }
      );

      console.log("Delete response:", response.data);

      localStorage.removeItem("token");
      localStorage.removeItem("volunteer");

      alert("Account deleted successfully.");

      router.push("/volunteer/login");

    } catch (error: any) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Invalid username or password"
        );
      } else {
        alert("Cannot connect to backend");
      }
    }
  };

  const handleDelete = () => {
    if (!password) {
    alert("Please fill in the password field.");
    return;
  }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (confirmed) {
      deleteAccount();
    }
  };

  if (!volunteer) {
    return <div className="flex min-h-screen items-center justify-center bg-base-200"><span className="loading loading-spinner loading-lg text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-xl px-6 py-12">
        <div className="card border border-error/30 bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="font-semibold text-error">Account settings</p>
            <h1 className="card-title text-3xl">Delete account</h1>
            <p className="text-sm text-base-content/60">This action is permanent. Confirm your credentials to continue.</p>
            <div className="mt-4 rounded-xl bg-base-200 p-4 text-sm"><span className="font-semibold">Volunteer #{volunteer.id}</span> · @{volunteer.username}</div>
            <label className="form-control mt-4"><span className="label-text mb-2">Username</span><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered w-full" /></label>
            <label className="form-control mt-4"><span className="label-text mb-2">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" /></label>
            <button className="btn btn-error mt-4" onClick={handleDelete}>Delete account</button>
            <button className="btn btn-ghost" onClick={() => router.push("/volunteer/dashboard")}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}