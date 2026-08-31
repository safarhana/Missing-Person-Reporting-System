"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
      const response = await axios.post(
        `${apiEndpoint}/auth/login`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      sessionStorage.setItem("token", response.data.access_token);
      sessionStorage.setItem("username", username);

      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid username or password.");
      } else {
        setError("Invalid username or password.");
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
        <h1>Admin Portal</h1>
        <p>Access MPRS Admin Console</p>
      </header>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Admin Login</legend>

          <div>
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_mim"
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
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>
          <br />

          {error && <p><strong>Error:</strong> {error}</p>}
          {success && <p><strong>Success:</strong> {success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </fieldset>
      </form>

      <footer>
        <p>
          Don&apos;t have an admin account?{" "}
          <Link href="/admin/register">Register now</Link>
        </p>
      </footer>
    </main>
  );
}