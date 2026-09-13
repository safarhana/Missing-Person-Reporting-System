"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormErrors = {
  email?: string;
  password?: string;
};

export default function CaseOfficerLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
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
        if (path) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const apiEndpoint =
        typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
          ? `${window.location.protocol}//${window.location.hostname}:3000`
          : process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

      let response;
      let lastAxiosError: AxiosError<{ message?: string | string[] }> | null = null;
      try {
        response = await axios.post(
          `${apiEndpoint}/case-officer/login`,
          { email: formData.email, password: formData.password },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      } catch (e) {
        lastAxiosError = e as AxiosError<{ message?: string | string[] }>;
        try {
          response = await axios.post(
            `${apiEndpoint}/auth/case-officer-login`,
            { email: formData.email, password: formData.password },
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
          );
        } catch (e2) {
          lastAxiosError = e2 as AxiosError<{ message?: string | string[] }>;
          throw lastAxiosError;
        }
      }

      const data = response.data;
      if (!data || typeof data !== "object" || (!data.officer && !data.access_token)) {
        setServerError("Invalid response from server. Please check backend connection.");
        return;
      }

      const { officer, access_token } = data;
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

      setServerSuccess("Authentication verified. Loading Case Officer Console...");
      setTimeout(() => router.push("/case-officer"), 800);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;
      const serverMsg = axiosErr.response?.data?.message;
      const message = Array.isArray(serverMsg)
        ? serverMsg.join(", ")
        : serverMsg ||
          (axiosErr.code === "ERR_NETWORK"
            ? "Cannot connect to backend server. Make sure the backend is running on port 3000."
            : "Invalid email or password. Please check your credentials.");
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to Public Portal
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-xl shadow-xs mb-3">
            C
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Case Officer Sign In
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Authorized case officer access for Missing Person Reporting System
          </p>
        </div>

        {serverError && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            {serverError}
          </div>
        )}
        {serverSuccess && (
          <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
            {serverSuccess}
          </div>
        )}

        <form action="#" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              htmlFor="email"
            >
              Officer Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="officer@gmail.com"
              disabled={isLoading}
              className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Need to register?{" "}
            <Link
              href="/case-officer/register"
              className="font-semibold text-slate-900 hover:text-slate-700 underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
