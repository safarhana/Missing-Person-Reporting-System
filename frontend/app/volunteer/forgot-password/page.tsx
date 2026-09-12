 "use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPasswordSchema } from "../components/volunteerValidation";

type ForgotPasswordForm = {
    username: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        data
      );

      console.log("Forgot password response:", response.data);

      alert(response.data.message);

      sessionStorage.setItem("resetUsername", data.username);

      router.push("/volunteer/verify-code");
    } catch (error: any) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Failed to send verification code."
        );
      } else {
        alert("Cannot connect to backend.");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body">
        <p className="font-semibold text-primary">Volunteer Portal</p>
        <h1 className="card-title text-3xl">Forgot password</h1>

        <p className="text-sm text-base-content/60">
          Enter your username. A verification code will be
          sent to your registered email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Enter your username"
              className="input input-bordered w-full"
            />

            {errors.username?.message && (
              <p className="text-sm text-error">{errors.username.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Send Verification Code
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
