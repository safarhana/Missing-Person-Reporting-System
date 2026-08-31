"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import axios from "axios";
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
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <nav>
        <Link href="/">← Back to Home</Link>
      </nav>

      <header>
        <h1>Admin Registration</h1>
        <p>Create a secure MPRS administrator account</p>
      </header>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Account Details</legend>

          <div>
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="letters, numbers, underscores"
              disabled={isLoading}
              required
            />
          </div>
          <br />

          <div>
            <label htmlFor="fullName">Full Name: </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="letters and spaces only"
              disabled={isLoading}
              required
            />
          </div>
          <br />

          <div>
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 chars, 1 special char"
              disabled={isLoading}
              required
            />
          </div>
          <br />

          <div>
            <label htmlFor="confirmPassword">Confirm Password: </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="re-enter password"
              disabled={isLoading}
              required
            />
          </div>
          <br />

          {error && <p><strong>Error:</strong> {error}</p>}
          {success && <p><strong>Success:</strong> {success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </fieldset>
      </form>

      <footer>
        <p>
          Already registered?{" "}
          <Link href="/admin/login">Sign In</Link>
        </p>
      </footer>
    </main>
  );
}