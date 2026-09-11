"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { newPasswordSchema } from "../components/volunteerValidation";

type NewPasswordForm = {
    confirmPassword: string;
    password: string;
}

export default function NewPasswordPage() {
  const router = useRouter();

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

      alert(response.data.message);

      sessionStorage.removeItem("resetUsername");
      sessionStorage.removeItem("resetCode");

      // Go back to login
      router.push("/volunteer/login");
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
    <main>
      <div>
        <h1>New Password</h1>

        <p>
          Enter your new password and confirm your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter new password"
            />

            {errors.password?.message && (
              <p>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
            />

            {errors.confirmPassword?.message && (
              <p>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit">
            Reset Password
          </button>
        </form>

        <br />

        <button
          type="button"
          onClick={() => router.push("/volunteer/login")}
        >
          Back to Login
        </button>
      </div>
    </main>
  );
}

