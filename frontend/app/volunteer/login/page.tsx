"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../components/volunteerValidation";
import { useRouter } from "next/navigation";
import axios from "axios";



type LoginForm = {
    username: string;
    password: string;   
}

export default function LoginPage() {

  const router = useRouter();

    const {
        register, handleSubmit, formState: { errors }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async(data: LoginForm) => {
        try {
           const response = await axios.post( "http://localhost:5000/auth/volunteer-login",
             data );
              console.log("Login response:", response.data);

              localStorage.setItem("token", response.data.access_token);

               localStorage.setItem( "volunteer",
                      JSON.stringify(response.data.volunteer));

               alert("Login successful!");

               router.push("/volunteer/dashboard");
    }catch(error: any) {

        console.log(error);

        if (error.response) {
           alert( error.response.data.message || "Invalid username or password" );
          } else {
             alert("Cannot connect to backend");
            }
          }
    }

    return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="font-semibold text-primary">Volunteer Portal</p>
          <h1 className="card-title text-3xl">Welcome back</h1>
          <p className="text-sm text-base-content/60">Sign in to manage your volunteer profile.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="label" htmlFor="username"><span className="label-text">Username</span></label>
              <input id="username" type="text" {...register("username")} className="input input-bordered w-full" />
              {errors.username?.message && <p className="mt-1 text-sm text-error">{errors.username.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="password"><span className="label-text">Password</span></label>
              <input id="password" type="password" {...register("password")} className="input input-bordered w-full" />
              {errors.password?.message && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-full">Login</button>
            <div className="flex flex-col gap-2 text-center text-sm">
              <button type="button" className="link link-primary" onClick={() => router.push("/volunteer/register")}>Need an account? Register</button>
              <button type="button" className="link link-hover" onClick={() => router.push("/volunteer/management")}>Management Page</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
