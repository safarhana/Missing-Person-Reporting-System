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
    <div className="admin-main-centered">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            👤
          </div>
          <h1 className="auth-title">Admin Registration</h1>
          <p className="auth-subtitle">Create a secure MPRS administrator account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="letters, numbers, underscores"
              disabled={isLoading}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="letters and spaces only"
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
              placeholder="Min 6 chars, 1 special char"
              disabled={isLoading}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="re-enter password"
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
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already registered?{" "}
            <Link href="/admin/login" className="auth-footer-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}