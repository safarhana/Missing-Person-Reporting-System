"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import OfficerNavbar from "../components/OfficerNavbar";

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
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
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

      if (selectedFile) {
        const data = new FormData();
        data.append("name", formData.name.trim());
        data.append("email", formData.email.trim());
        data.append("password", formData.password);
        data.append("phone", formData.phone.trim());
        if (formData.country) {
          data.append("country", formData.country.trim());
        }
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
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      }

      setServerSuccess(
        "Registration successful! Your Case Officer account has been created. Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/case-officer/login");
      }, 1500);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;
      const message =
        axiosErr.response?.data?.message ||
        "Registration failed: Network Error or email already registered.";
      setServerError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <OfficerNavbar />

      <main>
        <h1>Case Officer Registration</h1>
        <p>
          Already have an account?{" "}
          <Link href="/case-officer/login">
            Sign In here
          </Link>
        </p>

        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
        {serverSuccess && <p style={{ color: "green" }}>{serverSuccess}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name: </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="robert"
            />
            {errors.name && <span style={{ color: "red" }}> {errors.name}</span>}
          </div>
          <br />

          <div>
            <label>Email: </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="robert@gmail.xyz"
            />
            {errors.email && <span style={{ color: "red" }}> {errors.email}</span>}
          </div>
          <br />

          <div>
            <label>Phone Number (starts with 01): </label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="0123456789"
            />
            {errors.phone && <span style={{ color: "red" }}> {errors.phone}</span>}
          </div>
          <br />

          <div>
            <label>Password: </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••"
            />
            {errors.password && <span style={{ color: "red" }}> {errors.password}</span>}
          </div>
          <br />

          <div>
            <label>Confirm Password: </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••"
            />
            {errors.confirmPassword && (
              <span style={{ color: "red" }}> {errors.confirmPassword}</span>
            )}
          </div>
          <br />

          <div>
            <label>Country / District: </label>
            <input
              name="country"
              type="text"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Bangladesh"
            />
          </div>
          <br />

          <div>
            <label>Verification Document / Badge (Optional PDF): </label>
            <input
              name="file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />
            {errors.file && <span style={{ color: "red" }}> {errors.file}</span>}
          </div>
          <br />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </main>
    </div>
  );
}
