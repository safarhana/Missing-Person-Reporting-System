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
    const token = localStorage.getItem("token");
    const savedVolunteer = localStorage.getItem("volunteer");

    if (!token) {
      router.push("/volunteer/login");
      return;
    }

    if (savedVolunteer) {
      const data = JSON.parse(savedVolunteer);

      setVolunteer(data);
      setFullName(data.fullName || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
    }
  }, [router]);

  const updateVolunteer = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !volunteer) {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated volunteer:", response.data);

      // Update localStorage with new information
      localStorage.setItem(
        "volunteer",
        JSON.stringify(response.data)
      );

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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Update Your Information</h1>

      <br />

      <p>
        <strong>ID:</strong> {volunteer.id}
      </p>

      <p>
        <strong>Username:</strong> {volunteer.username}
      </p>

      <br />

      <label>Full Name</label>
      <br />

      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border border-gray-400"
      />

      <br />
      <br />

      <label>Phone</label>
      <br />

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border border-gray-400"
      />

      <br />
      <br />

      <label>Email</label>
      <br />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-400"
      />

      <br />
      <br />

      <button onClick={updateVolunteer}>
        Update
      </button>

      <br />
      <br />

      <button onClick={() => router.push("/volunteer/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}