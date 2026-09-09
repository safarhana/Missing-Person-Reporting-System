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
    const token = localStorage.getItem("token");
    const savedVolunteer = localStorage.getItem("volunteer");

    if (!token) {
      router.push("/volunteer/login");
      return;
    }

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Delete Account</h1>

      <p>
        <strong>ID:</strong> {volunteer.id}
      </p>

      <br />

      <label>Username</label>
      <br />

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-gray-400"
      />

      <br />
      <br />

      <label>Password</label>
      <br />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-400"
      />

      <br />
      <br />

      <button onClick={handleDelete}>
        Delete Account
      </button>

      <br />
      <br />

      <button onClick={() => router.push("/volunteer/dashboard")}>
        Cancel
      </button>
    </div>
  );
}