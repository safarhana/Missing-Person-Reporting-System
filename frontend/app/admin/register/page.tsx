"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { registerSchema } from "../utils/validation";
import { registerAdmin } from "../services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const result = registerSchema.safeParse({
      username,
      fullName,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!formatted[field]) {
          formatted[field] = issue.message;
        }
      });
      setFieldErrors(formatted);
      return;
    }

    setIsLoading(true);

    try {
      await registerAdmin({
        username,
        fullName,
        password,
        isActive: true,
      });

      setSuccess("Administrator account created successfully! A notification email has been queued. Redirecting to sign in...");
      setTimeout(() => {
        router.push("/admin/login");
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed. Please check your credentials.");
      } else {
        setError("Network error communicating with the registration API.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors"
        >
          ← Back to Administrators
        </Link>
      </div>

      <div className="card rounded-2xl border border-pink-100 bg-white p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600 text-white font-black text-xl shadow-xs mb-3">
            +
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Register Administrator</h2>
          <p className="mt-1 text-xs text-slate-500">
            Create a new administrator account for system management
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="username">
              Username identifier
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_mim"
              disabled={isLoading}
              className={`input input-bordered w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.username
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-pink-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`}
            />
            {fieldErrors.username && (
              <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="fullName">
              Full Legal Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Farhana Mim"
              disabled={isLoading}
              className={`input input-bordered w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.fullName
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-pink-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`}
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars + symbol"
                disabled={isLoading}
                className={`input input-bordered w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.password
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-pink-200 focus:border-pink-500 focus:ring-pink-500/20"
                }`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                disabled={isLoading}
                className={`input input-bordered w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.confirmPassword
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-pink-200 focus:border-pink-500 focus:ring-pink-500/20"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full mt-4 inline-flex items-center justify-center rounded-xl bg-pink-600 hover:bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                Creating Administrator...
              </span>
            ) : (
              "Initialize Account"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-pink-100 text-center">
          <p className="text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/admin/login" className="font-semibold text-pink-600 hover:text-pink-700 underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}