"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { newPasswordSchema } from "../components/volunteerValidation";

type NewPasswordForm = {
    confirmPassword: string;
    password: string;
}

export default function NewPasswordPage() {
  const router = useRouter();
  const [notification, setNotification] = useState("");


  useEffect(() => {
  const username = sessionStorage.getItem("resetUsername");

  if (!username) {
    return;
  }

  const pusher = new Pusher(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    }
  );

  const channel = pusher.subscribe(`volunteer-${username}`);

  channel.bind("password-reset", (data: {
    message: string;
    username: string;
  }) => {
    setNotification(data.message);

    sessionStorage.removeItem("resetUsername");
    sessionStorage.removeItem("resetCode");

  setTimeout(() => {
    router.push("/volunteer/login");
  }, 1500);
  });

  return () => {
    channel.unbind_all();
    pusher.unsubscribe(`volunteer-${username}`);
    pusher.disconnect();
  };
}, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (data: NewPasswordForm) => {
     const username = sessionStorage.getItem("resetUsername");
    const code = sessionStorage.getItem("resetCode");

    if (!username || !code) {
      alert(
        "Reset information is missing. Please start again."
      );

      router.push("/volunteer/forgot-password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/reset-password",
        {
          username: username,
          code: code,
          password: data.password,
        }
      );

      console.log("Reset password response:", response.data);

    } catch (error: any) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Password reset failed."
        );
      } else {
        alert("Cannot connect to backend.");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
        {notification && (
            <div className="toast toast-top toast-end">
                <div className="alert alert-success">
                     <span>✓ {notification}</span>
                </div>
            </div>
        )}
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body">
        <p className="font-semibold text-primary">Volunteer Portal</p>
        <h1 className="card-title text-3xl">Create new password</h1>

        <p className="text-sm text-base-content/60">
          Enter your new password and confirm your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="label" htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter new password"
              className="input input-bordered w-full"
            />

            {errors.password?.message && (
              <p className="text-sm text-error">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              className="input input-bordered w-full"
            />

            {errors.confirmPassword?.message && (
              <p className="text-sm text-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Reset Password
          </button>
        </form>

        <br />

        <button
          className="btn btn-ghost w-full"
          type="button"
          onClick={() => router.push("/volunteer/login")}
        >
          Back to Login
        </button>
        </div>
      </div>
    </main>
  );
}
