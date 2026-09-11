"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyCodeSchema } from "../components/volunteerValidation";

type VerifyCodeForm = {
    code: string;
}

export default function VerifyCodePage() {
  const router = useRouter();

  const { register, handleSubmit,formState: { errors }, } = useForm<VerifyCodeForm>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const onSubmit = async (data: VerifyCodeForm) => {
     const username = sessionStorage.getItem("resetUsername");

    if (!username) {
      alert(
        "Username not found. Please request a new verification code."
      );

      router.push("/volunteer/forgot-password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/verify-reset-code",
        {
          username: username,
          code: data.code,
        }
      );

      console.log("Verify code response:", response.data);

      alert(response.data.message);

      sessionStorage.setItem("resetCode", data.code);

      router.push("/volunteer/new-password");
    } catch (error: any) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Invalid verification code."
        );
      } else {
        alert("Cannot connect to backend.");
      }
    }
  };

  return (
    <main>
      <div>
        <h1>Verify Code</h1>

        <p>
          Enter the 6-digit verification code sent to
          your registered email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="code">
              Verification Code
            </label>

            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              {...register("code")}
              placeholder="Enter 6-digit code"
            />

            {errors.code?.message && (
              <p>{errors.code.message}</p>
            )}
          </div>

          <button type="submit">
            Verify Code
          </button>
        </form>

        <br />

        <button
          type="button"
          onClick={() =>
            router.push("/volunteer/forgot-password")
          }
        >
          Request New Code
        </button>
      </div>
    </main>
  );
}

