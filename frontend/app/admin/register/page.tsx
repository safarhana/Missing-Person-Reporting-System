"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username must be at most 100 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(150, "Full name must be at most 150 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, "Password must contain at least one special character"),

  confirmPassword: z
    .string()
    .min(1, "Confirm password is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const result = registerSchema.safeParse({
      username,
      fullName,
      password,
      confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
      await axios.post(
        `${apiEndpoint}/admin`,
        {
          username,
          fullName,
          password,
          isActive: true,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setSuccess("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/admin/login");
      }, 1500);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;
      const msg = axiosErr.response?.data?.message || "Registration failed. Please try again.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        {" | "}
        <Link href="/admin/login">Admin Login</Link>
      </nav>
      <hr />

      <h1>Admin Registration</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Full Name: </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Confirm Password: </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}