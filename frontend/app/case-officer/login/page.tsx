"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import OfficerNavbar from "../components/OfficerNavbar";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

type FormErrors = {
  email?: string;
  password?: string;
};

export default function CaseOfficerLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");
    setErrors({});

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: FormErrors = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormErrors;
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const apiEndpoint =
        process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

      let response;
      try {
        response = await axios.post(
          `${apiEndpoint}/case-officer/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch {
        response = await axios.post(
          `${apiEndpoint}/auth/case-officer-login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      }

      const { officer, access_token } = response.data || {};

      if (access_token) {
        sessionStorage.setItem("token", access_token);
        localStorage.setItem("token", access_token);
      } else {
        sessionStorage.setItem("token", "dummy-session-token");
      }

      if (officer) {
        sessionStorage.setItem("officer", JSON.stringify(officer));
        localStorage.setItem("officer", JSON.stringify(officer));
        sessionStorage.setItem("username", officer.name);
      }

      setServerSuccess("Login successful! Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/case-officer");
      }, 1000);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;
      const message =
        axiosErr.response?.data?.message ||
        "Invalid email or password. Please check your credentials.";
      setServerError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <OfficerNavbar />

      <main>
        <h1>Case Officer Sign In</h1>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/case-officer/register">
            Register here
          </Link>
        </p>

        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
        {serverSuccess && <p style={{ color: "green" }}>{serverSuccess}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Officer Email: </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="officer@gmail.com"
            />
            {errors.email && <span style={{ color: "red" }}> {errors.email}</span>}
          </div>
          <br />

          <div>
            <label>Password: </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
            />
            {errors.password && <span style={{ color: "red" }}> {errors.password}</span>}
          </div>
          <br />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </main>
    </div>
  );
}
