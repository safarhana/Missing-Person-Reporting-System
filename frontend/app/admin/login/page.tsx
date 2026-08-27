"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

// Zod schema matching NestJS backend LoginDto validation rules
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const result = loginSchema.safeParse({
      username,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
      const response = await axios.post(
        `${apiEndpoint}/auth/login`,
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Save token and username in sessionStorage
      sessionStorage.setItem("token", response.data.access_token);
      sessionStorage.setItem("username", username);

      setSuccess("Login successful! Redirecting to dashboard...");
      
      // Redirect to dashboard page
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid username or password.");
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}