"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(/^[a-zA-Z0-9\s]+$/, "Name must not contain special characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please provide a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^01[0-9]*$/, "Phone number must start with 01"),
    country: z
      .string()
      .max(30, "Country name must be at most 30 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  country?: string;
  file?: string;
};

export default function CaseOfficerRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Bangladesh",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setErrors((prev) => ({ ...prev, file: "Only PDF files are accepted" }));
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setErrors((prev) => ({ ...prev, file: undefined }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");
    setErrors({});

    const validation = registerSchema.safeParse(formData);
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

      if (selectedFile) {
        const data = new FormData();
        data.append("name", formData.name.trim());
        data.append("email", formData.email.trim());
        data.append("password", formData.password);
        data.append("phone", formData.phone.trim());
        if (formData.country) data.append("country", formData.country.trim());
        data.append("file", selectedFile);

        await axios.post(`${apiEndpoint}/case-officer/register`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        await axios.post(
          `${apiEndpoint}/case-officer/register`,
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            country: formData.country ? formData.country.trim() : "Unknown",
          },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      }

      setServerSuccess(
        "Registration successful! Your Case Officer account has been created. Redirecting to login..."
      );
      setTimeout(() => router.push("/case-officer/login"), 1500);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;
      const serverMsg = axiosErr.response?.data?.message;
      const message = Array.isArray(serverMsg)
        ? serverMsg.join(", ")
        : serverMsg ||
          (axiosErr.code === "ERR_NETWORK"
            ? "Cannot connect to backend server. Make sure the backend is running on port 3000."
            : "Registration failed: Email already registered or invalid inputs.");
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500/20"
        : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
    }`;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <Link
          href="/case-officer/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to Sign In
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-xl shadow-xs mb-3">
            +
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Register Case Officer
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Create a new Case Officer account for MPRS operations
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
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="e.g. Robert Ahmed" disabled={isLoading} className={inputClass("name")} />
            {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="officer@gmail.com" disabled={isLoading} className={inputClass("email")} />
            {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="phone">
              Phone Number (starts with 01)
            </label>
            <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleInputChange} placeholder="01XXXXXXXXX" disabled={isLoading} className={inputClass("phone")} />
            {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>}
          </div>

          {/* Password row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Min 6 chars" disabled={isLoading} className={inputClass("password")} />
              {errors.password && <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Re-enter password" disabled={isLoading} className={inputClass("confirmPassword")} />
              {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="country">
              Country / District
            </label>
            <input id="country" name="country" type="text" value={formData.country} onChange={handleInputChange} placeholder="Bangladesh" disabled={isLoading} className={inputClass("country")} />
          </div>

          {/* File */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="file">
              Verification Document / Badge (Optional PDF)
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700 cursor-pointer"
            />
            {errors.file && <p className="mt-1 text-[11px] text-red-600">{errors.file}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              "Register Account"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/case-officer/login" className="font-semibold text-slate-900 hover:text-slate-700 underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
