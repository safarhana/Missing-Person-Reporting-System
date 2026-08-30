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
    <div className="admin-main-centered">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            🔑
          </div>
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-subtitle">Access MPRS Admin Console</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_mim"
              disabled={isLoading}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="input-field"
            />
          </div>

          {error && (
            <div className="status-alert error">
              {error}
            </div>
          )}

          {success && (
            <div className="status-alert success">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="admin-btn admin-btn-primary btn-large"
          >
            {isLoading ? (
              <div className="btn-spinner"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don&apos;t have an admin account?{" "}
            <Link href="/admin/register" className="auth-footer-link">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}