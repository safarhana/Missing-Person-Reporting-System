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
    <main>
      <div>
        <h1>Forgot Password</h1>

        <p>
          Enter your username. A verification code will be
          sent to your registered email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Enter your username"
            />

            {errors.username?.message && (
              <p>{errors.username.message}</p>
            )}
          </div>

          <button type="submit">
            Send Verification Code
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

